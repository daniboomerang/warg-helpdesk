'use strict';

var mongoose = require('mongoose'),
    passport = require('passport');
var sessionDomain = require('../domain/session-domain');


/**
 * Session
 * returns user_info on authenticated user
 */
exports.session = function (req, res) {
  sessionDomain.validateUser(req.user).then (function (result){
    if (result.status == 'user.found'){
      res.json(result.user.user_info);
    }  
    else if (result.status == 'user.not.found'){
      res.json(500, result.err);
    }
  });
};

/**
 * Logout
 * returns nothing
 */
exports.logout = function (req, res) {
  if(req.user) {
    req.logout();
    res.send(200);
  } else {
    res.send(400, "Not logged in");
  }
};

/**
 *  Login
 *  requires: {email, password}
 */
exports.login = function (req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    var error = err || info;
    if (error) { return res.json(400, error); }
    req.logIn(user, function(err) {
      if (err) { return res.send(err); }
      res.json(req.user.user_info);
    });
  })(req, res, next);
}