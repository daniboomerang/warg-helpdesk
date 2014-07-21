'use strict';

var usersDomain = require('./users-domain'),
	incidencesDomain = require('./incidences-domain'),
 	Q = require('q');

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";

/**
 *  Processing a received email 
 *  returns a PROMISE with the result
 */

exports.process = function (sender, receiver, subject, content) {  
	
	var deferred = Q.defer();

	findSenderAsUser(sender).then(function (findResult){
		console.log("Process Mail: ", findResult.Status);
		if ((findResult.Status == 'sender.found') && (isAllowedToCreateIncidence(findResult.user))){
			createIncidence(subject, content, findResult.user).then(function (createResult){
				console.log("Process Mail: ", createResult.Status);
				if (createResult.Status == 'incidence.created'){
					deferred.resolve({Status: RESULT_SUCCESS});
				}
				else if (createResult.Status == 'incidence.not.created'){
					deferred.resolve({Status: RESULT_ERROR});
				}	
			});
		}
		else {
			deferred.resolve({Status: RESULT_ERROR});
		}		
	});

	return deferred.promise;
};

/* Private */

var findSenderAsUser = function(sender){

	var deferred = Q.defer();

	usersDomain.findByEmail(sender).then(function (findResult){

		if (findResult.Status == 'user.found'){
	      deferred.resolve({Status: 'sender.found', user: findResult.user});
	    }  
	    else if (findResult.Status == 'user.not.found'){
	      deferred.resolve({Status: 'sender.not.found'});
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
	return incidencesDomain.createIncidence(subject, content, user);
};