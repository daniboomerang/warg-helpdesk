'use strict';

var messengerServices = angular.module('messengerServices', [])

messengerServices.factory('messengerService', function ($rootScope){

	var SUBSCRIPTION = 'event:pop-message';

	return {
		popMessage : function(type, title, message) {
		  if (message ==  null){message='';}
		  $rootScope.$broadcast(SUBSCRIPTION, {type: type, title: title, text: message});
		},
		subscribe: function(){
		  return SUBSCRIPTION;
		},
	};
	
});