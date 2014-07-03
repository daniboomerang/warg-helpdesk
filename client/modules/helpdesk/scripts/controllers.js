'use strict';

var helpdeskControllers = angular.module('helpdeskControllers', ['helpdeskServices'])

helpdeskControllers.controller('HelpdeskCtrl', function ($q, $scope, $rootScope, helpdeskConfigService, $location, Auth) {

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
	  		$scope.status.activeState = "helpdesk.incidences.open.list";
		});
	};

	$scope.setActiveState = function(href){
		$scope.status.activeState = href;
	};

	$scope.setActiveModule = function(module){	
		$scope.status.activeModule = module;
	};

	$scope.isActiveState = function(href) {
    	return href === $scope.status.activeState;
	};

	$scope.isActiveModule = function(module) {
    	return $scope.status[module.toLowerCase()];
	};

	$rootScope.$on('event:currentUser-changed', function(event) {
		initDesk();
	});

	$scope.logout = function() {
    Auth.logout(function(err) {
      if(!err) {
        $location.path('/login');
      }
    });
  };

});
