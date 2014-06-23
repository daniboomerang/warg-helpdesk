'use strict';

var wargHelpdeskControllers = angular.module('wargHelpdeskControllers', [])

wargHelpdeskControllers.controller('NavbarCtrl', function ($scope, $rootScope, Auth, UserRights, $location) {

    init();
     
    $scope.logout = function() {
      Auth.logout(function(err) {
        if(!err) {
          $location.path('/login');
        }
      });
    };

    function init(){
      // Retrieving available modules for currentUser
      if ($rootScope.currentUser){
        UserRights.getModules().then(function(modules) {
          $scope.modules = modules;
        }, function(reason) {
          console.log("Error + " + reason);
        });
      }  
      else
        $scope.modules = [];
    };

    $scope.account = function() {
     
    };

    $rootScope.$on('event:currentUser-changed', function(event) {
      init();
    });

  });

wargHelpdeskControllers.controller('userSettingsCtrl', function ($scope, $rootScope) {
  $scope.templateUrl = '/views/partials/user-settings.html';
});
