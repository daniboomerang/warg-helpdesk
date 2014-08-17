'use strict';
			
// Define main module Auth and injects all other modules as dependencies
var helpdesk = angular.module('helpdesk',
  	[
    'ui.router',
    'helpdeskControllers',
  	'helpdeskServices',
  	'helpdeskDirectives',
    'auth',
    'incidences',
    'inventory'
 	]
)
.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('/helpdesk', '/incidences');
	$urlRouterProvider.when('/helpdesk/incidences', '/incidences');
	$urlRouterProvider.when('/helpdesk/admin', '/admin');
	$urlRouterProvider.when('/helpdesk/admin/users', '/admin/users');
	$urlRouterProvider.when('/helpdesk/admin/schools', '/admin/schools');
	$urlRouterProvider.when('/helpdesk/inventory', '/inventory');
	$urlRouterProvider.otherwise('/helpdesk');

	$stateProvider
	    
	    // SIGN STATES AND NESTED VIEWS ========================================
	    .state('helpdesk', {
	        url: '/helpdesk',
	        templateUrl: '/modules/helpdesk/views/helpdesk.html',
	        controller: 'HelpdeskCtrl'
	    })

})
.run(function ($rootScope, Auth) {Auth.currentUser();});