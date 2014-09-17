'use strict';

process.env.NODE_ENV = 'test';

var config = require('../../server/config/config');
var mongoose = require('mongoose');

before(function (done) {

  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove(function() {});
    }
    return done();
  }

  if (mongoose.connection.db) return clearDB();
  mongoose.connect(config.mongo.db, function (err) {
    if (err) throw err;
    return clearDB();
  });

});

// afterEach(function (done) {
//  mongoose.disconnect();
//  return done();
// });