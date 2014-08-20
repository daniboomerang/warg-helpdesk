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

accountsControllers.controller('CreateAccountCtrl', function ($rootScope, $scope, Auth, $modal, $location, $state, schoolsService) {

  init();
	
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
  
  function init(){
    $scope.roleTypes = [{type: 'user'}, {type:'tech'}];
    $scope.error = {};
    $scope.user = {};
    $scope.user.role = {};
    $scope.user.role.selected = {type: 'user'};

    $scope.schoolsList = schoolsService.getSchoolsList();
          $scope.schoolsList= [];

    if ($scope.schoolsList.length > 0){
      $scope.user.school = $scope.schoolsList[0];
    }
    else{
      openModalWarning();
    }
    
  }

  function openModalWarning() {

      // Please note that $modalInstance represents a modal window (instance) dependency.
    // It is not the same as the $modal service used above.
    var ModalWarningInstanceCtrl = function ($scope, $modalInstance) {

      $scope.ok = function () {
        $modalInstance.close('ok');
      };

      $scope.cancel = function () {
        $modalInstance.close('cancel');
      };
    };

    var warningModalInstance = $modal.open({
      templateUrl: '/modules/accounts/views/partials/warning-schools.html',
      controller: ModalWarningInstanceCtrl,
      size: 'sm'
    });

    warningModalInstance.result.then(function (choice) {
      if (choice == 'ok') {$state.go('helpdesk.schools.create.school');}
      else {$state.go($rootScope.previousState);}
    }, function () { });
    
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
