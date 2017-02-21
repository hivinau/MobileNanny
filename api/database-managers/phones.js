//mongo database client
var databaseClient = require('mongodb').MongoClient;

//middleware to format url basename
var path = require('path');

//middleware to load resources from xml parser (string, integer, ...)
var resources = require(path.join(__dirname, '../parsers/resources'));

//app configuration properties
var config = require(path.join(__dirname, '../security/config.js'));

// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');

var phones = module.exports = {};

phones.add = function(email, callback) {

    databaseClient.connect(config.mongo.uri + config.mongo.db.name, function(error, db) {

        if(error == null) {

            var expiresIn = Math.floor(Date.now() / 1000) + config.token.duration;
            var token = jwt.sign({
                'exp': expiresIn,
                'data': { 'email': email + expiresIn }
            }, config.token.key);

            db.collection(config.mongo.db.collections.phones).save({ 'email': email, 'token': token});

            callback(null, { 'expiredAt': expiresIn * 1000, 'token': token });

        } else {

            callback(error, null);
        }
    });
};

phones.expired = function (token) {

    var data = jwt.verify(token, config.token.key);

    var now = new Date(data.iat * 1000);
    var expiresAt = new Date(data.exp * 1000);

    return now > expiresAt;
};

phones.validatedList = function (email, callback) {

    phones.list(email, function (error, items) {

        if (items) {

            var indexes = [];

            items.forEach(function (item, index) {

                if(phones.expired(item.token)) {

                    indexes.push(index);
                }
            });

            indexes.forEach(function (index, i) {

                items.splice(index, 1);
            });
        }

        callback(items);
    });
};

phones.list = function (email, callback) {

    databaseClient.connect(config.mongo.uri + config.mongo.db.name, function(error, db) {

        if(error == null) {

            db.collection(config.mongo.db.collections.phones).find({ email: email }).toArray(function(err, items) {

                callback(null, items);
            });

        } else {

            callback(error, null);
        }
    });
};