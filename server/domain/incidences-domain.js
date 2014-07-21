'use strict';

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
      deferred.resolve({Status: 'incidence.not.created', incidence: null});
    } else {
      deferred.resolve({Status: 'incidence.created', incidence: incidence});
    }
  });

  return deferred.promise;
};