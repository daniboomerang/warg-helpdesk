'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR"; 
var ROLE_USER = "user";
var STATUS_ONGOING = "On Going";

var mongoose = require('mongoose'),
  Incidence = mongoose.model('Incidence'),
  Q = require('q');

/**
 * Create a incidence
 *  Returns a PROMISE with the result 
 */
exports.createIncidence = function(title, description, user, severity, priority) {

  var deferred = Q.defer();

  if (severity==null){severity = "Medium";}
  if (priority==null){priority = "Medium";}

  var incidence = new Incidence({title: title, description: description, severity: severity, priority: priority});
  incidence.creator =  user;

  incidence.save(function(err) {
    if (err) {
      deferred.resolve({status: 'incidence.not.created', error: err});
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

/**
 *  Updates an incidence assignation
 *  Returns a PROMISE with the result 
 */
exports.updateAssigned = function(incidence, assigned) {

  var deferred = Q.defer();

  incidence.assigned = assigned;
  incidence.status = STATUS_ONGOING;
  incidence.save(function(err) {
    if (err) {
      deferred.resolve({status: 'incidence.not.updated', error: err});
    } else {
      deferred.resolve({status: 'incidence.updated', incidence: incidence});
    }
  });

  return deferred.promise;
};
