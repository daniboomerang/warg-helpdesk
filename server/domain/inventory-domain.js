'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR"; 

var mongoose = require('mongoose'),
  Inventory = mongoose.model('Inventory'),
  ObjectId = mongoose.Types.ObjectId,
  Q = require('q');

exports.createItem = function(data, user) {

  var deferred = Q.defer();

  data.schoolId = user.school._id;
  
  var item = new Inventory(data);

  item.save(function(err) {
    if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {
      deferred.resolve({status: RESULT_SUCCESS, data: item});
    }
  });

  return deferred.promise;
};

exports.get = function(itemId){
  var deferred = Q.defer();

  Inventory.findOne({ _id: itemId }).exec(function(err, item){
    if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {
      deferred.resolve({status: RESULT_SUCCESS, data: item});
    }
  });

  return deferred.promise;

};

exports.disable = function(itemToDisable){
  var deferred = Q.defer();

  Inventory.findOne({ _id: itemToDisable._id }).exec(function(err, item){
    if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {
      item.disabled = {
        when: itemToDisable.disabled.when || new Date(),
        why: itemToDisable.disabled.why || "reason not specified"
      };
      item.save(function(err){
        if (err) console.log("caguen");
        deferred.resolve({status: RESULT_SUCCESS, data: item});
      })
    }
  });

  return deferred.promise;

};

exports.update = function(itemToDisable){
  var deferred = Q.defer();

  Inventory.findOne({ _id: itemToDisable._id }).exec(function(err, item){
    if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {
      Object.getOwnPropertyNames(itemToDisable).forEach(function(property){
        item[property] = itemToDisable[property];
      });
      item.save(function(err){
        if (err) console.log("caguen");
        deferred.resolve({status: RESULT_SUCCESS, data: item});
      })
    }
  });

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

