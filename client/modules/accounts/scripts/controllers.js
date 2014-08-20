'use strict';

var accountsControllers = angular.module('accountsControllers', ['accountsServices', 'authServices', 'ui.select'])

accountsControllers.controller('AccountsCtrl', function ($scope, Accounts, $q, Auth) {

  //////////
  /* CRUD */
  //////////

  $scope.create = function(email, username, password, role) {
    var deferred = $q.defer();
    Auth.createUser({
      email: email,
      username: username,
      password: password,
      role: role
    },
    function(err) {
      $scope.errors = {};
      if (!err) {
        deferred.resolve();
      } else {
        deferred.reject(err);
      }
    });
    return deferred.promise;
  };

  $scope.remove = function(incidence) {
    
  }; 

  $scope.update = function() {
   
  };

  $scope.find = function() {
    Accounts.query(function(accounts) {
      $scope.accounts = accounts;
    });
  };

  $scope.findOne = function() {
  
  };

});

accountsControllers.controller('CreateAccountCtrl', function ($scope, Auth, $location, $state) {

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
  
  $scope.createAccount = function(form){
    $scope.create(form.email.$viewValue, form.username.$viewValue,
                  form.password.$viewValue, $scope.user.role.selected.type).then(
                    function (result){
                      $scope.clear(form);
                      $state.go('helpdesk.accounts.open.list', $state.params);
                    },
                    function(err) {
                      angular.forEach(err.errors, function(error, field) {
                        form[field].$setValidity('mongoose', false);
                        $scope.errors[field] = error.message;
                      });
                      $scope.error.other = err.message;
                    });
    };
});

accountsControllers.controller('AccountsListCtrl', function($scope){
});

accountsControllers.controller('CreateAccountListCtrl', function($scope){

});

accountsControllers.controller('CreateAccountFormCtrl', function($scope){
  $scope.changed = function(filed){
    return filed.$dirty;
  };
});
