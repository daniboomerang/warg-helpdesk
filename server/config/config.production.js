var config = require('./config.dev');
 
config.env = 'production';
config.mongo.db = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL;
 
module.exports = config;