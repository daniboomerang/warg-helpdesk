'use strict';
			
// Define main module Auth and injects all other modules as dependencies
var incidences = angular.module('incidences',
  	[
    'ui.router',
    'incidencesControllers',
    'incidencesServices',
    'authServices'
 	]
)
.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('/incidences', '/helpdesk/incidences/list');
	$stateProvider
	    
	    // SIGN STATES AND NESTED VIEWS ========================================
	    .state('helpdesk.incidences', {
	    	abstract: true,
	        url: '/incidences',
	        templateUrl: '/modules/incidences/views/incidences.html',
	        controller: 'IncidencesCtrl'
	    })
		    .state('helpdesk.incidences.create', {
		        url: '/create',
		        templateUrl: '/modules/incidences/views/partials/create.html'
		    })

		    .state('helpdesk.incidences.view', {
		        url: '/view/:incidenceId',
		        templateUrl: '/modules/incidences/views/partials/view.html'
		    })

		    .state('helpdesk.incidences.list', {
		        url: '/list',
		        templateUrl: '/modules/incidences/views/partials/list.html',
		        controller: 'ListCtrl'
		    })

		    	.state('helpdesk.incidences.list.overview', {
			        url: '/overview/:incidenceId',
			        views: {
		            	'overview': {
							templateUrl: '/modules/incidences/views/partials/overview.html',
			            	controller: 'OverviewCtrl'
			            }    
		            }    
			    })

	    
})
.run(function ($rootScope, Auth) {Auth.currentUser();});