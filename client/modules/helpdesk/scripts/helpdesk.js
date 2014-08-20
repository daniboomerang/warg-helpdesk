'use strict';
			
// Define main module Auth and injects all other modules as dependencies
var helpdesk = angular.module('helpdesk',
  	[
    'ui.router',
    'helpdeskControllers',
  	'helpdeskServices',
  	'helpdeskDirectives',
    'auth',
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
.run(function ($rootScope, Auth) {

	var INITIAL_STATE = 'helpdesk.incidences.open.list';

	var activeModule = function(state){
		function capitaliseFirstLetter(module){
		    return module.charAt(0).toUpperCase() + module.slice(1);
		}
      var states = state.split(".");
      return capitaliseFirstLetter(states[1]);
	};

    $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
    	if (from.name == ''){$rootScope.previousState = INITIAL_STATE;}
    	else if ($rootScope.previousState != $rootScope.currentState) {$rootScope.previousState = from.name;}
        $rootScope.currentState = to.name;
        $rootScope.currentModule = activeModule($rootScope.currentState);
    });
	Auth.currentUser();});