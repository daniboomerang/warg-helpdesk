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

	$urlRouterProvider.when('/incidences', '/helpdesk/incidences/open/list');
	$urlRouterProvider.when('/incidences/open', '/helpdesk/incidences/open/list');
	$urlRouterProvider.otherwise('/incidences');
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

		    .state('helpdesk.incidences.open', {
		    	abstract: true,
        		url: '/open',
		        // Note: abstract still needs a ui-view for its children to populate.
		        template: '<ui-view/>'
		    })

		    .state('helpdesk.incidences.open.list', {
		        url: '/list',
		        templateUrl: '/modules/incidences/views/partials/list.html',
		        controller: 'ListCtrl'
		    })

		    	.state('helpdesk.incidences.open.list.overview', {
			        url: '/overview/:incidenceId',
			        views: {
		            	'overview': {
							templateUrl: '/modules/incidences/views/partials/overview.html',
			            	controller: 'OverviewCtrl'
			            }    
		            }    
			    })

		    .state('helpdesk.incidences.open.incidence', {
		        url: '/:incidenceId',
		        templateUrl: '/modules/incidences/views/partials/incidence.html',
		        controller: 'IncidenceCtrl'
		    })
				.state('helpdesk.incidences.open.incidence.rate', {
			        url: '/rate',
			        views: {
		            	'rate': {
							templateUrl: '/modules/incidences/views/partials/rate.html',
			            	controller: 'RateCtrl'
			            }    
		            }    
			    })

			    .state('helpdesk.incidences.open.incidence.effort', {
			        url: '/effort',
			        views: {
		            	'effort': {
							templateUrl: '/modules/incidences/views/partials/effort.html',
			            	controller: 'EffortCtrl'
			            }    
		            }    
			    })

				.state('helpdesk.incidences.open.incidence.assign', {
			        url: '/assign',
			        views: {
		            	'assign': {
							templateUrl: '/modules/incidences/views/partials/assign.html',
			            	controller: 'AssignCtrl'
			            }    
		            }    
			    })			    					    
})
.run(function ($rootScope, Auth) {Auth.currentUser();});