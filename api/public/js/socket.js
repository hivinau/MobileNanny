var socket = null;

var credentials = {

    email: 'user@hotmail.fr',
    password: 'password'
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

var dataAvailable = function (data) {

    console.log(data);

    if(data.hasOwnProperty('phone')) {

        //handled when a phone was added or removed

        if(data.phone.hasOwnProperty('email')) {

            if(data.phone.email == credentials.email) {

                listPhonesWith(credentials.email, credentials.password);
            }
        }
    } else if(data.hasOwnProperty('location')) {

        if(data.location.hasOwnProperty('latitude') && data.location.hasOwnProperty('longitude')) {

            socket.tracks.push({'latitude': data.location.latitude, 'longitude': data.location.longitude});
            var polyline = drawPolyline(document.getElementById('map'), socket.tracks);
        }
    }
};

var credentialsAccepted = function () {

    //handled when server accepts user credentials

    console.log('authenticated');

    listPhonesWith(credentials.email, credentials.password);
};

var credentialsRefused = function (message) {

    //handled when message received
    console.log(message);
};

function listPhonesWith(email, password) {

    console.log('ask server to list phones registered');

    var parameters = JSON.stringify({ email: email, password: password });
    request('POST', '/phones/list/', parameters, function (event) { //handle XHR request to retrieve phones

        var response = event.target.response;

        if(response != null) {

            //response must be a 'ul' element

            //let's add ul ton controls panel to show phones list
            var panel = document.querySelector('#controls-panel');

            var parser = new DOMParser();
            var DOM = parser.parseFromString(response, "text/xml");

            if(panel.querySelector('ul#phones')) {
                //remove if 'ul' already existed

                panel.removeChild(panel.lastChild);
            }

            //add 'ul' element to panel
            panel.appendChild(DOM.firstChild);

            //register onClick event on each phone 'li'
            var ul = panel.querySelector('ul#phones');

            var elements = ul.children;

            for(var i = 0; i < elements.length; i++) {

                elements[i].addEventListener('click', onPhoneClick);
            }
        }
    })
}

function listLocationsWith(token) {

    console.log('ask server to list locations registered');

    var parameters = JSON.stringify({ token: token });
    request('POST', '/locations/list/', parameters, function (event) { //handle XHR request to retrieve phones

        var response = event.target.response;

        if(response != null) {

            console.log(response);
        }
    })
}

window.onload = function (event) { //web page is loaded

    //try to establish connection with server
    socket = io('http://192.168.1.18:8080');

    socket.tracks = [];

    socket.on('connect', connectionEstablished); //handled when connection established
    socket.on('data available', dataAvailable); //handled when data is available
    socket.on('credentials accepted', credentialsAccepted); //handled when server accepts user credentials
    socket.on('credentials refused', credentialsRefused); //handled when server refuses user credentials
    socket.on('disconnect', connectionAborted); //handled when connection aborted
};