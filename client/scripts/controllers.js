'use strict';

var wargHelpdeskControllers = angular.module('wargHelpdeskControllers', [])

wargHelpdeskControllers.controller('NavbarCtrl', function ($scope, $rootScope, Auth, UserRights, $location) { 
  
  $scope.logout = function() {
    Auth.logout(function(err) {
      if(!err) {
        $location.path('/login');
      }
    });
  };

});

/*wargHelpdeskControllers.controller('UserSettingsCtrl', function ($scope, $rootScope) {
  
  $scope.state = "<img src='/images/warning-40-red.png'/>";
  $scope.notificationState = $scope.state;

});*/
