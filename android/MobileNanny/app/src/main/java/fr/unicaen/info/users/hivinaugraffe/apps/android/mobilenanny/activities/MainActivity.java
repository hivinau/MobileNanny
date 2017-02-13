package fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.activities;

import android.os.*;
import android.text.*;
import android.view.*;
import android.widget.*;
import android.support.v7.app.*;
import android.support.annotation.*;
import fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.R;
import fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.validators.*;

public class MainActivity extends AppCompatActivity {

    private EditText identifiantEditText = null;
    private EditText passwordEditText = null;
    private ImageView identifiantErrorImageView = null;
    private ImageView passwordErrorImageView = null;
    private ProgressBar authenticateProgressBar = null;

    private boolean requesting = false;

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

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.authentication);

        identifiantEditText = (EditText) findViewById(R.id.user_name_edittext);
        passwordEditText = (EditText) findViewById(R.id.user_password_edittext);
        identifiantErrorImageView = (ImageView) findViewById(R.id.user_name_error_imageview);
        passwordErrorImageView = (ImageView) findViewById(R.id.user_password_error_imageview);
        authenticateProgressBar = (ProgressBar) findViewById(R.id.authenticate_progressbar);
    }

    @Override
    protected void onResume() {
        super.onResume();

        identifiantEditText.addTextChangedListener(textWatcher);
        passwordEditText.addTextChangedListener(textWatcher);
    }

    @Override
    protected void onPause() {
        super.onPause();

        identifiantEditText.removeTextChangedListener(textWatcher);
        passwordEditText.removeTextChangedListener(textWatcher);
    }

    public void login(View view) {

        boolean identifiantValid = new EmailValidator().validate(identifiantEditText.getText().toString().trim());
        identifiantErrorImageView.setVisibility(identifiantValid ? View.GONE : View.VISIBLE);

        boolean passwordValid = new PasswordValidator().validate(passwordEditText.getText().toString().trim());
        passwordErrorImageView.setVisibility(passwordValid ? View.GONE : View.VISIBLE);

        if(identifiantValid && passwordValid && !requesting) {

            authenticateProgressBar.setVisibility(View.VISIBLE);
            requesting = true;

            //TODO: authenticate login with credentials
        }
    }
}
