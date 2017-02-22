package fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.activities;

import org.json.*;
import java.util.*;
import android.os.*;
import android.text.*;
import android.view.*;
import android.widget.*;
import android.content.*;
import android.preference.*;
import java.util.concurrent.*;
import android.support.v7.app.*;
import android.support.annotation.*;
import fr.unicaen.info.users.hivinaugraffe.apps.android.httpclient.*;
import fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.R;
import fr.unicaen.info.users.hivinaugraffe.apps.android.httpclient.events.*;
import fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.globals.*;
import fr.unicaen.info.users.hivinaugraffe.apps.android.httpclient.listeners.*;
import fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.services.*;
import fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.validators.*;

public class MainActivity extends AppCompatActivity {

    private EditText identifiantEditText = null;
    private EditText passwordEditText = null;
    private ImageView identifiantErrorImageView = null;
    private ImageView passwordErrorImageView = null;
    private ProgressBar authenticateProgressBar = null;
    private Button authenticateButton = null;

    private final ExecutorService executor;
    private final List<Future<?>> threads;
    private boolean requesting = false;
    private SharedPreferences preferences = null;
    private boolean serviceConnectionEstablished = false;
    private LocationService locationService = null;

    private static final int CORE_POOL_SIZE = 5;
    private static final int MAXIMUM_THREADS = 8;

    private final ServiceConnection connection = new ServiceConnection() {

        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {

            LocationService.LocationServiceBinder binder = (LocationService.LocationServiceBinder) service;

            locationService = binder.getLocationService();
            serviceConnectionEstablished = true;

            String email = preferences.getString(Constant.Api.Json.EMAIL, null);
            String password = preferences.getString(Constant.Api.Json.PASSWORD, null);

            boolean hasIdentifiant = (email != null && email.length() > 0);
            boolean hasPassword = (password != null && password.length() > 0);

            if(locationService != null) {

                locationService.setRequestEnabled(hasIdentifiant && hasPassword);
            }
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {

            serviceConnectionEstablished = false;
        }
    };

    private TextWatcher textWatcher = new TextWatcher() {

        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            //TODO: nothing
        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {

            if(identifiantEditText.hasFocus()) {

                boolean identifiantValid = new EmailValidator().validate(s.toString().trim());
                identifiantErrorImageView.setVisibility(identifiantValid ? View.GONE : View.VISIBLE);

            } else if(passwordEditText.hasFocus()) {

                boolean passwordValid = new PasswordValidator().validate(s.toString().trim());
                passwordErrorImageView.setVisibility(passwordValid ? View.GONE : View.VISIBLE);
            }
        }

        @Override
        public void afterTextChanged(Editable s) {

            //TODO: nothing
        }
    };

    private HttpClientListener tokenRegistrer = new HttpClientListener() {

        @Override
        public void onEventOccured(final HttpClientEvent event, final boolean failed) {

            MainActivity.this.runOnUiThread(new Runnable() {

                @Override
                public void run() {

                    authenticateProgressBar.setVisibility(View.GONE);
                    requesting = false;

                    Object response = event.getRawResponse();

                    if(failed) {

                        if(response instanceof Exception) {

                            ((Exception) response).printStackTrace();
                        }
                    } else if(response instanceof String) {

                        String content = (String) response;

                        try {

                            JSONObject json = new JSONObject(content);

                            if(json.has(Constant.Api.Json.TOKEN)) {

                                SharedPreferences.Editor editor = preferences.edit();

                                String token = json.getString(Constant.Api.Json.TOKEN);

                                editor.putString(Constant.Api.Json.TOKEN, token);
                                editor.apply();

                                authenticateButton.setText(R.string.logout);
                                identifiantEditText.setEnabled(false);
                                passwordEditText.setEnabled(false);

                                if(locationService != null) {

                                    locationService.setRequestEnabled(true);
                                }
                            }

                        } catch (JSONException exception) {

                            exception.printStackTrace();
                        }
                    }
                }
            });

        }
    };

    public MainActivity() {

        executor= new ThreadPoolExecutor(MainActivity.CORE_POOL_SIZE,
                MainActivity.MAXIMUM_THREADS,
                1000, TimeUnit.SECONDS,
                new LinkedBlockingQueue<Runnable>());
        threads = new ArrayList<>();
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.authentication);

        identifiantEditText = (EditText) findViewById(R.id.user_name_edittext);
        passwordEditText = (EditText) findViewById(R.id.user_password_edittext);
        identifiantErrorImageView = (ImageView) findViewById(R.id.user_name_error_imageview);
        passwordErrorImageView = (ImageView) findViewById(R.id.user_password_error_imageview);
        authenticateProgressBar = (ProgressBar) findViewById(R.id.authenticate_progressbar);
        authenticateButton = (Button) findViewById(R.id.authenticate_button);

        preferences = PreferenceManager.getDefaultSharedPreferences(MainActivity.this);
    }

    @Override
    protected void onResume() {
        super.onResume();

        identifiantEditText.addTextChangedListener(textWatcher);
        passwordEditText.addTextChangedListener(textWatcher);

        String email = preferences.getString(Constant.Api.Json.EMAIL, null);
        String password = preferences.getString(Constant.Api.Json.PASSWORD, null);

        identifiantEditText.setText(email);
        passwordEditText.setText(password);

        boolean hasIdentifiant = (email != null && email.length() > 0);
        boolean hasPassword = (password != null && password.length() > 0);

        identifiantEditText.setEnabled(!hasIdentifiant);
        passwordEditText.setEnabled(!hasPassword);

        authenticateButton.setText(hasIdentifiant && hasPassword ? R.string.logout : R.string.login);

        Intent rssIntent = new Intent(MainActivity.this, LocationService.class);
        bindService(rssIntent, connection, Context.BIND_AUTO_CREATE);
    }

    @Override
    protected void onPause() {
        super.onPause();

        identifiantEditText.removeTextChangedListener(textWatcher);
        passwordEditText.removeTextChangedListener(textWatcher);

        if(serviceConnectionEstablished) {

            unbindService(connection);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        for (Iterator<Future<?>> iterator = threads.iterator(); iterator.hasNext();) {

            Future<?> thread = iterator.next();

            if(!thread.isCancelled()) {

                thread.cancel(true);
            }

            iterator.remove();
        }

        executor.shutdownNow();
    }

    public void onClick(View view) {

        String email = preferences.getString(Constant.Api.Json.EMAIL, null);
        String password = preferences.getString(Constant.Api.Json.PASSWORD, null);

        boolean hasIdentifiant = (email != null && email.length() > 0);
        boolean hasPassword = (password != null && password.length() > 0);

        if(hasIdentifiant && hasPassword) {

            //logout

            try {

                JSONObject parameters = new JSONObject();

                parameters.put(Constant.Api.Json.EMAIL, email);

                String token = preferences.getString(Constant.Api.Json.TOKEN, null);

                if(token != null) {

                    parameters.put(Constant.Api.Json.TOKEN, token);
                }

                HttpClient client = new HttpClient(this, Constant.Api.UNREGISTRATION, HttpClient.POST);

                client.setListener(new HttpClientListener() {
                    @Override
                    public void onEventOccured(HttpClientEvent event, boolean failed) {

                        if(!failed) {

                            MainActivity.this.runOnUiThread(new Runnable() {

                                @Override
                                public void run() {

                                    SharedPreferences.Editor editor = preferences.edit();
                                    editor.clear();
                                    editor.apply();

                                    authenticateButton.setText(R.string.login);
                                    identifiantEditText.setEnabled(true);
                                    passwordEditText.setEnabled(true);

                                    if(locationService != null) {

                                        locationService.setRequestEnabled(false);
                                    }
                                }
                            });

                        }
                    }
                });

                client.requestHeader("Content-Type", "application/json; charset=UTF-8");
                client.requestParameter(parameters.toString());

                Future<?> thread = executor.submit(client);
                threads.add(thread);

            } catch (JSONException exception) {

                exception.printStackTrace();
            }


        } else {

            //login

            boolean identifiantValid = new EmailValidator().validate(identifiantEditText.getText().toString().trim());
            identifiantErrorImageView.setVisibility(identifiantValid ? View.GONE : View.VISIBLE);

            boolean passwordValid = new PasswordValidator().validate(passwordEditText.getText().toString().trim());
            passwordErrorImageView.setVisibility(passwordValid ? View.GONE : View.VISIBLE);

            if(identifiantValid && passwordValid && !requesting) {

                authenticateProgressBar.setVisibility(View.VISIBLE);

                SharedPreferences.Editor editor = preferences.edit();

                editor.putString(Constant.Api.Json.EMAIL, identifiantEditText.getText().toString());
                editor.putString(Constant.Api.Json.PASSWORD, passwordEditText.getText().toString());

                editor.apply();

                try {

                    JSONObject parameters = new JSONObject();

                    parameters.put(Constant.Api.Json.EMAIL, identifiantEditText.getText().toString());
                    parameters.put(Constant.Api.Json.PASSWORD, passwordEditText.getText().toString());

                    HttpClient client = new HttpClient(this, Constant.Api.REGISTRATION, HttpClient.POST);

                    client.setListener(tokenRegistrer);
                    client.requestHeader("Content-Type", "application/json; charset=UTF-8");
                    client.requestParameter(parameters.toString());

                    Future<?> thread = executor.submit(client);
                    threads.add(thread);

                    requesting = true;

                } catch (JSONException exception) {

                    exception.printStackTrace();
                }
            }
        }
    }
}
