'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR"; 
var ROLE_USER = "user";
var OWNER = 'owner';
var TECH = 'tech';


var mongoose = require('mongoose'),
  Notification = mongoose.model('Notification'),
  mailDomain = require('../domain/mail-domain')(global.mailSender),
  usersDomain = require('../domain/users-domain'),
  Q = require('q');
  
//var mailDomain = require('../config/mail-domain')((require('../config/mail-sender')(require('../config/config').mailSending));

/* Private */

/**
 *  Notifies a user
 *  Returns a PROMISE with the result 
 */
var notify = function (addresseeRole, notificationInfo, mailInfo) {

  function notifyViaEmail(addressee, subject, content) {
    var deferred = Q.defer();
    mailDomain.sendMail(addressee, null, subject, content).then( function (result){
      if (result.status == "mail.not.sent"){
        deferred.resolve({status: 'email.notification.not.sent'});
      }
      else if (result.status == "mail.sent"){
        deferred.resolve({status: 'email.notification.sent'});
      }
    });
    return deferred.promise;
  };


  function createNotification(userId, notificationText) {

    var deferred = Q.defer();
    var notification = new Notification({text: notificationText, addressee: userId});

    notification.save(function(err) {
      if (err) {
        deferred.resolve({status: 'notification.not.sent', error: err});
      } else {
        deferred.resolve({status: 'notification.sent', notification: notification});
      }
    });

    return deferred.promise;
  };



  if (addresseeRole == ROLE_USER){
    notifyViaEmail(mailInfo.addressee, mailInfo.subject, mailInfo.content).then( function ( result){
      if (result.status == 'notification.not.sent'){
        console.log("There has been an error trying to notify a user via email.");
      }
    });
  }
  createNotification(notificationInfo.addressee, notificationInfo.notification).then( function (result){
    if (result.status == 'notification.not.sent'){
      console.log("There has been an error trying to create a user notification");
    }
  });  
};

/**
 *  Process a comment
 */
exports.comment = function(incidence, commentOwnerId, comment) {
  var incidenceId = incidence.id;
  var incidenceTitle = incidence.title;
  var incidenceOwnerId = incidence.creator._id;
  
  var userProfilesPromise = Q.all([ usersDomain.findUser(commentOwnerId), usersDomain.findUser(incidenceOwnerId), usersDomain.findByUsername(incidence.assigned)])
  userProfilesPromise.then(function(results){
    var commentOwnerResult = results[0];
    var incidenceOwnerResult = results[1];
    var incidenceAssignedResult = results[2];

    if  (commentOwnerResult.status == 'user.found' &&
         incidenceOwnerResult.status == 'user.found'){

      var incidenceOwnerRole = incidenceOwnerResult.user.role;
      var incidenceOwnerMail = incidenceOwnerResult.user.email;

      var commentOwnerUsername = commentOwnerResult.user.username;

      var notificationMessage = function(userType, username){
        if (userType == OWNER) return  username + " has commented an incidence opended by you.";
        else return  username + " has commented an incidence assigned to you.";
      }

      var mailSubject = 'New Comment on ' + incidenceId + ' - ' + incidenceTitle;

      // Notify Incidence Owner User?
      if (!commentOwnerId.equals(incidenceOwnerId)){
        notify(incidenceOwnerRole, {addressee: incidenceOwnerId, notification: notificationMessage(OWNER, commentOwnerUsername)}, {addressee: incidenceOwnerMail, subject: mailSubject, content: comment});
      }

      // Notify Incidence Assigned User?
      if (incidenceAssignedResult.status == 'user.found'){
        var incidenceAssignedId = incidenceAssignedResult.user._id;
        if (!(commentOwnerId.equals(incidenceAssignedId))){
          var incidenceAssignedMail = incidenceAssignedResult.user.email;
          var incidenceAssignedRole = incidenceAssignedResult.user.role;
          notify(incidenceAssignedRole, {addressee: incidenceAssignedId, notification: notificationMessage(TECH, commentOwnerUsername)}, {addressee: incidenceAssignedMail, subject: mailSubject, content: comment});
        }  
      }
    }  
    else{ console.error("There has been an error trying to retrive users profiles at comment notification."); }  
  });
};

/**
 *  Notify new assignation
 */
exports.assignee = function(incidence, assignee) {
  var incidenceId = incidence.id;
  var incidenceOwnerId = incidence.creator._id;  
  usersDomain.findUser(incidenceOwnerId).then( function( result){
    if (result.status == 'user.found'){

      var incidenceOwnerRole = result.user.role;
      var incidenceOwnerMail = result.user.email;

      var notificationMessage = function(incidence){
        if (incidence.assigned == null){return  "Your incidence " + incidenceId + " has changed status to 'On Going'";}
        else  {return  "Your incidence " + incidenceId + " has been assigned to a new agent";}
      };

      var mailSubject = "New Status: On Going for " + incidenceId + ' - ' + incidence.title 
      // Notify Incidence Owner User
      notify(incidenceOwnerRole, {addressee: incidenceOwnerId, notification: notificationMessage(incidence)}, {addressee: incidenceOwnerMail, subject: mailSubject, content: notificationMessage(incidence)});
    }  
    else{ console.error("There has been an error trying to retrive users profiles at assignee notification."); }  
  });
};

/**
 *  Return the list of notifications of a user
 *  Returns a PROMISE with the result 
 */
exports.listNotifications = function(user) {

  var deferred = Q.defer();

  Notification.find({addressee: user}).sort('-created').exec(function(err, notifications) {
     if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {   
      deferred.resolve({status: RESULT_SUCCESS, list: notifications});
    }
  });

  return deferred.promise;
};