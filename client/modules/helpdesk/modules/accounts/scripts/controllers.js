'use strict';

var accountsControllers = angular.module('accountsControllers', [])

accountsControllers.controller('AccountsCtrl', function ($scope, $state, $q, accountResourceService, messengerService) {

  //////////
  /* CRUD */
  //////////

  $scope.create = function(accountParams) {
    accountResourceService.createAccount(accountParams).then(function(account) {
      $scope.account = account;
      messengerService.popMessage('success', 'Account successfully created.', null);
      $state.go('helpdesk.accounts.open');
    },
    function (error){
      messengerService.popMessage('error', 'Account couldn´t be created.', error.data);
    });
  };

  $scope.find = function() {
    accountResourceService.findAccounts().then(function(accounts) {
      $scope.accounts = accounts;
    },
    function (error){
      messengerService.popMessage('error', 'The list of accounts couldn´t be retrieved.', error.data);
    });
  };

  $scope.findOne = function() {
    if ($state.params.accountId == ''){
      $state.go('helpdesk.accounts.open');
    }
    else{  
      accountResourceService.findOne($state.params.accountId).then(function(account) {
        $scope.account = account;
      },
      function (error){
        messengerService.popMessage('error', 'The account couldn´t be retrieved.', error.data);
        $state.go('helpdesk.accounts.open');
      });
    }  
  };
});

accountsControllers.controller('CreateAccountCtrl', function ($rootScope, $scope, $modal, $state, schoolResourceService, LocationService) {

  init();

  $scope.createAccount = function(form){
    var accountParams = {
      email: form.email.$viewValue,
      username: form.username.$viewValue,
      password: form.password.$viewValue,
      role: $scope.user.role.selected.type,
      school: $scope.user.school.selected,
      name: form.name.$viewValue,
      surname: form.surname.$viewValue
    }
    $scope.create(accountParams);
  };
  
  $scope.refreshSchools = function(){
    schoolResourceService.findSchools().then(function (schoolsList){      
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

  $scope.changed = function(filed){
    return filed.$dirty;
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
    var schoolsList = schoolResourceService.getSchools();
    if (schoolsList == null){
      $scope.schoolsListReady = false;
    }
    else if (schoolsList.length == 0){
      // We need to check a School has been created recently.
      // So we ensure that, calling again to the server.
      schoolResourceService.findSchools().then(function (schoolsList){      
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
      templateUrl: '/modules/helpdesk/modules/accounts/views/partials/warning-schools.html',
      controller: ModalWarningInstanceCtrl,
      size: 'sm'
    });

    warningModalInstance.result.then(function (choice) {
      if (choice == 'ok') {$state.go('helpdesk.schools.create.school');}
      else {$state.go(LocationService.getPreviousState());}
    }, function () { });
    
  };

});

accountsControllers.controller('CreateListCtrl', function($scope){
  
});

accountsControllers.controller('ListAccountsCtrl', function ($scope, $state) {

  $scope.selectedAccounts = [];

  $scope.openAccount = function(id) {
    $state.go('helpdesk.accounts.open.account', { accountId: id });
  };

});

accountsControllers.controller('AccountCtrl', function ($scope, LocationService, messengerService){

  $scope.saveChanges = function(form){
    $scope.account.$update(function(inventoryItem){
        messengerService.popMessage('success', 'Account successfully updated.');
        $scope.cancelOperation();
      }, function(error){
        messengerService.popMessage('error', 'Account not updated.', error.status + ' - ' + error.statusText);
      });
  };

  $scope.changed = function(filed){
    return filed.$dirty;
  };
});

accountsControllers.controller('AccountSettingsCtrl', function($scope){
  
});
