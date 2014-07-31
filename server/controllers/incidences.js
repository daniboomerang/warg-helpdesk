'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR"; 

var mongoose = require('mongoose'),
  Incidence = mongoose.model('Incidence');

var incidencesDomain = require('../domain/incidences-domain');


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
 incidencesDomain.createIncidence(req.body.title, req.body.description, req.user, req.body.severity, req.body.priority).then (function (result){
    if (result.status == 'incidence.created'){
      res.json(result.incidence);
    }  
    else if (result.status == 'incidence.not.created'){
      res.json(500, result.err);
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
 * List of incidences for a user
 */
exports.list = function(req, res) {
  incidencesDomain.listIncidences(req.user).then (function (resultList){
    if (resultList.status == RESULT_ERROR){
      res.json(500, resultList.error);
    }  
    else if (resultList.status == RESULT_SUCCESS){
      res.json(resultList.list);
    }
  });
};
