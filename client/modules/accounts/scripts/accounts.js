'use strict';
			
// Define main module Auth and injects all other modules as dependencies
var accounts = angular.module('accounts',
  	[
    'ui.router',
    'accountsControllers',
    'accountsServices',
    'authServices'
 	]
)
.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('/accounts', '/accounts/open');
	$urlRouterProvider.when('/accounts/open', '/helpdesk/accounts/open/list');
	$urlRouterProvider.when('/accounts/create', '/helpdesk/accounts/create/account');
	$urlRouterProvider.otherwise('/accounts');

	$stateProvider
	
	// ADMINISTRATION STATES AND NESTED VIEWS ========================================

	//////////////
	// ACCOUNTS //
	//////////////

	.state('helpdesk.accounts', {
	    url: '/accounts',
	    templateUrl: '/modules/accounts/views/accounts.html',
	    controller: 'AccountsCtrl'
	})

		/////////////////////
    	// ACCOUNTS.CREATE //
    	/////////////////////

		.state('helpdesk.accounts.create', {
    		url: '/create',
	        template: '<ui-view/>'
	    })
	    	.state('helpdesk.accounts.create.account', {
		        url: '/account',		    
				templateUrl: '/modules/accounts/views/partials/create-account.html',
		        controller: 'CreateAccountCtrl'        
		    })
		    .state('helpdesk.accounts.create.list', {
		        url: '/list',		    
				templateUrl: '/modules/accounts/views/partials/create-list.html',
		        controller: 'CreateAccountListCtrl'        
		    })

		///////////////////
    	// ACCOUNTS.OPEN //
    	///////////////////

		.state('helpdesk.accounts.open', {
    		url: '/open',
	        template: '<ui-view/>'
	    })
	    	.state('helpdesk.accounts.open.list', {
		        url: '/list',
		        templateUrl: '/modules/accounts/views/partials/list.html',
		        controller: 'AccountsListCtrl'
		    })
})
.run(function ($rootScope, Auth) {Auth.currentUser();});