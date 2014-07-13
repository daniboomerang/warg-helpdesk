'use strict';
			
// Define main module Auth and injects all other modules as dependencies
var administration = angular.module('administration',
  	[
    'ui.router',
    'adminControllers',
    'adminServices',
    'adminDirectives',
    'authServices'
 	]
)
.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('/admin', '/helpdesk/admin/users');
	$stateProvider
	
	    // SIGN STATES AND NESTED VIEWS ========================================
    .state('helpdesk.admin', {
    	abstract: true,
        url: '/admin',
        templateUrl: '/modules/administration/views/admin.html',
    })
		.state('helpdesk.admin.users', {
		    url: '/users',
		    templateUrl: '/modules/administration/views/partials/users/users.html',
		    controller: 'UsersCtrl'
		})

			.state('helpdesk.admin.users.create', {
		        url: '/create',
		        views: {
		        	'createUser': {
						templateUrl: '/modules/administration/views/partials/users/create.html',
		            	controller: 'CreateUserCtrl'
		            }    
		        }    
		    })
})
.run(function ($rootScope, Auth) {Auth.currentUser();});