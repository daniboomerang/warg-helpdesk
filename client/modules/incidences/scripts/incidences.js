'use strict';
			
// Define main module Auth and injects all other modules as dependencies
var incidences = angular.module('incidences',
  	[
    'ui.router',
    'incidencesControllers',
    'incidencesServices',
    'authServices',
    'desk'
 	]
)
.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('/incidences', '/incidences/dashboard');
	$stateProvider
	    
	    // SIGN STATES AND NESTED VIEWS ========================================
	    .state('incidences', {
	    	abstract: true,
	        url: '/incidences',
	        templateUrl: '/modules/incidences/views/incidences.html',
	        controller: 'IncidencesCtrl',
	        resolve:{
	        	UserRights: "UserRights",
	        	userRights:  function($http, UserRights){
            		// $http returns a promise for the url data
            		/*return $http({method: 'GET', url: '/auth/incidences'}).then( function(userRights) {
                   		return userRights;
               		});*/
	    			return UserRights.getRightsOnIncidences();
         		}
	        }
	    })
		    .state('incidences.dashboard', {
		        url: '/dashboard',
		        templateUrl: '/modules/incidences/views/partials/dashboard.html'
		    })

		    .state('incidences.create', {
		        url: '/create',
		        templateUrl: '/modules/incidences/views/partials/create.html'
		    })

		    .state('incidences.list', {
		        url: '/list',
		        templateUrl: '/modules/incidences/views/partials/list.html'
		    })
			    .state('incidences.list.all', {
			        url: '/list/all',
			        templateUrl: '/modules/incidences/views/partials/list.html'
			    })
	    
})
.run(function ($rootScope, Auth) {Auth.currentUser();});