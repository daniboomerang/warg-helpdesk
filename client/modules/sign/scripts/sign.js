'use strict';
			
// Define main module sign and injects all other modules as dependencies
var sign = angular.module('sign',
  [
    'signControllers'
  ]
);

sign.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('/sign', '/sign/in');
	$urlRouterProvider.otherwise('/sign');

	$stateProvider
	    
	    // SIGN STATES AND NESTED VIEWS ========================================
	    
	    .state('sign', {
	    	abstract: true,
	        url: '/sign',
	        templateUrl: '/modules/sign/views/sign.html'
	    })  
		    .state('sign.in', {
		        url: '/in',
		        templateUrl: '/modules/sign/views/partials/sign-in.html',
		        controller: 'SigninCtrl'
		    })
});