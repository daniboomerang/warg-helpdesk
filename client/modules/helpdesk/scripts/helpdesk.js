'use strict';
			
// Define main module Auth and injects all other modules as dependencies
var helpdesk = angular.module('helpdesk',
  	[
    'ui.router',
    'helpdeskControllers',
  	'helpdeskServices',
  	'helpdeskDirectives',
    'auth',
    'commonServices',
    'incidences',
    'inventory',
    'schools',
    'accounts'
 	]
)
.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('/helpdesk', '/incidences');
	$urlRouterProvider.when('/helpdesk/incidences', '/incidences');
	$urlRouterProvider.when('/helpdesk/inventory', '/inventory');
	$urlRouterProvider.when('/helpdesk/schools', '/schools');
	$urlRouterProvider.when('/helpdesk/accounts', '/accounts');
	$urlRouterProvider.otherwise('/helpdesk');

	$stateProvider
	    
	    // HELPDESK STATES AND NESTED VIEWS ========================================
	    .state('helpdesk', {
	        url: '/helpdesk',
	        templateUrl: '/modules/helpdesk/views/helpdesk.html',
	        controller: 'HelpdeskCtrl'
	    })

})
.run(function ($rootScope, Auth, locationService) {

	var INITIAL_STATE = 'helpdesk.incidences.open.list';

	var activeModule = function(state){
		function capitaliseFirstLetter(module){
		    return module.charAt(0).toUpperCase() + module.slice(1);
		}
      var states = state.split(".");
      return capitaliseFirstLetter(states[1]);
	};

	// DEALING WITH A LOCATION SERVICE (Current Location)

	var previousState;
	var currentLocation = {};
	var currentState; 
	var currentModule;
    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
    	
    	if (from.name == ''){previousState = INITIAL_STATE;}
    	else if (previousState != currentState) {previousState = from.name;}
        currentState = to.name;
        currentModule = activeModule(currentState);

        locationService.setCurrentState(currentState);
        locationService.setCurrentModule(currentModule);
        locationService.setPreviousState(previousState);

        currentLocation = {module: currentModule, state: currentState}
    	$rootScope.$broadcast('event:currentLocation-changed', currentLocation);
    });

	Auth.currentUser();});