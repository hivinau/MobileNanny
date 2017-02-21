//mongo database client
var databaseClient = require("mongodb").MongoClient;

//middleware to format url basename
var path = require('path');

//middleware to load resources from xml parser (string, integer, ...)
var resources = require(path.join(__dirname, '../parsers/resources'));

var config = require('../security/config.js');

var credentialsManager = module.exports = {};

credentialsManager.add = function (email, password, callback) {

    credentialsManager.list(function (error, items) {

        var exists = false;

        if(items) {

            items.forEach(function (item, index) {

                if(item.email == email && item.password == password) {

                    exists = true;
                }
            });
        }

        if(exists) {

            resources.stringValueOf('credentials_existed', function(err, value) {

                callback(value, null);
            });

        } else {

            databaseClient.connect(config.mongo.uri + config.mongo.db.name, function(error, db) {

                if(error == null) {

                    db.collection(config.mongo.db.collections.users, function(error, collection) {

                        collection.insert({ email: email,  password: password });

                        resources.stringValueOf('user_add_succeed', function(err, value) {

                            callback(null, value);
                        });

                    });

                } else {

                    callback(error, null);
                }
            });
        }
    });

};

credentialsManager.list = function(callback) {

    databaseClient.connect(config.mongo.uri + config.mongo.db.name, function(error, db) {

        if(error == null) {

            db.collection(config.mongo.db.collections.users, function(error, collection) {

                collection.find().toArray(function(err, items) {

                    callback(null, items);
                });

            });

        } else {

            callback(error, null);
        }
    });
};