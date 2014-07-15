'use strict';

var mongoose = require('mongoose'),
    config = require('../config/config');
console.log(config);
exports.mongoose = mongoose;

var mongoOptions = { db: { safe: true } };

// Connect to Database
exports.db = mongoose.connect(config.mongo.db, mongoOptions, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + config.mongo.db + '. ' + err);
  } else {
    console.log ('Successfully connected to: ' + config.mongo.db);
  }
});
