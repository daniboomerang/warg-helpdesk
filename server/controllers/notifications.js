'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR"; 
var notificationsDomain = require('../domain/notifications-domain');


/**
 * List of notifications of a user
 */
exports.list = function(req, res) {
  notificationsDomain.listNotifications(req.user._id).then (function (resultList){
    if (resultList.status == RESULT_ERROR){
      res.json(500, resultList.error);
    }  
    else if (resultList.status == RESULT_SUCCESS){
      res.json(resultList.list);
    }
  });
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
    //notificationsDomain.assignee(req.incidence, req.body.assigned);
};