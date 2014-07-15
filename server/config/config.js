console.log("process.env.NODE_ENV in Config.js: ", process.env.NODE_ENV);
var env = process.env.NODE_ENV || 'dev'
  , cfg = require('./config.' + env);
console.log("env: " , env);
module.exports = cfg;

