'use strict';
			
// Define main module Auth and injects all other modules as dependencies
var helpdesk = angular.module('home',
  	[
    'ui.router',
    'homeControllers',
    'auth'
 	]
)
.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('/helpdesk/home', '/helpdesk/home/dashboard');
	$stateProvider
	    
	    // SIGN STATES AND NESTED VIEWS ========================================
		    .state('helpdesk.home', {
		        abstract: true,
	        	url: '/home',
	        	templateUrl: '/modules/home/views/home.html',
	        	controller: 'HomeCtrl'
		    })
		    	.state('helpdesk.home.dashboard', {
		        	url: '/dashboard',
		        	templateUrl: '/modules/home/views/partials/dashboard.html'
		    	})
})
.run(function ($rootScope, Auth) {Auth.currentUser();});