var config = require('./config.dev');
 
config.env = 'test';
config.mongo.db = 'mongodb://localhost/warg_helpdesk_test';
 
module.exports = config;