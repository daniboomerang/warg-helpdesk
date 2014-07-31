'use strict';

var usersDomain = require('./users-domain'),
	incidencesDomain = require('./incidences-domain'),
 	Q = require('q');

var RESULT_SUCCESS = "SUCCESS";
var RESULT_WARNING = "WARNING";
var RESULT_ERROR = "ERROR";

var sendMailService;

/**
 *  Processing a received email 
 *  returns a PROMISE with the result
 */

exports.setMailSender = function (mailSender) {  
	sendMailService = mailSender;
}

/**
 *  Processing a received email 
 *  returns a PROMISE with the result
 */

exports.processIncoming = function (sender, receiver, subject, content) {  
	
	var deferred = Q.defer();

	function resolveDeferred(result){
		if (result.status == 'acknowledge.not.sent'){
			deferred.resolve({status: RESULT_WARNING});
		}
		else if (result.status == 'incidence.creation.error'){
			deferred.resolve({status: RESULT_ERROR});
		}
		else if (result.status == 'acknowledge.sent' || 'spam'){
			deferred.resolve({status: RESULT_SUCCESS});	
		}
	}

	findSenderAsUser(sender).then(function (findResult){

		if ((findResult.status == 'sender.found') && (isAllowedToCreateIncidence(findResult.user))){
			var user_info = findResult.user.user_info;
			createIncidence(subject, content, findResult.user).then(function (createResult){
				try {
					if (createResult.status == 'incidence.created'){

						var incidence = createResult.incidence;

						// Sending Acknowledge eMail

						var replySubject = incidence._id + ' - ' + subject;
						var replyText = mailAcknowledgeTemplate(user_info.username, incidence._id);
						sendMailService.sendMail(sender, null, replySubject, replyText, null, null, null, null).then(function (replyMailResult){
							if (replyMailResult.status == RESULT_ERROR){
								resolveDeferred({status: 'acknowledge.not.sent'});
							}
							else if (replyMailResult.status == RESULT_SUCCESS){
								resolveDeferred({status: 'acknowledge.sent'});
							}
							/**************************/
						});
					}
					else if (createResult.status == 'incidence.not.created'){
						resolveDeferred({status: 'incidence.creation.error'});
					}
				}
				catch (e){
					resolveDeferred({status: 'acknowledge.not.sent'});
				}
			});				
		}
		else {resolveDeferred({status: 'spam'});}		
	});

	return deferred.promise;
};

/* Private */

var findSenderAsUser = function(sender){

	var deferred = Q.defer();

	usersDomain.findByEmail(sender).then(function (findResult){

		if (findResult.status == 'user.found'){
		  deferred.resolve({status: 'sender.found', user: findResult.user});
	    }  	
	    else if (findResult.status == 'user.not.found'){
	      deferred.resolve({status: 'sender.not.found', user: null});
	    }	    
  	}); 

  	return deferred.promise;
};

var isAllowedToCreateIncidence = function(user){
	var allowed = true;
	if (!allowed){
		console.log("User not allowed to create incidences");	
	}
	else{
		console.log("User allowed to create incidences");	
	}
	return allowed;
};

var createIncidence = function(subject, content, user){
	return incidencesDomain.createIncidence(subject, content, user, null, null);
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
