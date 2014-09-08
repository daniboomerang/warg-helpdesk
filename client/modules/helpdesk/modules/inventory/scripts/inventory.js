	'use strict';
			
// Define main module inventory and injects all other modules as dependencies
var inventory = angular.module('inventory',
  [
    'inventoryControllers'
  ]
);

inventory.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.when('/inventory', '/helpdesk/inventory/open');
	$urlRouterProvider.otherwise('/inventory');
	$stateProvider
	    
	    // INVENTORY STATES AND NESTED VIEWS ========================================
	    
	    .state('helpdesk.inventory', {
	    	abstract: true,
	        url: '/inventory',
	        templateUrl: '/modules/helpdesk/modules/inventory/views/inventory.html'
	    })
		    .state('helpdesk.inventory.open', {
		        url: '/open',
		        templateUrl: '/modules/helpdesk/modules/inventory/views/partials/open.html',
		       	controller: 'InventoryCtrl'
		    })
		    .state('helpdesk.inventory.expenses', {
		        url: '/expenses',
		        templateUrl: '/modules/helpdesk/modules/inventory/views/partials/expenses.html',
		        controller: 'ExpensesReportCtrl'
		    })
});