//mongo database client
var databaseClient = require('mongodb').MongoClient;

//middleware to format url basename
var path = require('path');

//middleware to load resources from xml parser (string, integer, ...)
var resources = require(path.join(__dirname, '../parsers/resources'));

//app configuration properties
var config = require(path.join(__dirname, '../security/config.js'));

var locations = module.exports = {};

locations.list = function (token, callback) {

    databaseClient.connect(config.mongo.uri + config.mongo.db.name, function(error, db) {

        if(error == null) {

            db.collection(config.mongo.db.collections.locations).find({ 'token': token }).toArray(function(err, items) {

                callback(null, items);
            });

        } else {

            callback(error, null);
        }
    });
};

locations.add = function (token, latitude, longitude, callback) {

    locations.list(token, function (error, items) {

        if(items) {

            databaseClient.connect(config.mongo.uri + config.mongo.db.name, function(error, db) {

                if(error == null) {

                    if(items.length == 0) {

                        var inserted = db.collection(config.mongo.db.collections.locations).save({ 'token': token , tracks: [{ 'latitude': latitude, 'longitude': longitude } ] });
                        callback(inserted);

                    } else {

                        var updated = db.collection(config.mongo.db.collections.locations).update({ 'token': token }, { $push: { tracks:{ 'latitude': latitude, 'longitude': longitude } } });
                        callback(updated);
                    }


                } else {

                    callback(null);
                }
            });

        } else {

            callback(null);
        }
    });

};