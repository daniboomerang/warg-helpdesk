'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";
var INCIDENCE_NOT_FOUND = '404 - Incidence not found';
var INTERNAL_SERVER_ERROR = '500 - Internal server error';

var mongoose = require('mongoose'),
  Incidence = mongoose.model('Incidence');

var incidencesDomain = require('../domain/incidences-domain');

/**
 * Find incidence by id
 */
exports.incidence = function(req, res, next, id) {
  incidencesDomain.findIncidence(id).then (function (result){
    if (result.status == 'incidence.found'){
      req.incidence = result.incidence;
      next(); // Go to show
    }  
    else if (result.status == 'incidence.not.found'){
      res.send(404, INCIDENCE_NOT_FOUND);
    }
    else if (result.status == 'db.exception'){
      res.send(500, INTERNAL_SERVER_ERROR);
    }
  });
};

/**
 * Create a incidence
 */
exports.create = function(req, res) {
 incidencesDomain.createIncidence(req.body.title, req.body.description, req.user, req.body.severity, req.body.priority, req.body.school).then (function (result){
    if (result.status == 'incidence.created'){
      res.json(result.incidence);
    }  
    else if (result.status == 'incidence.not.created'){
      res.json(500, result.error);
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
exports.comment = function(req, res, next) {
  incidencesDomain.updateComment(req.incidence, req.body.comment, req.user.user_info.username, Date.now()).then (function (result){
    if (result.status == 'incidence.updated'){
      res.json(result.incidence);
      next();
    }  
    else if (result.status == 'incidence.not.updated'){
      res.json(500, result.error);
    }
  });  
};

/**
 * Update incidence assignation
 */
exports.assignee = function(req, res, next) {
  incidencesDomain.updateAssignee(req.incidence, req.body.assigned).then (function (result){
    if (result.status == 'incidence.updated'){
      res.json(result.incidence);
      next();
    }  
    else if (result.status == 'incidence.not.updated'){
      res.json(500, result.error);
    }
  });   
};

/**
 * Update incidence rating
 */
exports.rate = function(req, res) {
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
exports.effort = function(req, res) {
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
 * Show an incidence
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
