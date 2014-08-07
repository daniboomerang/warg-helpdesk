'use strict';

var signControllers = angular.module('signControllers', ['authServices'])

signControllers.controller('SigninCtrl', function ($scope, Auth, $location) {
  $scope.error = {};
  $scope.user = {};

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
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
          $scope.error.other = err.message;
        }
      });
    };
  });

