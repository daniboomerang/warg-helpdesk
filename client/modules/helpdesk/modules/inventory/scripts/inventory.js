	'use strict';
			
// Define main module inventory and injects all other modules as dependencies
var inventory = angular.module('inventory',
  [
    'inventoryControllers',
    'inventoryServices'
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
	    .state('helpdesk.inventory.index', {
	        url: '/index',
	        templateUrl: '/modules/helpdesk/modules/inventory/views/partials/index.html',
	       	controller: 'IndexCtrl'
	    })
	    .state('helpdesk.inventory.open', {
	        url: '/open',
	        templateUrl: '/modules/helpdesk/modules/inventory/views/partials/open.html',
	       	controller: 'InventoryCtrl'
	    })
	    .state('helpdesk.inventory.create', {
	        url: '/create/:itemId',
	        templateUrl: '/modules/helpdesk/modules/inventory/views/partials/create.html',
	       	controller: 'CreateInventoryCtrl'
	    })
	    .state('helpdesk.inventory.create.PC', {
	        url: '/PC',
	        templateUrl: '/modules/helpdesk/modules/inventory/views/partials/pcCustomFields.html',
	    })
	    .state('helpdesk.inventory.create.PRINTER', {
	        url: '/PRINTER',
	        templateUrl: '/modules/helpdesk/modules/inventory/views/partials/printerCustomFields.html',
	    })
	    .state('helpdesk.inventory.create.MONITOR', {
	        url: '/MONITOR',
	        templateUrl: '/modules/helpdesk/modules/inventory/views/partials/monitorCustomFields.html',
	    })
	    .state('helpdesk.inventory.create.MOUSE', {
	        url: '/MOUSE',
	        templateUrl: '/modules/helpdesk/modules/inventory/views/partials/mouseCustomFields.html',
	    })
	    .state('helpdesk.inventory.create.KEYBOARD', {
	        url: '/KEYBOARD',
	        templateUrl: '/modules/helpdesk/modules/inventory/views/partials/keyboardCustomFields.html',
	    })
	    .state('helpdesk.inventory.create.OTHER', {
	        url: '/OTHER',
	        templateUrl: '/modules/helpdesk/modules/inventory/views/partials/otherCustomFields.html',
	    })
	    .state('helpdesk.inventory.expenses', {
	        url: '/expenses',
	        templateUrl: '/modules/helpdesk/modules/inventory/views/partials/expenses.html',
	        controller: 'ExpensesReportCtrl'
	    })
});