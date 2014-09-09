'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  ObjectId = mongoose.Types.ObjectId,
  Q = require('q');


/**
 * Searches for the user
 *  Returns a PROMISE with the result 
 */
exports.validateUser = function(user) {

  var deferred = Q.defer();

  User.findOne({ email: user.email }).populate('school').exec(function (err, user) {
   	if (err) {
      deferred.resolve({status: 'user.not.found', error: err});
    } else {
      deferred.resolve({status: 'user.found', user: user});
    }
  });

  return deferred.promise;
};
