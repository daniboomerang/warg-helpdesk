'use strict';

var accountsControllers = angular.module('accountsControllers', ['accountsServices', 'authServices', 'ui.select', 'helpdeskServices', 'commonServices'])

accountsControllers.controller('AccountsCtrl', function ($scope, Accounts, $q, Auth) {

  //////////
  /* CRUD */
  //////////

  $scope.create = function(email, username, password, role, school) {
    var deferred = $q.defer();
    Auth.createUser({
      email: email,
      username: username,
      password: password,
      role: role,
      school: school  
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

accountsControllers.controller('CreateAccountCtrl', function ($rootScope, $scope, Auth, $modal, $state, schoolsService, locationService) {

  init();

	$scope.clear = function(form) {
    $scope.user.email = '';
    $scope.user.username = '';
    $scope.user.password = '';
    form.$setPristine();
  };
  
  $scope.createAccount = function(form){
    $scope.create(form.email.$viewValue, form.username.$viewValue,
                  form.password.$viewValue, $scope.user.role.selected.type, $scope.user.school.selected).then(
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
  
  $scope.refreshSchools = function(){
    schoolsService.retrieveSchools().then(function (schoolsList){      
      if (schoolsList.length > 0){
        $scope.schoolsList = schoolsList;
        $scope.user.school.selected = $scope.schoolsList[0];
        $scope.schoolsListReady = true;
      }
      else{
        openModalWarning();
      }
    });
  };

  function init(){

    // INITIALIZING DROPDOWNS DATA
    
    // Roles
    $scope.roleTypes = [{type: 'user'}, {type:'tech'}];
    $scope.error = {};
    $scope.user = {};
    $scope.user.role = {};
    $scope.user.role.selected = {type: 'user'};

    // Schools
    $scope.user.school = {};
    var schoolsList = schoolsService.getSchools();
    if (schoolsList == null){
      $scope.schoolsListReady = false;
    }
    else if (schoolsList.length == 0){
      // We need to check a School has been created recently.
      // So we ensure that, calling again to the server.
      schoolsService.retrieveSchools().then(function (schoolsList){      
        if (schoolsList.length > 0){
          $scope.schoolsList = schoolsList;
          $scope.user.school.selected = $scope.schoolsList[0];
          $scope.schoolsListReady = true;
        }
        else{
          if ($rootScope.currentUser.role = "admin"){
            openModalWarning();
          }
          else{
            $scope.schoolsListReady = true;
          }
        }
      });
    }
    else{
      $scope.schoolsList = schoolsList;
      $scope.user.school.selected = $scope.schoolsList[0];
      $scope.schoolsListReady = true;
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
      else {$state.go(locationService.getPreviousState());}
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
