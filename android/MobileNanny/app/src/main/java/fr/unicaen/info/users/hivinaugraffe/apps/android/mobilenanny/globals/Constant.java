package fr.unicaen.info.users.hivinaugraffe.apps.android.mobilenanny.globals;

public class Constant {

    public class Api {

        public static final String REGISTRATION = "http://192.168.1.18:8080/phones/add/";
        public static final String UNREGISTRATION = "http://192.168.1.18:8080/phones/remove/";
        public static final String LOCATION = "http://192.168.1.18:8080/locations/add/";

        public class Json {

            public static final String EMAIL = "email";
            public static final String PASSWORD = "password";
            public static final String TOKEN = "token";
            public static final String LATITUDE = "latitude";
            public static final String LONGITUDE = "longitude";
        }
    }

    public class Location {

        public static final long MIN_SECONDS_LAPSED = 5;
        public static final float MIN_DISTANCE = 10;
    }
}
