'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  ObjectId = mongoose.Types.ObjectId,
  Q = require('q');

/**
 *  Find user by email
 *  Returns a PROMISE with the result 
 */

exports.findByEmail = function (userMail) {
  var deferred = Q.defer();
  var result = {};
  User.findOne({ email: userMail }, function (err, user) {
    if (err) {
      result = {status: 'db.exception', error: err};
    }
    if(user) {
      result = {status: 'user.found', user: user};
    } else {
      result = {status: 'user.not.found', user: null};
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
  User.findOne({ username: username }, function (err, user) {
    if (err) {
      result = {status: 'db.exception', error: err};
    }
    if(user) {
      result = {status: 'user.found', user: user};
    } else {
      result = {status: 'user.not.found', user: null};
    }
    deferred.resolve(result);
  });
  return deferred.promise;
}

/**
 *  Show profile
 *  returns {username, profile}
 */

exports.show = function (userId) {
  var deferred = Q.defer();
  var result = {};
  User.findById(ObjectId(userId), function (err, user) {
    if (err) {
      result = {status: 'db.exception', error: err};
    }
    if(user) {
      result = {status: 'user.shown', user: user};
    } else {
      result = {status: 'user.not.shown', user: null};
    }
    deferred.resolve(result);
  });
  return deferred.promise;
}

/**
 *  Role of a username
 *  returns a PROMISE with the result
 */

exports.role = function (username) {
  var deferred = Q.defer();
  var result = {};
  User.findOne({ username: username }, function (err, user) {
    if (err) {
      result = {status: 'db.exception', error: err};
    }
    if(user) {
      result = {status: 'role.found', role: user.role};
    } else {
      result = {status: 'user.not.found', role: null};
    }
    deferred.resolve(result);
  });
  return deferred.promise;
}