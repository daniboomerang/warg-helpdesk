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

wargHelpdeskControllers.controller('userSettingsCtrl', function ($scope, $rootScope) {
  $scope.templateUrl = '/views/partials/user-settings.html';
  $scope.state = "<img src='/images/warning-40-red.png'/>";
  $scope.notificationState = $scope.state;

  //$scope.notificationState.normal = "<img src='/images/warning-40-black.png'/>";

});
