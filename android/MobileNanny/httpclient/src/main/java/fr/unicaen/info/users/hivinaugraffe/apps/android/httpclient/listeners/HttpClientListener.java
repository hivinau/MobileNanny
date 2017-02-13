package fr.unicaen.info.users.hivinaugraffe.apps.android.httpclient.listeners;

import java.io.*;
import java.net.*;

public abstract class HttpClientListener implements IHttpClientListener {

    /**
     * Check reader and connection before establish communication
     * @param reader {@link Reader} for characters streaming
     * @param connection {@link URLConnection} to establish server/client communication
     */
    public void onPrepareRequest(Reader reader, URLConnection connection) {

    }
}
