package fr.unicaen.info.users.hivinaugraffe.apps.android.httpclient.listeners;

import fr.unicaen.info.users.hivinaugraffe.apps.android.httpclient.events.*;

public interface IHttpClientListener {

    /**
     * Handle event on success or failure state
     * @param event {@link HttpClientEvent} event fired on success state
     * @param failed flag to prevent an error occured or not
     */
    void onEventOccured(HttpClientEvent event, boolean failed);
}
