'use strict';
			
// Define main module Auth and injects all other modules as dependencies
var accounts = angular.module('accounts',
  	[
    'accountsControllers',
    'accountsServices'
 	]
)
.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('/accounts', '/helpdesk/accounts/open/list');
	$urlRouterProvider.otherwise('/accounts');

	$stateProvider
	
	// ACCOUNTS STATES AND NESTED VIEWS ========================================

	//////////////
	// ACCOUNTS //
	//////////////

	.state('helpdesk.accounts', {
		abstract: true,
	    url: '/accounts',
	    templateUrl: '/modules/helpdesk/modules/accounts/views/accounts.html',
	    controller: 'AccountsCtrl'
	})

		/////////////////////
    	// ACCOUNTS.CREATE //
    	/////////////////////

		.state('helpdesk.accounts.create', {
			abstract: true,
    		url: '/create',
	        template: '<ui-view/>'
	    })
	    	.state('helpdesk.accounts.create.account', {
		        url: '/account',		    
				templateUrl: '/modules/helpdesk/modules/accounts/views/partials/create-account.html',
		        controller: 'CreateAccountCtrl'
		    })
		    .state('helpdesk.accounts.create.list', {
		        url: '/list',		    
				templateUrl: '/modules/helpdesk/modules/accounts/views/partials/create-list.html',
		        controller: 'CreateListCtrl'        
		    })

		///////////////////
    	// ACCOUNTS.OPEN //
    	///////////////////

 		.state('helpdesk.accounts.open', {
		        url: '/list',
		        templateUrl: '/modules/helpdesk/modules/accounts/views/partials/list.html',
		        controller: 'ListAccountsCtrl'
		    })
			.state('helpdesk.accounts.open.account', {
		        url: '/account/:accountId',
		        views: {
	            	'account': {
						templateUrl: '/modules/helpdesk/modules/accounts/views/partials/account.html',
		            	controller: 'AccountCtrl'
		            }    
	            }    
		    })
		.state('helpdesk.accounts.settings', {
	        url: '/settings',
	        templateUrl: '/modules/helpdesk/modules/accounts/views/partials/user-settings.html',
	        controller: 'AccountSettingsCtrl'
		})
})