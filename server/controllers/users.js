'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";
var USER_NOT_FOUND = '404 - User not found';
var INTERNAL_SERVER_ERROR = '500 - Internal server error';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  passport = require('passport'),
  ObjectId = mongoose.Types.ObjectId;

var usersDomain = require('../domain/users-domain');

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
  usersDomain.findUser(id).then (function (result){
    if (result.status == 'user.found'){
      req.requestedUser = result.user;
      next(); // Go to show
    }
    else if (result.status == 'user.not.found'){
      res.send(404, USER_NOT_FOUND);
    }
    else if (result.status == 'db.exception'){
      res.send(500, INTERNAL_SERVER_ERROR);
    }
  });
};

/**
 * Create user
 * requires: {username, password, email, role}
 */

exports.create = function (req, res, next) {
  usersDomain.createUser(req.body).then (function (result){
    if (result.status == 'user.created'){
      res.json(result.user);
    }  
    else if (result.status == 'user.not.created'){
      res.json(400, result.error);
    }
  });   
};

/**
 * Show a user
 */
exports.show = function(req, res) {
  res.json(req.requestedUser);
};


/**
 *  List of technicians
 *  returns [technicianObjectIds]
 */
exports.technicians = function (req, res, next) {
  User.find({role: 'tech', "school": req.user.school._id}, function (err, technicians) {
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
 * List of users for a user
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