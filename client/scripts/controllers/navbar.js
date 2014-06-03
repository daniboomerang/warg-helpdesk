'use strict';

angular.module('wargHelpdeskApp')
  .controller('NavbarCtrl', function ($scope, $rootScope, Auth, $location) {

    $scope.logout = function() {
      Auth.logout(function(err) {
        if(!err) {
          $location.path('/login');
        }
      });
    };
  });
