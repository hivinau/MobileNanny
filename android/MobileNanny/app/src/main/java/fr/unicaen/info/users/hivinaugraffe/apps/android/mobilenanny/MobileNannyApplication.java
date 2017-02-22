package fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny;

import java.util.*;
import android.app.*;
import android.content.*;
import fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.services.*;

public class MobileNannyApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();

        ActivityManager manager = (ActivityManager) getApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningServiceInfo> services = manager.getRunningServices(Integer.MAX_VALUE);

        boolean running = false;

        for (ActivityManager.RunningServiceInfo service : services) {

            if (service.service.getClassName().equals(LocationService.class.getName())) {

                running = true;
                break;
            }
        }

        if(!running) {

            Intent intent = new Intent(this, LocationService.class);
            startService(intent);
        }
    }
}
