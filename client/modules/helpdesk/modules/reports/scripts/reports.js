'use strict';
			
// Define main module reports and injects all other modules as dependencies
var reports = angular.module('reports',
  	[
    'reportsControllers',
    'reportsServices',
    'chartsGeneratorServices'
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
				abstract: true,
        		url: '/incidences',
		        template: '<ui-view/>'
		})

	      	.state('helpdesk.reports.incidences.general', {
		        url: '/general',
		        templateUrl: '/modules/helpdesk/modules/reports/views/partials/incidences.html',
				controller: 'IncidencesReportCtrl'
		    })

		    .state('helpdesk.reports.incidences.school', {
		         url: '/:schoolCode',
		         templateUrl: '/modules/helpdesk/modules/reports/views/partials/incidences-school.html'	,
		         controller: 'IncidencesSchoolReportCtrl'
			})
})