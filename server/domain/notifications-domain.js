'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR"; 
var ROLE_USER = "user";
var OWNER = "owner";
var TECH = "technician";

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
function notify (notificationInfo, mailInfo) {

  function notifyViaEmail(addressee, subject, content) {
    var deferred = Q.defer();
    mailDomain.sendMail(user).then( function (result){
      if (result.status == "mail.not.sent"){
        deferred.resolve({status: 'email.notification.not.sent'});
      }
      else if (result.status == "mail.sent"){
        deferred.resolve({status: 'email.notification.sent'});
      }
    });
    return deferred.promise;
  };


  function createNotification(user, notification) {

    var deferred = Q.defer();
    var notification = new Notification({text: notification, addressee: user});

    notification.save(function(err) {
      if (err) {
        deferred.resolve({status: 'notification.not.sent', error: err});
      } else {
        deferred.resolve({status: 'notification.sent', notification: notification});
      }
    });

    return deferred.promise;
  };



  if (user.role == ROLE_USER){
    notifyViaEmail(mailInfo.email, mailInfo.subject, mailInfo.content).then( function ( result){
      if (result.status == 'notification.not.sent'){
        console.log("There has been an error trying to notify a user via email.");
      }
    });
  }
  createNotification(notificationInfo.user, notificationInfo.notification).then( function (result){
    if (result.status == 'notification.not.sent'){
      console.log("There has been an error trying to create a user notification");
    }
  });  
};

/**
 *  Process a comment
 */
exports.comment = function(incidence, commentOwnerId, comment) {
  var incidenceId = incidence._id;
  var incidenceTitle = incidence.title;
  var incidenceOwnerId = incidence.creator;
  var incidenceAssignedId = incidence.assigned;

  var userProfilesPromise = Q.all([ usersDomain.show(commentOwnerId), usersDomain.show(incidenceOwnerId), usersDomain.show(incidenceAssignedId) ])
  userProfilesPromise.then(function(showResults){
    var commentOwnerProfileResult = showResults[0];
    var incidenceOwnerProfileResult = showResults[1];
    var incidenceAssignedProfileResult = showResults[2];

    if  (commentOwnerProfileResult.status == 'user.shown' &&
         incidenceOwnerProfileResult.status == 'user.shown'&& 
         incidenceAssignedProfileResult.status == 'user.shown'){

      var notificationMessage = function(userType, username){
        if (user == OWNER) return  username + " has commented an incidence opended by you.";
        else return  username + " has commented an incidence assigned to you.";
      }

      var mailSubject = 'New Comment on ' + incidenceId + ' - ' + incidenceTitle;

      if ((commentOwnerId == incidenceOwnerId) && (incidenceAssignedId != null)){
        notify({addressee: incidenceAssignedIdProfileResult.user, notification: notificationMessage(TECH, incidenceAssignedProfileResult.user.username)}, {addressee: incidenceAssignedIdProfileResult.user.email, subject: mailSubject, content: comment});
      }  
      else { // commentOwner != incidenceOwner
        var thirdPartyUser = ((commentOwnerId != incidenceOwnerId) && (commentOwnerId != incidenceAssignedId));
        if (thirdPartyUser){
          notify({addressee: incidenceOwnerProfileResult.user, notification: notificationMessage(OWNER, incidenceOwnerProfileResult.user.username)}, {addressee: incidenceOwnerProfileResult.user.email, subject: mailSubject, content: comment});
          notify({addressee: incidenceAssignedIdProfileResult.user, notification: notificationMessage(TECH, incidenceAssignedProfileResult.user.username)}, {addressee: incidenceAssignedIdProfileResult.user.email, subject: mailSubject, content: comment});
        }
        else if (commentOwnerId == incidenceAssignedId){
          notify({addressee: incidenceOwnerProfileResult.user, notification: notificationMessage(OWNER, incidenceOwnerProfileResult.user.username)}, {addressee: incidenceOwnerProfileResult.user.email, subject: mailSubject, content: comment});
        }
        else{
           notify({addressee: incidenceAssignedIdProfileResult.user, notification: notificationMessage(TECH, incidenceAssignedProfileResult.user.username)}, {addressee: incidenceAssignedIdProfileResult.user.email, subject: mailSubject, content: comment});
        }
      }
    }  
    else{ console.error("There has been an error trying to retrive users profiles at comment notification."); }  
  });
};

/**
 *  Return the list of notifications of a user
 *  Returns a PROMISE with the result 
 */
exports.listNotifications = function(user) {

  var deferred = Q.defer();

  Notification.find({addresse: user}).sort('-created').populate('addresse').exec(function(err, notifications) {
     if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {   
      deferred.resolve({status: RESULT_SUCCESS, list: notifications});
    }
  });

  return deferred.promise;
};
