'use strict';
			
// Define main module Sign and injects all other modules as dependencies
var reporting = angular.module('reporting',
  [
    'reportingControllers',
    'angularCharts',
    'auth',
    'ui.router']);

reporting.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('helpdesk/reporting', 'helpdesk/reporting/statistics');
	$urlRouterProvider.otherwise('/reporting');

	$stateProvider
	    
	    // REPORT STATES AND NESTED VIEWS ========================================
	    .state('helpdesk.reporting', {
	    	abstract: true,
	        url: '/reporting',
	        templateUrl: '/modules/reporting/views/reporting.html'
	    })

	    .state('helpdesk.reporting.expenses', {
	        url: '/expenses',
	        templateUrl: '/modules/reporting/views/partials/expenses.html',
	        controller: 'ExpensesReportCtrl'
	    })
	        
	    .state('helpdesk.reporting.statistics', {
	        url: '/statistics',
	        templateUrl: '/modules/reporting/views/partials/statistics.html',
	        controller: 'StatisticsReportCtrl'
	    })
	    
	    .state('helpdesk.reporting.effort', {
	        url: '/effort',
	        templateUrl: '/modules/reporting/views/partials/effort.html',
	        controller: 'EffortReportCtrl'
	    })
});