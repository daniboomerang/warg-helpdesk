'use strict';
			
// Define main module Auth and injects all other modules as dependencies
var schools = angular.module('schools',
  	[
    'ui.router',
    'schoolsControllers',
    'schoolsServices',
    'authServices'
 	]
)
.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('/schools', '/helpdesk/schools/open/list');
	$urlRouterProvider.otherwise('/schools');

	$stateProvider
	
	// SCHOOLS STATES AND NESTED VIEWS ========================================

	//////////////
	// ACCOUNTS //
	//////////////

	.state('helpdesk.schools', {
		abstract: true,
	    url: '/schools',
	    templateUrl: '/modules/schools/views/schools.html',
	    controller: 'SchoolsCtrl'
	})

		/////////////////////
    	// ACCOUNTS.CREATE //
    	/////////////////////

		.state('helpdesk.schools.create', {
			abstract: true,
    		url: '/create',
	        template: '<ui-view/>'
	    })
	    	.state('helpdesk.schools.create.school', {
		        url: '/school',		    
				templateUrl: '/modules/schools/views/partials/create.html',
		        controller: 'CreateSchoolCtrl'        
		    })

		///////////////////
    	// ACCOUNTS.OPEN //
    	///////////////////

		.state('helpdesk.schools.open', {
			abstract: true,
    		url: '/open',
	        template: '<ui-view/>'
	    })
	    	.state('helpdesk.schools.open.list', {
		        url: '/list',
		        templateUrl: '/modules/schools/views/partials/list.html',
		        controller: 'SchoolsListCtrl'
		    })
})
.run(function ($rootScope, Auth) {Auth.currentUser();});