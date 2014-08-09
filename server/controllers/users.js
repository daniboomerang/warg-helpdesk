'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  ObjectId = mongoose.Types.ObjectId;

var usersDomain = require('../domain/users-domain');


/**
 * Create user
 * requires: {username, password, email, role}
 * returns: {email, password}
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  console.log(newUser.user_info);
  newUser.provider = 'local';

  newUser.save(function(err) {
    if (err) {
      return res.json(400, err);
    }
    return res.json(newUser.user_info);
  });
};

/**
 *  Show profile
 *  returns {username, profile}
 */
exports.show = function (req, res, next) {
  var userId = req.params.userId;

  User.findById(ObjectId(userId), function (err, user) {
    if (err) {
      return next(new Error('Failed to load User'));
    }
    if (user) {
      res.send({username: user.username, profile: user.profile });
    } else {
      res.send(404, 'USER_NOT_FOUND')
    }
  });
};


/**
 *  List of technicians
 *  returns [technicianObjectIds]
 */
exports.technicians = function (req, res, next) {

  /*var getObjectIds = function (listUsers){
    var objectIds = [];
    for (var i=0; i<listUsers.length; i++){
      objectIds.push(listUsers[i]._id);
    }
    return objectIds;
  };*/ 

  User.find({role: 'tech'}, function (err, technicians) {
    if (err) {
      return next(new Error('Failed to the list of Technicians'));
    }
    if (technicians) {
      //var technicianObjectIds = getObjectIds(technicians);
      res.send(technicians);
    } else {
      res.send(404, 'TECHNICIANS_NOT_FOUND');
    }
  });
};

/**
 *  Username exists
 *  returns {exists}
 */
 
exports.exists = function (req, res, next) {
  usersDomain.findByUsername(req.params.username).then (function (result){
    if (result.status == 'user.found'){
      res.json({exists: true});
    }  
    else if (result.status == 'user.not.found'){
      res.json({exists: false});
    }
    else if (result.status == 'db.exception'){
      return next(new Error('DB Exception: Failed to load User ' + username));
    }
  });   
}

/**
 * List of incidences for a user
 */
exports.list = function(req, res) {
  usersDomain.listUsers(req.user).then (function (resultList){
    if (resultList.status == RESULT_ERROR){
      res.json(500, resultList.error);
    }  
    else if (resultList.status == RESULT_SUCCESS){
      res.json(resultList.list);
    }
  });
};