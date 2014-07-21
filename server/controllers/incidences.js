'use strict';

var mongoose = require('mongoose'),
  Incidence = mongoose.model('Incidence');

/**
 * Find incidence by id
 */
exports.incidence = function(req, res, next, id) {
  Incidence.load(id, function(err, incidence) {
    if (err) return res.json(500, err);
    if (!incidence) return next(new Error('Failed to load incidence ' + id));
    req.incidence = incidence;
    next();
  });
};

/**
 * Create a incidence
 */
exports.create = function(req, res) {
  var incidence = new Incidence(req.body);
  incidence.creator = req.user;

  incidence.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(incidence);
    }
  });
};

/**
 * Update a incidence
 */
exports.update = function(req, res) {
  var incidence = req.incidence;
  incidence.title = req.body.title;
  incidence.description = req.body.description;
  incidence.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(incidence);
    }
  });
};

/**
 * Post a comment incidence 
 */
exports.postComment = function(req, res) {  
  var incidence = req.incidence;
  var post = {post: req.body.comment, author: req.user, date: Date.now()};
  incidence.history.push(post);
  incidence.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(incidence);
    }
  });
};

/**
 * Update incidence assignation
 */
exports.updateAssigned = function(req, res) {
  var incidence = req.incidence;
  incidence.assigned = req.body.assigned;
  incidence.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(incidence);
    }
  });
};

/**
 * Update incidence rating
 */
exports.updateRate = function(req, res) {
  var incidence = req.incidence;
  incidence.rate = req.body.rate;
  incidence.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(incidence);
    }
  });
};

/**
 * Update incidence effort
 */
exports.updateEffort = function(req, res) {
  var incidence = req.incidence;
  incidence.effort = req.body.effort;
  incidence.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(incidence);
    }
  });
};


/**
 * Close incidence
 */
exports.close = function(req, res) {
  var incidence = req.incidence;
  incidence.substatus = req.body.substatus;
  incidence.status = 'Closed';
  incidence.save(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(incidence);
    }
  });
};

/**
 * Delete a incidence
 */
exports.destroy = function(req, res) {
  var incidence = req.incidence;

  incidence.remove(function(err) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(incidence);
    }
  });
};

/**
 * Show a incidence
 */
exports.show = function(req, res) {
  res.json(req.incidence);
};

/**
 * List of incidences
 */
exports.all = function(req, res) {
  Incidence.find().sort('-created').populate('creator', 'username').exec(function(err, incidences) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(incidences);
    }
  });
};
