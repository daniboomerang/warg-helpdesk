'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR"; 
var ROLE_TECH = "tech";
var ROLE_USER = "user";
var STATUS_ONGOING = "On Going";
var STATUS_CLOSED = "Closed";
var STATUS_OPEN = "Open"

var mongoose = require('mongoose'),
  Inventory = mongoose.model('Inventory'),
  ObjectId = mongoose.Types.ObjectId,
  Q = require('q');

exports.listByUserSchool = function(user) {
  var deferred = Q.defer();

  Inventory.find({ "schoolId": user.school._id }).exec(function(err, items) {
    if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {   
      deferred.resolve({status: RESULT_SUCCESS, list: items});
    }
  });

  return deferred.promise;

};

