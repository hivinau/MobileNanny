//mongo database client
var databaseClient = require("mongodb").MongoClient;

//middleware to format url basename
var path = require('path');

//middleware to load resources from xml parser (string, integer, ...)
var resources = require(path.join(__dirname, '../parsers/resources'));

var database = 'mongodb://localhost/mobile-nanny-database';
var collectionName = 'users';

var credentialsManager = {

    add: function (email, password, callback) {

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

                resources.getString('credentials_existed', function(err, value) {

                    callback(value, null);
                });

            } else {

                databaseClient.connect(database, function(error, db) {

                    if(error == null) {

                        db.collection(collectionName, function(error, collection) {

                            collection.insert({ email: email,  password: password });

                            resources.getString('user_add_succeed', function(err, value) {

                                callback(null, value);
                            });

                        });

                    } else {

                        callback(error, null);
                    }
                });
            }
        });

    },

    list: function(callback) {

        databaseClient.connect(database, function(error, db) {

            if(error == null) {

                db.collection(collectionName, function(error, collection) {

                    collection.find().toArray(function(err, items) {

                        callback(null, items);
                    });

                });

            } else {

                callback(error, null);
            }
        });
    }
};

module.exports = credentialsManager;