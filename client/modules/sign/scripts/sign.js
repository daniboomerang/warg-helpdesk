'use strict';
			
// Define main module Sign and injects all other modules as dependencies
var sign = angular.module('sign',
  [
    'signControllers',
    'auth',
    'ui.router']);

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
	        templateUrl: '/modules/sign/views/sign-in.html',
	        controller: 'SigninCtrl'
	    })
	    
	    .state('sign.up', {
	        url: '/up',
	        templateUrl: '/modules/sign/views/sign-up.html',
	        controller: 'SignupCtrl'
	    })
});