'use strict';

var STATUS_NEW = "New";
var STATUS_DISPLAYED = "Displayed";
var STATUS_SEEN = "Seen";

var helpdeskControllers = angular.module('helpdeskControllers', ['helpdeskServices'])

helpdeskControllers.controller('HelpdeskCtrl', function ($scope, $state, $rootScope, $location, helpdeskConfigService, Auth, notificationService, locationService) {

  initDesk();

	function initDesk() {

    $scope.oneAtATime = false;
    $scope.status = {};

    $scope.userNotifications = [];
    notificationService.getNotifications().then( function (notifications){
      $scope.userNotifications = notifications;
    });

		helpdeskConfigService.setupDesk().then(function(){
        $scope.menu = helpdeskConfigService.getMenu();
        
        var modules;
      
      for (var i=0; i<$scope.menu.length; i++){
        var currentModule = $scope.menu[i].module.toLowerCase();
        $scope.status[currentModule] = true;
        }
        $scope.status.activeModule = locationService.getCurrentModule();
        $scope.status.activeState = locationService.getCurrentState();
    });
	};

  $rootScope.$on('event:currentLocation-changed', function(event, currentLocation) {
    $scope.status.activeModule = currentLocation.module;
    $scope.status.activeState = currentLocation.state;
  });

  $scope.isActiveModule = function(module){
  	return $scope.status[module.toLowerCase()];
  };

	$scope.searchId = function(actionState, id, module){
		$scope.status.activeState = actionState;
		$scope.status.activeModule = module;
		$state.go('helpdesk.incidences.open.incidence', { incidenceId: id });
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

  $scope.markNotAsSeen = function(notification) {
    notification.status = STATUS_SEEN;
  };

  $scope.newNotifications = function() {
    var newNotifications = [];
    for (var i=0; i<$scope.userNotifications.length; i++){
      if ($scope.userNotifications[i].status == STATUS_NEW){
        newNotifications.push($scope.userNotifications[i]);
      }
    }
    return newNotifications;
  };

  $scope.markNewNotsAsDisplayed = function() {
    for (var i=0; i<$scope.userNotifications.length; i++){
      if ($scope.userNotifications[i].status == STATUS_NEW){
        $scope.userNotifications[i].status = STATUS_DISPLAYED;
      }  
    }
  };

});