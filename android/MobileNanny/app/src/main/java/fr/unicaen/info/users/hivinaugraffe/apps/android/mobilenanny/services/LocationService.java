package fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.services;

import android.*;
import org.json.*;
import java.util.*;
import android.os.*;
import android.app.*;
import android.content.*;
import android.location.*;
import android.content.pm.*;
import android.preference.*;
import java.util.concurrent.*;
import android.support.v4.app.*;
import android.support.annotation.*;
import fr.unicaen.info.users.hivinaugraffe.apps.android.httpclient.*;
import fr.unicaen.info.users.hivinaugraffe.apps.android.httpclient.events.*;
import fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.globals.*;
import fr.unicaen.info.users.hivinaugraffe.apps.android.httpclient.listeners.*;

public class LocationService extends Service {

    public class LocationServiceBinder extends Binder {

        private final LocationService locationService;

        LocationServiceBinder(LocationService locationService) {

            this.locationService = locationService;
        }

        @SuppressWarnings({"unused"})
        public LocationService getLocationService() {

            return locationService;
        }
    }

    private Context context = null;
    private IBinder binder = null;
    private LocationManager locationManager = null;
    private boolean requestEnabled = false;
    private ExecutorService executor = null;
    private List<Future<?>> threads = null;
    private SharedPreferences preferences = null;

    private static final int CORE_POOL_SIZE = 5;
    private static final int MAXIMUM_THREADS = 8;

    private LocationListener locationListener = new LocationListener() {

        @Override
        public void onLocationChanged(Location location) {

            if(requestEnabled) {

                if(location != null) {

                    try {

                        String token = preferences.getString(Constant.Api.Json.TOKEN, "");
                        double latitude = location.getLatitude();
                        double longitude = location.getLongitude();

                        JSONObject parameters = new JSONObject();

                        parameters.put(Constant.Api.Json.TOKEN, token);
                        parameters.put(Constant.Api.Json.LATITUDE, latitude);
                        parameters.put(Constant.Api.Json.LONGITUDE, longitude);

                        HttpClient client = new HttpClient(context, Constant.Api.LOCATION, HttpClient.POST);

                        client.setListener(locationRegistrer);
                        client.requestHeader("Content-Type", "application/json; charset=UTF-8");
                        client.requestParameter(parameters.toString());

                        Future<?> thread = executor.submit(client);
                        threads.add(thread);

                    } catch (JSONException exception) {

                        exception.printStackTrace();
                    }
                }
            }
        }

        @Override
        public void onStatusChanged(String provider, int status, Bundle extras) {

            //TODO: nothing
        }

        @Override
        public void onProviderEnabled(String provider) {

            //TODO: nothing
        }

        @Override
        public void onProviderDisabled(String provider) {

            //TODO: nothing
        }
    };

    private HttpClientListener locationRegistrer = new HttpClientListener() {

        @Override
        public void onEventOccured(HttpClientEvent event, boolean failed) {

            //TODO: nothing
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();


        executor= new ThreadPoolExecutor(LocationService.CORE_POOL_SIZE,
                LocationService.MAXIMUM_THREADS,
                1000, TimeUnit.SECONDS,
                new LinkedBlockingQueue<Runnable>());

        threads = new ArrayList<>();
        binder = new LocationServiceBinder(this);
        preferences = PreferenceManager.getDefaultSharedPreferences(this);
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {

            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, Constant.Location.MIN_SECONDS_LAPSED, Constant.Location.MIN_DISTANCE, locationListener);
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        return Service.START_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {

        return binder;
    }

    @Override
    public boolean onUnbind(Intent intent) {

        return true;
    }

    @Override
    public void onRebind(Intent intent) {

    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        for (Iterator<Future<?>> iterator = threads.iterator(); iterator.hasNext();) {

            Future<?> thread = iterator.next();

            if(!thread.isCancelled()) {

                thread.cancel(true);
            }

            iterator.remove();
        }

        executor.shutdownNow();

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {

            locationManager.removeUpdates(locationListener);
        }
    }

    public void setContext(Context context) {

        this.context = context;
    }

    public void setRequestEnabled(boolean state) {

        requestEnabled = state;

        if(requestEnabled) {

            Criteria criteria = new Criteria();

            String provider = locationManager.getBestProvider(criteria, false);

            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED &&
                    ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {

                Location location = locationManager.getLastKnownLocation(provider);
                locationListener.onLocationChanged(location);
            }
        }
    }
}
