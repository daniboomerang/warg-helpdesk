'use strict';
			
// Define main module helpdesk and injects all other modules as dependencies
var helpdesk = angular.module('helpdesk',
  	[
    'helpdeskControllers',
  	'helpdeskServices',
  	'helpdeskDirectives',
  	/* COMMON */
  	'urlLocation',
    'notifications',
    'messenger',
    /* SUBSECTIONS */
    'incidences',
    'inventory',
    'schools',
    'accounts'
 	]
)
.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('/helpdesk', '/incidences');
	$urlRouterProvider.otherwise('/helpdesk');

	$stateProvider
	    
	    // HELPDESK STATES AND NESTED VIEWS ========================================
	    .state('helpdesk', {
	        url: '/helpdesk',
	        templateUrl: '/modules/helpdesk/views/helpdesk.html',
	        controller: 'HelpdeskCtrl'
	    })

})