'use strict';

var usersDomain = require('./users-domain'),
  incidencesDomain = require('./incidences-domain'),
  schoolDomain = require('./schools-domain'),
  Q = require('q');

var RESULT_SUCCESS = "SUCCESS";
var RESULT_WARNING = "WARNING";
var RESULT_ERROR = "ERROR";

var _mailSender;
var subjectInterpreter = require('./mail-subject-interpreter');

module.exports = function(mailSenderService){

  _mailSender = mailSenderService;

  return {
    processIncoming: _processIncoming,  
    sendMail: _sendMail
  } 

};

var _sendMail = function (receiver, sender, subject, content) {    
  var deferred = Q.defer();
  _mailSender.sendMail(receiver, sender, subject, content, null, null, null, null).then(function (replyMailResult){
    if (replyMailResult.status == RESULT_ERROR){
      resolveDeferred({status: 'mail.not.sent'});
    }
    else if (replyMailResult.status == RESULT_SUCCESS){
      resolveDeferred({status: 'mail.sent'});
    }
  });
  return deferred.promise;
};

var _processIncoming = function (sender, receiver, subject, content) {
  var incidenceId = subjectInterpreter.extractId(subject);
  return incidencesDomain.findIncidence(incidenceId)
    .then(function(response){
      if (response.status == 'incidence.not.found'){
        return _createIncidence(sender, receiver, subject, content);
      }else{
        return _commentIncidence(sender, receiver, subject, content);
      }
    });
};

var _commentIncidence = function(sender, receiver, subject, content){
  var incidenceId = subjectInterpreter.extractId(subject);

  var user;

  var findUser = function(sender){
    return usersDomain.findByEmail(sender).then(function(data){
      user = data.user;
      var deferred = Q.defer();
      deferred.resolve({user: data});
      return deferred.promise;
    })
  };

  var _commentIncidence = function(){
    return incidencesDomain.postComment(incidenceId, content, user.email, new Date());
  };;

  return findUser(sender)
          .then(_commentIncidence);
};

var _createIncidence = function(sender, receiver, subject, content){
  var user;

  var createUserIncidence = function(findResult){
    user = findResult.user;
    return incidencesDomain.createIncidence(subject, content, findResult.user);
  };

  var sendAcknowledgement = function(result){
    var incidence = result.incidence;

    var acknowledgeSubject = subjectInterpreter.mailIncidenceDefinition(incidence.id, subject);
    var user_info = user.user_info;
    var acknowledgeText = mailAcknowledgeTemplate(user_info.username, incidence.id);

    return _mailSender.sendMail(sender, null, acknowledgeSubject, acknowledgeText, null, null, null, null).then(function (replyMailResult){
      var deferred = Q.defer();
      if (replyMailResult.status == RESULT_ERROR){
        deferred.resolve({status: RESULT_WARNING});
      } else if (replyMailResult.status == RESULT_SUCCESS){
        deferred.resolve({status: RESULT_SUCCESS});
      }
      return deferred.promise;
    });

  };

  return usersDomain.findByEmail(sender)
    .then(createUserIncidence)
    .then(sendAcknowledgement);

};

var mailAcknowledgeTemplate = function (username, incidenceId){
  var mailContent =  'Hola ' + username + ':'
  +'\r\n'+'\r\n'+
  'Solo queríamos agradecerle por utilizar nuestro servicio de atención al cliente y hacerle saber que su incidencia ha sido recibida y empezaremos a trabajar en ella lo antes posible.'
  +'\r\n'+'\r\n'+
  'Le informamos que cualquier cosa que quiera comentar puede hacerlo de dos maneras:'
  +'\r\n'+
  '1.- Bien respondiendo a este mismo email.'
  +'\r\n'+
  '2.- A través de su cuenta en nuestra pagina web: http://warg-helpdesk.herokuapp.com/' 
  +'\r\n'+'\r\n'+
  'Saludos,'
  +'\r\n'+'\r\n' + 
  'El equipo de Warg Helpdesk.';
  
  console.log(mailContent);
  return mailContent;
};

/*var mailAcknowledgeTemplate = function (username, incidenceId){
  return 'Hello ' + username + ':' + '\r\n' +
  'We just wanted to thank you for using our service support and let you know that your incidence has been received
   and we will start working on it as soon as possible.' + '\r\n' +
  '\r\n' +
  'Anything you´d like to comment you can both reply to this email or use our on-line helpdesk service app at:' + '\r\n' +
  '\r\n' +
  'Regards'+ '\r\n' +
  'The Warg-helpdesk Team';
};*/

