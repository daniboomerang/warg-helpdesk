'use strict';

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

    req.logIn(newUser, function(err) {
      if (err) return next(err);
      return res.json(newUser.user_info);
    });
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
 *  returns [technicianProfiles]
 */
exports.technicians = function (req, res, next) {
  User.find({role: 'tech'}, function (err, technicians) {
    if (err) {
      return next(new Error('Failed to the list of Technicians'));
    }
    if (technicians) {
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
 *  Set role USER in the request
 *  returns {next}
 */
exports.setRoleUser = function (req, res, next) {
  req.body.role = "user";
  return next();
}

/**
 *  Set role TECH in the request
 *  returns {next}
 */
exports.setRoleTech = function (req, res, next) {
  req.body.role = "tech";
  return next();
}