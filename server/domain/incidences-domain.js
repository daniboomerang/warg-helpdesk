'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR"; 
var ROLE_USER = "user";

var mongoose = require('mongoose'),
  Incidence = mongoose.model('Incidence'),
  Q = require('q');

/**
 * Create a incidence
 *  Returns a PROMISE with the result 
 */
exports.createIncidence = function(title, description, user) {

  var deferred = Q.defer();

  var incidence = new Incidence({title: title, description: description});
  incidence.creator =  user;
  incidence.severity = "Medium";
  incidence.priority = "Medium";

  incidence.save(function(err) {
    if (err) {
      deferred.resolve({status: 'incidence.not.created', incidence: null});
    } else {
      deferred.resolve({status: 'incidence.created', incidence: incidence});
    }
  });

  return deferred.promise;
};

/**
 *  Return the list of incidences of a user
 *  Returns a PROMISE with the result 
 */
exports.listIncidences = function(user) {

  var deferred = Q.defer();

  // Role determines which incidences can be listed

  // Role: user -> only those he owns
  if (user.role == ROLE_USER){
    Incidence.find({creator: user}).sort('-created').populate('creator', 'username').exec(function(err, incidences) {
     if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {   
      deferred.resolve({status: RESULT_SUCCESS, list: incidences});
    }
    });
  }
  else{ //user.role = admin || tech
    Incidence.find().sort('-created').populate('creator', 'username').exec(function(err, incidences) {
    if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {   
      deferred.resolve({status: RESULT_SUCCESS, list: incidences});
    }
    });
  }
  return deferred.promise;
};