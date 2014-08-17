  'use strict';

var adminControllers = angular.module('adminControllers', ['adminServices', 'authServices'])

adminControllers.controller('UsersCtrl', function ($scope, Users) {

  //////////
  /* CRUD */
  //////////

  $scope.create = function(title, description, severity, priority) {
   
  };

  $scope.remove = function(incidence) {
    
  }; 

  $scope.update = function() {
   
  };

  $scope.find = function() {
    Users.query(function(users) {
      $scope.users = users;
    });
  };

  $scope.findOne = function() {
  
  };

});

adminControllers.controller('CreateUserCtrl', function ($scope, Auth, $location) {

	$scope.roleTypes = [{type: 'user'}, {type:'tech'}];

  $scope.error = {};
  $scope.user = {};
  $scope.user.role = {};
	$scope.user.role.selected = {type: 'user'};
	
	$scope.clear = function(form) {
    $scope.user.email = '';
    $scope.user.username = '';
    $scope.user.password = '';
    form.$setPristine();
  };
  
  $scope.register = function(form) {
    Auth.createUser({
        email: form.email.$viewValue,
        username: form.username.$viewValue,
        password: form.password.$viewValue,
        role: $scope.user.role.selected.type
      },
      function(err) {
        $scope.errors = {};

        if (!err) {
       	  console.log('User successfully created');
       	  $scope.clear(form);
          $state.go('helpdesk.admin.users', $state.params);

        } else {
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
          $scope.error.other = err.message;
        }
      }
    )};
  });

adminControllers.controller('UsersListCtrl', function($scope){

});

adminControllers.controller('CreateUserFormCtrl', function($scope){
  $scope.changed = function(filed){
    return filed.$dirty;
  };
});





