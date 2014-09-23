'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  ObjectId = mongoose.Types.ObjectId,
  Q = require('q');


/**
 * Create a User
 *  Returns a PROMISE with the result 
 */
exports.createUser = function(email, username, password, role, school) {

  var deferred = Q.defer();

  var newUser = new User({email: email, username: username, password: password, role: role, school: school._id});
  newUser.provider = 'local';
  newUser.save(function(err) {
    if (err) {
      deferred.resolve({status: 'user.not.created', error: err});
    } else {
      deferred.resolve({status: 'user.created', user: newUser.user_info});
    }
  });

  return deferred.promise;
};

/**
 *  Find user by email
 *  Returns a PROMISE with the result 
 */

exports.findByEmail = function (userMail) {
  var deferred = Q.defer();
  var result = {};
  User.findOne({ email: userMail }).populate('school').exec(function (err, user) {
    if (err) {
      deferred.reject({status: 'db.exception', error: err});
    }
    if(user) {
      deferred.resolve({status: 'user.found', user: user});
    } else {
      deferred.reject({status: 'user.not.found', user: null});
    }
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
 *  Retrieves a user
 *  returns {user}
 */

exports.findUser = function (id) {
  var deferred = Q.defer();
  var result = {};
  User.findById(id, function (err, user) {
    if (err) {
      result = {status: 'db.exception', error: err};
    }
    else if(user) {
      result = {status: 'user.found', user: user};
    } else {
      result = {status: 'user.not.found', user: null};
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

/**
 *  Return the list users
 *  Returns a PROMISE with the result 
 */
exports.listUsers = function() {

  var deferred = Q.defer();
  User.find().sort('-created').populate('school', 'code').exec(function(err, users) {
    if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {   
      deferred.resolve({status: RESULT_SUCCESS, list: users});
    }
  });

  return deferred.promise;
}