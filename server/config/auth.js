'use strict';

/**
 *  Route middleware to ensure user is authenticated.
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(401);
}

// Check for technician middleware, this is unrelated to passport.js
exports.ensureTech = function ensureAdmin(req, res, next) {
        if(req.user && req.user.role === 'tech')
            next();
        else
            res.send(403);
};

// Check for admin middleware, this is unrelated to passport.js
exports.ensureAdmin = function ensureAdmin(req, res, next) {
        if(req.user && req.user.role === 'admin')
            next();
        else
            res.send(403);
};

/**
 * Incidence authorizations routing middleware
 */
exports.incidence = {
  hasAuthorization: function(req, res, next) {
    if (req.incidence.creator._id.toString() !== req.user._id.toString()) {
      return res.send(403);
    }
    next();
  }
};
