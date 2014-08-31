'use strict';

var accountsControllers = angular.module('accountsControllers', ['accountsServices', 'authServices', 'ui.select', 'helpdeskServices', 'commonServices'])

accountsControllers.controller('AccountsCtrl', function ($scope, $state, $q, Accounts, Auth, messengerService) {

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
    function(error) {
      $scope.errors = {};
      if (!error) {
        messengerService.popMessage('success', 'Account successfully created.');
        deferred.resolve();
      } else {
        deferred.reject(error);
        messengerService.popMessage('error', 'The account couldn´t be created.', error);
      }
    });
    return deferred.promise;
  };

  $scope.remove = function(account) {
    
  }; 

  $scope.update = function() {
   
  };

  $scope.find = function() {
    Accounts.query(function(accounts) {
      $scope.accounts = accounts;
    });
  };

  $scope.findOne = function(){
    if ($state.params.accountId == ''){
      $state.go('helpdesk.accounts.open');
    }
    else{
      Accounts.get({
        accountId: $state.params.accountId
      }, function(account) {
        $scope.account = account;
      },
       function (error){
        messengerService.popMessage('error', 'The account couldn´t be retrieved.', error.data);
        $state.go('helpdesk.accounts.open');
      });
    }
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
                      $state.go('helpdesk.accounts.open', $state.params);
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

accountsControllers.controller('CreateListCtrl', function($scope){
  
});

accountsControllers.controller('OpenAccountsCtrl', function($scope){
  
});

accountsControllers.controller('ListAccountsCtrl', function ($scope, $state) {

  $scope.selectedAccounts = [];
  $scope.$watch('selectedAccounts', function() {
    if ($scope.selectedAccounts.length > 0){
      if ($scope.selectedAccounts.length > 1)
        $scope.selectedAccounts.splice( 0, 1 );
      $scope.onSelectedAccount($scope.selectedAccounts[$scope.selectedAccounts.length - 1]);
    } 
  },
  true);

  $scope.onSelectedAccount = function(account) {
    $state.go('helpdesk.accounts.open.account', { accountId: account._id });
  };

});

accountsControllers.controller('AccountCtrl', function($scope){
  
});

accountsControllers.controller('AccountSettingsCtrl', function($scope){
  
});

accountsControllers.controller('CreateAccountFormCtrl', function($scope){
  $scope.changed = function(filed){
    return filed.$dirty;
  };
});
