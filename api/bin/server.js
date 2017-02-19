//middleware to use HTTP server/client
var http = require('http');

//load server with app as listener
var server = http.createServer(require('../app'));

var io = require('socket.io')(server);

io.on('connection', function(socket) {

    console.log('socket connected');

    socket.on('authentication', function (credentials) {

        console.log('authenticating \'' + socket.id + '\'...');

        if(credentials.hasOwnProperty('email') && credentials.hasOwnProperty('password')) {

            socket.email = credentials.email;
            socket.password = credentials.password;

            console.log('\'' + socket.id + '\' authenticated');
            socket.emit('credentials accepted');

        } else {

            var message = {

                type: 'error',
                content: 'authentication failed'
            };

            socket.emit('message', message);
        }
    });

    socket.on('event', function() {

        console.log('socket event occured');
    });

    socket.on('disconnect', function() {

        console.log('socket disconnected');
    });
});

//server will bind clients on port 8080
var port = process.env.PORT || 8080;
server.listen(port, function () {

    console.log('server listening at port %d', port);
});
