'use strict';

var usersDomain = require('./users-domain'),
  incidencesDomain = require('./incidences-domain'),
  schoolDomain = require('./schools-domain'),
  Q = require('q');

var RESULT_SUCCESS = "SUCCESS";
var RESULT_WARNING = "WARNING";
var RESULT_ERROR = "ERROR";

var mailSender;

module.exports = function(mailSenderService){

  mailSender = mailSenderService;

  var _processIncoming = function (sender, receiver, subject, content) {   
      
    var user;

    var createUserIncidence = function(findResult){
      if (findResult.status == 'user.found'){
        user = findResult.user;
        return incidencesDomain.createIncidenceFromMail(subject, content, findResult.user);
      }
    };

    var sendAcknowledgement = function(result){
      var incidence = result.incidence;
      
      var acknowledgeSubject = incidence.id + ' - ' + subject;
      var user_info = user.user_info;
      var acknowledgeText = mailAcknowledgeTemplate(user_info.username, incidence.id);

      return mailSender.sendMail(sender, null, acknowledgeSubject, acknowledgeText, null, null, null, null).then(function (replyMailResult){
        var deferred = Q.defer();
        if (replyMailResult.status == RESULT_ERROR){
          console.log("################### SEND ACK NOT SENT");
          deferred.resolve({status: RESULT_WARNING});
        } else if (replyMailResult.status == RESULT_SUCCESS){
          console.log("################### SEND ACK SENT");
          deferred.resolve({status: RESULT_SUCCESS});
        }
        console.log("################### ANTES DE RETURN DE created")
        return deferred.promise;
      });

    };

    return usersDomain.findByEmail(sender)
      .then(createUserIncidence)
      .then(sendAcknowledgement);

  };

  return {
    processIncoming: _processIncoming,  
    
    sendMail: function (receiver, sender, subject, content) {    
      var deferred = Q.defer();
      mailSender.sendMail(receiver, sender, subject, content, null, null, null, null).then(function (replyMailResult){
        if (replyMailResult.status == RESULT_ERROR){
          resolveDeferred({status: 'mail.not.sent'});
        }
        else if (replyMailResult.status == RESULT_SUCCESS){
          resolveDeferred({status: 'mail.sent'});
        }
      });
      return deferred.promise;
    }  
  } 
};

var mailAcknowledgeTemplate = function (username, incidenceId){
  return 'Hello ' + username + ':' + '\r\n' +
  'We just wanted to thank you for using our service support and let you know that your incidence has been received and we will start working on it as soon as possible.' + '\r\n' +
  '\r\n' +
  'Anything you´d like to comment you can both reply to this email or use our on-line helpdesk service app at:' + '\r\n' +
  '\r\n' +
  'Regards'+ '\r\n' +
  'The Warg-helpdesk Team';
};

