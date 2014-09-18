'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR"; 

var mongoose = require('mongoose'),
  Inventory = mongoose.model('Inventory'),
  ObjectId = mongoose.Types.ObjectId,
  Q = require('q');

exports.disableItem = function(itemId){
  var deferred = Q.defer();

  Inventory.findOne({ _id: itemId }).exec(function(err, item){
    if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {
      item.disabled = {
        when: new Date(),
        why: "porque me da la gana"
      };
      item.save(function(err){
        if (err) console.log("caguen");
        deferred.resolve({status: RESULT_SUCCESS, data: item});
      })
    }
  })

  return deferred.promise;

};

exports.listByUserSchool = function(user) {
  var deferred = Q.defer();

  Inventory.find({ "schoolId": user.school._id, disabled: null }).exec(function(err, items) {
    if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {   
      deferred.resolve({status: RESULT_SUCCESS, data: items});
    }
  });

  return deferred.promise;

};

