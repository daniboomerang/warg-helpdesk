'use strict';

var STATUS_NEW = "New";
var STATUS_DISPLAYED = "Displayed";
var STATUS_SEEN = "Seen";

var helpdeskControllers = angular.module('helpdeskControllers', [])

helpdeskControllers.controller('HelpdeskCtrl', function ($scope, $state, $rootScope, $location, helpdeskConfigService, Auth, LocationService, messengerService) {

  initDesk();

	function initDesk() {

    $rootScope.$on('event:currentUser-changed', function(event) {
        initDesk();
    });

    $scope.oneAtATime = false;
    $scope.status = {};

		helpdeskConfigService.setupDesk().then(function(){
        $scope.menu = helpdeskConfigService.getMenu();
        
        var modules;
      
      for (var i=0; i<$scope.menu.length; i++){
        var currentModule = $scope.menu[i].name.toLowerCase();
        $scope.status[currentModule] = true;
        }
        $scope.status.activeModule = LocationService.getCurrentModule();
        $scope.status.activeState = LocationService.getCurrentState();
    });
	};

  $rootScope.$on(LocationService.subscribe(), function(event, currentLocation) {
    $scope.status.activeModule = currentLocation.module;
    $scope.status.activeState = currentLocation.state;
  });

  $scope.cancelOperation = function() {
    $state.go(LocationService.getPreviousState());
  };

  $scope.isActiveModule = function(module){
  	return $scope.status[module.toLowerCase()];
  };

	$scope.searchIncidenceById = function(actionState, id, module){
		$scope.status.activeState = actionState;
		$scope.status.activeModule = module;
		$state.go('helpdesk.incidences.open.incidence', { incidenceId: id });
  };

  $scope.changedId = function(filed){
    return filed.$dirty;
  };

  $scope.goToState = function (state) {
    $state.go(state);
  }; 

  $scope.logout = function() {
    Auth.logout(function(err) {
      if(!err) {
        $location.path('/login');
      }
    });
  };


});

helpdeskControllers.controller('NavbarCtrl', function ($scope, Notifications, NotificationStatus, $state) {

  initNotifications();

  function getNewNotifications() {
    var newNotifications = [];
    for (var i=0; i<$scope.userNotifications.length; i++){
      if ($scope.userNotifications[i].status == STATUS_NEW){
        newNotifications.push($scope.userNotifications[i]);
      }
    }
    return newNotifications;
  };

  function initNotifications(){

    Notifications.query(function (notifications) {
        $scope.userNotifications = notifications;
        $scope.newNotifications = getNewNotifications();
      },
    function (error){
      messengerService.popMessage('error', 'Ups...notifications couldn´t be retrieved.', error.data);
    });

  }
 
  /*********** NOTIFICATIONS ***********/

  $scope.updateNotificationStatus = function(currentNotification, status) {
    var notification = new NotificationStatus({
      _id: currentNotification._id,
      status: status
    });
    notification.$updateStatus(function (notification) {
        $scope.userNotifications = notifications;
        $state.go('helpdesk.incidences.open.incidence', { incidenceId: notification.incidenceId});
        Notifications.query(function (notifications) {
        $scope.userNotifications = notifications;
        $scope.newNotifications = getNewNotifications();
      },
      function (error){
        messengerService.popMessage('error', 'Ups...notifications couldn´t be retrieved.', error.data);
      });
    },
    function (error){
      console.log("Error trying to update status for notification " + currentNotification._id);
    });
  };

  $scope.markNewNotsAsDisplayed = function() {
    for (var i=0; i<$scope.userNotifications.length; i++){
      if ($scope.userNotifications[i].status == STATUS_NEW){
        $scope.userNotifications[i].status = STATUS_DISPLAYED;
      }  
    }
    $scope.newNotifications = [];
  };

  /******** END NOTIFICATIONS *******/
});

helpdeskControllers.controller('MessengerCtrl', function ($scope, toaster, $window, messengerService) {

  init();
  function init() {
    $scope.$on(messengerService.subscribe(), function(event, message) {
      toaster.pop(message.type, message.title, message.text, 1300);
    });    
  }
});