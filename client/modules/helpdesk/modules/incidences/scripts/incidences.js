'use strict';
			
// Define main module incidences and injects all other modules as dependencies
var incidences = angular.module('incidences',
  	[
    'incidencesControllers',
    'incidencesServices',
    'incidencesDirectives'
 	]
)

.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('/incidences', '/helpdesk/incidences/open/list');
	$urlRouterProvider.otherwise('/incidences');

	$stateProvider
	    
	    // INCIDENCES STATES AND NESTED VIEWS ========================================
	    
	    .state('helpdesk.incidences', {
	    	abstract: true,
	        url: '/incidences',
	        templateUrl: '/modules/helpdesk/modules/incidences/views/incidences.html',
	        controller: 'IncidencesCtrl'
	    })
		    .state('helpdesk.incidences.create', {
		        url: '/create',
		        templateUrl: '/modules/helpdesk/modules/incidences/views/partials/create.html',
		        controller:'CreateIncidenceCtrl'
		    })

		    .state('helpdesk.incidences.open', {
				abstract: true,
        		url: '/open',
		        template: '<ui-view/>'
		    })
			    .state('helpdesk.incidences.open.list', {
			        url: '/list',
			        templateUrl: '/modules/helpdesk/modules/incidences/views/partials/list.html',
			        controller: 'ListCtrl'
			    })

			    	.state('helpdesk.incidences.open.list.overview', {
				        url: '/overview/:incidenceId',
				        views: {
			            	'overview': {
								templateUrl: '/modules/helpdesk/modules/incidences/views/partials/overview.html',
				            	controller: 'OverviewCtrl'
				            }    
			            }    
				    })

			    .state('helpdesk.incidences.open.incidence', {
			        url: '/:incidenceId',
			        templateUrl: '/modules/helpdesk/modules/incidences/views/partials/incidence.html',
			        controller: 'IncidenceCtrl'
			    })
			    
	      	.state('helpdesk.incidences.statistics', {
		        url: '/statistics',
		        templateUrl: '/modules/helpdesk/modules/incidences/views/partials/report-statistics.html',
				controller: 'IncidencesStatisticsCtrl'
		    })
})