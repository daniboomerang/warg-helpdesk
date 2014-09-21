'use strict';
			
// Define main module reports and injects all other modules as dependencies
var reports = angular.module('reports',
  	[
    'reportsControllers',
    'reportsServices'
    ]
)
.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
	
	// REPORTS STATES AND NESTED VIEWS ========================================

	/////////////
	// REPORTS //
	/////////////

	.state('helpdesk.reports', {
		abstract: true,
	    url: '/reports',
	    templateUrl: '/modules/helpdesk/modules/reports/views/reports.html'
	})

      	.state('helpdesk.reports.incidences', {
	        url: '/incidences',
	        templateUrl: '/modules/helpdesk/modules/reports/views/partials/incidences.html',
			controller: 'IncidencesReportCtrl'
	    })

	

})