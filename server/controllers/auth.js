'use strict';

/**
 *  Route middleware to ensure user is authenticated.
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(401);
}

/**
 *  Route middleware to ensure user is authenticated as Admin.
 */
exports.ensureAuthenticatedAsAdmin = function ensureAuthenticatedAsAdmin(req, res, next) {
  if ((req.isAuthenticated()) && (req.user.role == 'admin')){ return next(); }
  res.send(401);
}