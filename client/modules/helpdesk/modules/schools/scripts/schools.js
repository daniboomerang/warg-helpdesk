'use strict';
			
// Define main module schools and injects all other modules as dependencies
var schools = angular.module('schools',
  	[
    'schoolsControllers',
    'schoolsServices'
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
	    templateUrl: '/modules/helpdesk/modules/schools/views/schools.html',
	    controller: 'SchoolsCtrl'
	})

		////////////////////
    	// SCHOOLS.CREATE //
    	////////////////////

		.state('helpdesk.schools.create', {
			abstract: true,
    		url: '/create',
	        template: '<ui-view/>'
	    })
	    	.state('helpdesk.schools.create.school', {
		        url: '/school',		    
				templateUrl: '/modules/helpdesk/modules/schools/views/partials/create.html',
		        controller: 'CreateSchoolCtrl'        
		    })

		//////////////////
    	// SCHOOLS.OPEN //
    	//////////////////
    	.state('helpdesk.schools.open', {
	        url: '/list',
	        templateUrl: '/modules/helpdesk/modules/schools/views/partials/list.html',
	        controller: 'ListSchoolsCtrl'
	    })
			.state('helpdesk.schools.open.school', {
		        url: '/school/:schoolId',
		        views: {
	            	'school': {
						templateUrl: '/modules/helpdesk/modules/schools/views/partials/school.html',
		            	controller: 'SchoolCtrl'
		            }    
	            }    
		    })

})