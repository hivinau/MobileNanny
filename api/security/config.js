var config = module.exports = {};

//mongo database
config.mongo = {};
config.mongo.uri = process.env.MONGO_URI || 'mongodb://localhost/';
config.mongo.db = {};
config.mongo.db.name = 'mobile-nanny-database';
config.mongo.db.collections = {};
config.mongo.db.collections.users = 'users';