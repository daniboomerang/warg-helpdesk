'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Q = require('q');

/**
 *  Find user by email
 *  Returns a PROMISE with the result 
 */

exports.findByEmail = function (userMail) {
  var deferred = Q.defer();
  var result = {};
  User.findOne({ email : userMail }, function (err, user) {
    if (err) {
      result = {Status: 'db.exception', error: err};
    }
    if(user) {
      result = {Status: 'user.found', user: user};
    } else {
      result = {Status: 'user.not.found', user: null};
    }
    deferred.resolve(result);
  });
  return deferred.promise;
}

/**
 *  Find a user by username
 *  returns a PROMISE with the result
 */

exports.findByUsername = function (username) {
  var deferred = Q.defer();
  var result = {};
  User.findOne({ username : username }, function (err, user) {
    if (err) {
      result = {Status: 'db.exception', error: err};
    }
    if(user) {
      result = {Status: 'user.found', user: user};
    } else {
      result = {Status: 'user.not.found', user: null};
    }
    deferred.resolve(result);
  });
  return deferred.promise;
}