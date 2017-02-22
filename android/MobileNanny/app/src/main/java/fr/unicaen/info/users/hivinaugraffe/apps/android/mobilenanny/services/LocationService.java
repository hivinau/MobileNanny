package fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.services;

import android.*;
import java.util.*;
import android.os.*;
import android.app.*;
import android.content.*;
import android.location.*;
import android.content.pm.*;
import android.support.v4.app.*;
import android.support.annotation.*;
import fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.globals.*;

public class LocationService extends Service implements LocationListener {

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

    private IBinder binder = null;
    private LocationManager locationManager = null;
    private boolean requestEnabled = false;

    @Override
    public void onCreate() {
        super.onCreate();

        binder = new LocationServiceBinder(this);

        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {

            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, Constant.Location.MIN_SECONDS_LAPSED, Constant.Location.MIN_DISTANCE, this);
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

        return super.onUnbind(intent);
    }

    @Override
    public void onLocationChanged(Location location) {

        if(requestEnabled) {

            double latitude = location.getLatitude();
            double longitude = location.getLongitude();

            android.util.Log.i(LocationService.class.getName(), String.format(Locale.FRANCE, "%f:%f", latitude, longitude));
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

    public void setRequestEnabled(boolean state) {

        requestEnabled = state;

        if(requestEnabled) {

            Criteria criteria = new Criteria();

            String provider = locationManager.getBestProvider(criteria, false);

            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED &&
                    ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {

                Location location = locationManager.getLastKnownLocation(provider);
                onLocationChanged(location);
            }
        }
    }
}
