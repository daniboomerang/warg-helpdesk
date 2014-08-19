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

	$urlRouterProvider.when('/admin', '/admin/users');
	$urlRouterProvider.when('/admin/users', '/helpdesk/admin/users/open/list');
	$urlRouterProvider.when('/admin/users/create', '/helpdesk/admin/users/create/user');
	$urlRouterProvider.when('/admin/schools', '/helpdesk/admin/schools/open/list');
	$urlRouterProvider.when('/admin/schools/create', '/helpdesk/admin/schools/create/school');
	
	$urlRouterProvider.otherwise('/admin');

	$stateProvider
	
	// ADMINISTRATION STATES AND NESTED VIEWS ========================================

    .state('helpdesk.admin', {
    	abstract: true,
        url: '/admin',
       	template: '<ui-view/>'
    })
    	///////////
    	// USERS //
    	///////////

		.state('helpdesk.admin.users', {
		    url: '/users',
		    templateUrl: '/modules/administration/views/partials/users/users.html',
		    controller: 'UsersCtrl'
		})

			//////////////////
	    	// USERS.CREATE //
	    	//////////////////

			.state('helpdesk.admin.users.create', {
				abstract: true,
        		url: '/create',
		        // Note: abstract still needs a ui-view for its children to populate.
		        template: '<ui-view/>'
		    })
		    	.state('helpdesk.admin.users.create.user', {
			        url: '/user',		    
					templateUrl: '/modules/administration/views/partials/users/create-user.html',
			        controller: 'CreateUserCtrl'        
			    })
			    .state('helpdesk.admin.users.create.list', {
			        url: '/list',		    
					templateUrl: '/modules/administration/views/partials/users/create-list.html',
			        controller: 'CreateUserListCtrl'        
			    })

			////////////////
	    	// USERS.OPEN //
	    	////////////////

			.state('helpdesk.admin.users.open', {
        		url: '/open',
		        template: '<ui-view/>'
		    })
		    	.state('helpdesk.admin.users.open.list', {
			        url: '/list',
			        templateUrl: '/modules/administration/views/partials/users/list.html',
			        controller: 'UsersListCtrl'
			    })

		/////////////
		// SCHOOLS //
		/////////////

		.state('helpdesk.admin.schools', {
		    url: '/schools',
		    templateUrl: '/modules/administration/views/partials/schools/schools.html',
		    controller: 'SchoolsCtrl'
		})

			////////////////////
	    	// SCHOOLS.CREATE //
	    	////////////////////

			.state('helpdesk.admin.schools.create', {
	    		url: '/create',
		        template: '<ui-view/>'
		    })
		    	.state('helpdesk.admin.schools.create.school', {
			        url: '/school',		    
					templateUrl: '/modules/administration/views/partials/schools/create.html',
			        controller: 'CreateSchoolCtrl'        
			    })

			//////////////////
	    	// SCHOOLS.OPEN //
	    	//////////////////

			.state('helpdesk.admin.schools.open', {
	    		url: '/open',
		        // Note: abstract still needs a ui-view for its children to populate.
		        template: '<ui-view/>'
		    })
		    	.state('helpdesk.admin.schools.open.list', {
			        url: '/list',
			        templateUrl: '/modules/administration/views/partials/schools/list.html',
			        controller: 'SchoolsListCtrl'
			    })

})
.run(function ($rootScope, Auth) {Auth.currentUser();});