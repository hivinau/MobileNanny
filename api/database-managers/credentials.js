//mongo database client
var databaseClient = require('mongodb').MongoClient;

//middleware to format url basename
var path = require('path');

//middleware to load resources from xml parser (string, integer, ...)
var resources = require(path.join(__dirname, '../parsers/resources'));

//app configuration properties
var config = require(path.join(__dirname, '../security/config.js'));

var credentials = module.exports = {};

credentials.add = function (email, password, callback) {

    credentials.verify(email, password, function (exists) {

        if(exists) {

            resources.stringValueOf('credentials_existed', function(err, value) {

                callback(value, null);
            });

        } else {

            databaseClient.connect(config.mongo.uri + config.mongo.db.name, function(error, db) {

                if(error == null) {

                    db.collection(config.mongo.db.collections.users).save({ 'email': email, 'password': password });

                    resources.stringValueOf('user_add_succeed', function(err, value) {

                        callback(null, value);
                    });

                } else {

                    callback(error, null);
                }
            });
        }
    });

};

credentials.verify = function(email, password, callback) {

    credentials.list(function (error, items) {

        var exists = false;

        if (items) {

            items.forEach(function (item, index) {

                if (item.email == email && item.password == password) {

                    exists = true;
                }
            });
        }

        callback(exists);
    });
};

credentials.list = function(callback) {

    databaseClient.connect(config.mongo.uri + config.mongo.db.name, function(error, db) {

        if(error == null) {

            db.collection(config.mongo.db.collections.users).find().toArray(function(err, items) {

                callback(null, items);
            });

        } else {

            callback(error, null);
        }
    });
};