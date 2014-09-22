'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR"; 

var mongoose = require('mongoose'),
  School = mongoose.model('School'),
  ObjectId = mongoose.Types.ObjectId,
  Q = require('q');

/**
 * Create a school
 *  Returns a PROMISE with the result 
 */
exports.createSchool = function(code, name, address) {

  var deferred = Q.defer();

  var school = new School({code: code, name: name, address: address.formatted_address});

  school.save(function(err) {
    if (err) {
      deferred.resolve({status: 'school.not.created', error: err});
    } else {
      deferred.resolve({status: 'school.created', school: school});
    }
  });

  return deferred.promise;
};

/**
 *  Return the list of schools
 *  Returns a PROMISE with the result 
 */
exports.listSchools = function() {

  var deferred = Q.defer();

  School.find().sort('-created').exec(function(err, schools) {
    if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {   
      deferred.resolve({status: RESULT_SUCCESS, list: schools});
    }
  });

  return deferred.promise;
};

/**
 *  Find a school by code
 *  returns a PROMISE with the result
 */

exports.findByCode = function (code) {

  var deferred = Q.defer();
  var result = {};

  School.findOne({ code: code }, function (err, school) {
    if (err) {
      result = {status: 'db.exception', error: err};
    }
    if(school) {
      result = {status: 'school.found', school: school};
    } else {
      result = {status: 'school.not.found', school: null};
    }
    deferred.resolve(result);
  });
  
  return deferred.promise;

};

/**
 *  Retrieves a school
 */

exports.findSchool = function (id) {
  var deferred = Q.defer();
  var result = {};
  School.findById(id, function (err, school) {
    if (err) {
      result = {status: 'db.exception', error: err};
    }
    else if(school) {
      result = {status: 'school.found', school: school};
    } else {
      result = {status: 'school.not.found', school: null};
    }
    deferred.resolve(result);
  });
  return deferred.promise;
};

exports.findSchoolBis = function (id) {
  return School.findById(id);
};
