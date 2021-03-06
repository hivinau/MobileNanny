var config = module.exports = {};

//token generator key
config.token = {};
config.token.duration = 60 * 60 * 24 * 7 //1 week
config.token.key = '{ "admin" : "mobile-nanny", "password": "123456" }';

//http status code
config.statusCode = {};
config.statusCode.adding_user_failed = 600;
config.statusCode.adding_phone_failed = 601;
config.statusCode.adding_location_failed = 602;
config.statusCode.removing_phone_failed = 603;
config.statusCode.listing_phone_failed = 604;
config.statusCode.listing_locations_failed = 605;

//mongo database
config.mongo = {};
config.mongo.uri = process.env.MONGO_URI || 'mongodb://localhost/';
config.mongo.db = {};
config.mongo.db.name = 'mobile-nanny-database';
config.mongo.db.collections = {};
config.mongo.db.collections.users = 'users';
config.mongo.db.collections.phones = 'phones';
config.mongo.db.collections.locations = 'locations';