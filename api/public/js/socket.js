var socket = null;

var credentials = {

    email: 'hivinau.graffe@hotmail.fr',
    password: 'tesst'
};

var connectionEstablished = function () {

    //handled when connection established

    console.log('socket connected');

    console.log('authenticating...');
    socket.emit('authentication', credentials);
};

var connectionAborted = function () {

    //handled when connection aborted
    console.log('socket disconnected');
};

var messageReceived = function (message) {

    //handled when message received
    if(message.hasOwnProperty('type') && message.hasOwnProperty('content')) {

        switch (message.type) {
            default: //message is considered as 'error' string
                break;
        }

        var content = message.content;
        console.log(content);
    }

};

var credentialsAccepted = function () {

    //handled when server accepts user credentials

    console.log('ask server to list phones registered');

    var parameters = JSON.stringify({ email: credentials.email, password: credentials.password });
    request('POST', '/phones/', parameters, function (event) { //handle XHR request to retrieve phones

        var response = event.target.response;

        if(response != null) { //response must be a 'ul' element

            var isJson = false;
            try
            {
                var json = JSON.parse(response);

                isJson = true;
                console.log(json);
            }
            catch(exception) {}

            if(!isJson) {

                //let's add ul ton controls panel to show phones list
                var panel = document.querySelector('#controls-panel');

                var parser = new DOMParser();
                var DOM = parser.parseFromString(response, "text/xml");

                if(panel.querySelector('ul#phones')) {

                    panel.removeChild(panel.lastChild);
                }

                panel.appendChild(DOM.firstChild);
            }
        }
    })
};

window.onload = function (event) { //web page is loaded

    //try to establish connection with server
    socket = io('http://localhost:8080');

    socket.on('connect', connectionEstablished); //handled when connection established
    socket.on('message', messageReceived); //handled when message received
    socket.on('credentials accepted', credentialsAccepted); //handled when server accepts user credentials
    socket.on('disconnect', connectionAborted); //handled when connection aborted
};