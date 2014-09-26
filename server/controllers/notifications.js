'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR"; 
var notificationsDomain = require('../domain/notifications-domain');
var NOTIFICATION_NOT_FOUND = '404 - Notification not found';
var INTERNAL_SERVER_ERROR = '500 - Internal server error';

/**
 * Find notification by id
 */
exports.notification = function(req, res, next, id) {
  notificationsDomain.findNotification(id).then (function (result){
    if (result.status == 'notification.found'){
      req.notification = result.notification;
      next(); // Go to show
    }  
    else if (result.status == 'notification.not.found'){
      res.send(404, NOTIFICATION_NOT_FOUND);
    }
    else if (result.status == 'db.exception'){
      res.send(500, INTERNAL_SERVER_ERROR);
    }
  });
};

/**
 * List of notifications of a user
 */
exports.list = function(req, res) {
  notificationsDomain.listNotifications(req.user._id).then (function (result){
    if (result.status == RESULT_ERROR){
      res.json(500, result.error);
    }  
    else if (result.status == RESULT_SUCCESS){
      res.json(result.list);
    }
  });
};

/**
 * Update a notification
 */
exports.status = function(req, res, next) {
  notificationsDomain.updateStatus(req.notification, req.body.status).then (function (result){
    if (result.status == 'notification.not.updated'){
      res.json(500, result.error);
    }  
    else if (result.status == 'notification.updated'){
      res.json(result.notification);
    }
  });
};

/**
 * Show a otification
 */
exports.show = function(req, res) {
  res.json(req.notification);
};


/**
 * Process possible notifications for a new comment
 */
exports.notifyComment = function(req, res) {
  notificationsDomain.comment(req.incidence, req.user._id, req.body.comment);
};

/**
 * Notify new assignation
 */
exports.notifyAssignee = function(req, res) {
  notificationsDomain.assignee(req.incidence, req.body.assigned);
};

/**
 * Notify closing
 */
exports.notifyClose = function(req, res) {
  notificationsDomain.close(req.incidence);
};