package fr.unicaen.info.users.hivinaugraffe.apps.android.httpclient;

import java.io.*;
import java.net.*;
import java.util.*;
import android.app.*;
import android.net.*;
import android.content.*;
import fr.unicaen.info.users.hivinaugraffe.apps.android.httpclient.events.*;
import fr.unicaen.info.users.hivinaugraffe.apps.android.httpclient.listeners.*;

public class HttpClient implements IHttpClient, Runnable {

    public final static int GET = 0x01;
    public final static int POST = 0x02;
    public final static int REQUEST_TIMEOUT = 10;

    private final Context context;
    private final String url;
    private final int requestMethod;
    private final Map<String, String> headers;
    private final Map<String, String> parametersMap;
    private String parametersJson = null;

    private HttpClientListener listener = null;

    /**
     * Constructor : create a new instance of {@link HttpClient}
     * @param context {@link Context} propagate event on main thread
     * @param url host url to ask
     * @param requestMethod http request method
     */
    public HttpClient(Context context, String url, int requestMethod) {

        this.context = context;
        this.url = url;
        this.requestMethod = requestMethod;

        parametersMap = new HashMap<>();
        headers = new HashMap<>();
    }

    /**
     *
     * @param listener {@link HttpClientListener} listener to mirror communication server/client
     */
    public void setListener(HttpClientListener listener) {

        this.listener = listener;
    }

    public HttpClient requestParameter(String key, String value) {

        parametersMap.put(key, value);
        return this;
    }

    public HttpClient requestParameter(String value) {

        parametersJson = value;
        return this;
    }

    public HttpClient requestHeader(String key, String value) {

        headers.put(key, value);
        return this;
    }

    @Override
    public void sendResponse(final HttpClientEvent event, final boolean failed) {

        if(context != null) {

            ((Activity) context).runOnUiThread(new Runnable() {

                @Override
                public void run() {

                    listener.onEventOccured(event, failed);
                }
            });
        }
    }

    @Override
    public void run() {

        BufferedReader reader = null;
        HttpURLConnection connection = null;

        String host = url;

        try {

            if(requestMethod == GET) {

                String parametersString = "";
                final URL url;
                if(parametersMap.size() > 0) {

                    for(Map.Entry<String, String> entry: parametersMap.entrySet()) {

                        parametersString += String.format(Locale.FRANCE, "%s=%s&", entry.getKey(), entry.getValue());
                    }

                    if (parametersString.endsWith("&")) {
                        parametersString = parametersString.substring(0, parametersString.length() - 1); //remove last '&'
                    }

                    url = new URL(String.format("%s?%s", host, parametersString));

                } else {

                    url = new URL(host);
                }

                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");

                if(headers.size() > 0) {

                    for(Map.Entry<String, String> entry: headers.entrySet()) {

                        connection.setRequestProperty(entry.getKey(), entry.getValue());
                    }
                }

            } else {

                Uri.Builder builder = new Uri.Builder();

                String request = parametersJson;
                if(parametersMap.size() > 0) {

                    for(Map.Entry<String, String> entry: parametersMap.entrySet()) {

                        builder.appendQueryParameter(entry.getKey(), entry.getValue());
                    }

                    request = builder.build().getEncodedQuery();
                }

                URL url = new URL(host);

                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("POST");
                connection.setDoOutput(true);
                connection.setChunkedStreamingMode(0);

                if(headers.size() > 0) {

                    for(Map.Entry<String, String> entry: headers.entrySet()) {

                        connection.setRequestProperty(entry.getKey(), entry.getValue());
                    }
                }

                OutputStream outputStream = connection.getOutputStream();
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(outputStream));

                writer.write(request);
                writer.flush();
                writer.close();

                outputStream.close();
            }

            connection.setConnectTimeout(REQUEST_TIMEOUT * 1000);
            connection.setReadTimeout(REQUEST_TIMEOUT * 1000);

            int responseCode = connection.getResponseCode();

            final InputStream inputStream;
            if(responseCode != HttpURLConnection.HTTP_OK) {

                inputStream = connection.getErrorStream();
            } else {

                inputStream = connection.getInputStream();
            }

            if(inputStream == null) {

                String message = String.format(Locale.FRANCE, "Can not get stream for response code '%d'", responseCode);
                throw new Exception(message);
            }

            reader = new BufferedReader(new InputStreamReader(inputStream));

            String content = "";

            final Reader _reader = reader;
            final URLConnection _connection = connection;

            if(context != null) {

                ((Activity) context).runOnUiThread(new Runnable() {
                    @Override
                    public void run() {

                        listener.onPrepareRequest(_reader, _connection);
                    }
                });
            }

            String line = reader.readLine();

            do {

                if(line != null) {
                    content += line;
                }

                line = reader.readLine();

            } while(line != null);

            HttpClientEvent event = new HttpClientEvent(this, connection.getURL(), content);
            sendResponse(event, responseCode == HttpURLConnection.HTTP_BAD_REQUEST);

        } catch(Exception exception) {

            URL url = null;

            if(connection != null) {

                url = connection.getURL();

                connection.disconnect();
            }

            exception.printStackTrace();

            HttpClientEvent event = new HttpClientEvent(this, url, exception);
            sendResponse(event, true);

        } finally {

            if(reader != null) {

                try {

                    reader.close();
                } catch (IOException ex) {

                    ex.printStackTrace();
                }
            }
        }
    }
}
