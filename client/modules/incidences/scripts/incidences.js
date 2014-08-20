'use strict';
			
// Define main module Auth and injects all other modules as dependencies
var incidences = angular.module('incidences',
  	[
    'ui.router',
    'incidencesControllers',
    'incidencesServices',
    'incidencesDirectives',
    'authServices',
    'angularCharts'
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
	        templateUrl: '/modules/incidences/views/incidences.html',
	        controller: 'IncidencesCtrl'
	    })
		    .state('helpdesk.incidences.create', {
		        url: '/create',
		        templateUrl: '/modules/incidences/views/partials/create.html',
		        controller:'CreateCtrl'
		    })

		    .state('helpdesk.incidences.open', {
				abstract: true,
        		url: '/open',
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
			        controller: 'IncidenceCtrl',
			        resolve:{
						techniciansService: "techniciansService",
						techniciansList: function(techniciansService){
							techniciansService.initTechList();
						}
					}
			    })
	      	.state('helpdesk.incidences.statistics', {
		        url: '/statistics',
		        templateUrl: '/modules/incidences/views/partials/report-statistics.html',
				controller: 'IncidencesStatisticsCtrl'
		    })
})
.run(function ($rootScope, Auth) {Auth.currentUser();});