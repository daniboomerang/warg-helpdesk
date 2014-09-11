'use strict';

var signControllers = angular.module('signControllers', [])

signControllers.controller('SigninCtrl', function ($scope, Auth, $location) {
  
  init();

  $scope.clear = function(form) {
    $scope.user.email = '';
    $scope.user.password = '';
    form.$setPristine();
  };

  $scope.login = function(form) {
    Auth.login('password', {
        email: form.email.$viewValue,
        password: form.password.$viewValue
      },
    function(err) {
      $scope.errors = {};
      if (!err) {
        $scope.clear(form);
        $location.path('/');
      } else {
        angular.forEach(err.errors, function(error, field) {
          form.email.$setValidity('mongoose', false);
          form.password.$setValidity('mongoose', false);
          $scope.errors.password = error.message;
        });
        $scope.error.other = err.message;
      }
    });
  };

  $scope.changed = function(filed){
    return filed.$dirty;
  };

  function init(){  

    $scope.error = {};
    $scope.user = {};

  }

});
