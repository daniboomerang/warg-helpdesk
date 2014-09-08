'use strict';

var accountsControllers = angular.module('accountsControllers', [])

accountsControllers.controller('AccountsCtrl', function ($scope, $state, $q, accountResourceService, messengerService) {

  //////////
  /* CRUD */
  //////////

  $scope.create = function(email, username, password, role, school) {
    accountResourceService.createAccount(email, username, password, role, school).then(function(account) {
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
    $scope.create(form.email.$viewValue, form.username.$viewValue,
                  form.password.$viewValue, $scope.user.role.selected.type, $scope.user.school.selected);
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

accountsControllers.controller('AccountCtrl', function ($scope){
  $scope.changed = function(filed){
    return filed.$dirty;
  };
});

accountsControllers.controller('AccountSettingsCtrl', function($scope){
  
});
