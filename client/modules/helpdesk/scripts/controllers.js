'use strict';

var helpdeskControllers = angular.module('helpdeskControllers', ['helpdeskServices'])

helpdeskControllers.controller('HelpdeskCtrl', function ($q, $scope, $state, $rootScope, helpdeskConfigService, $location, Auth) {

  	initDesk();

	$scope.oneAtATime = false;
	$scope.status = {};

	function initDesk() {

		helpdeskConfigService.setupDesk().then(function(){
		  	$scope.menu = helpdeskConfigService.getMenu();
		  	
		  	var modules;
			
			for (var i=0; i<$scope.menu.length; i++){
				var currentModule = $scope.menu[i].module.toLowerCase();
				$scope.status[currentModule] = true;
  			}
  			$scope.status.activeModule = 'Incidences';
	  		$scope.status.activeState = "helpdesk.incidences.open.list";
		});
	};

	$scope.logout = function() {
    Auth.logout(function(err) {
      if(!err) {
        $location.path('/login');
      }
    })};

    $scope.isActiveModule = function(module){
    	return $scope.status[module.toLowerCase()];
    }

	$scope.searchId = function(actionState, id, module){
		$scope.status.activeState = actionState;
		$scope.status.activeModule = module;
		$state.go('helpdesk.incidences.open.incidence', { incidenceId: id });
  	};

  	$rootScope.$on('event:currentUser-changed', function(event) {
		initDesk();
	});

});
