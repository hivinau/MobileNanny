package fr.unicaen.info.users.hivinaugraffe.apps.android.httpclient;

import fr.unicaen.info.users.hivinaugraffe.apps.android.httpclient.events.*;

public interface IHttpClient {

    /**
     * Send response throught listener
     * @param event event that contain method name and object data
     * @param failed flag to prevent an error occured or not
     */
    void sendResponse(final HttpClientEvent event, final boolean failed);
}
