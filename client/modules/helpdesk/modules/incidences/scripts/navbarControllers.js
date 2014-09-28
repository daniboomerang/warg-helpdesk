  'use strict';

incidencesControllers.controller('IncidenceNavCtrl', function ($modal, $scope, $document, $rootScope, accountResourceService, $log) {
  
  init();

  function init(){

    $scope.edit = {};
    $scope.edit.rate = false;
    $scope.edit.assign = false;

    $scope.rating = {};
    $scope.rating.max = 5;
    $scope.rating.rate = 1;
    $scope.rating.showOkButton = false;

    $document.scrollTo(top, 0, 1000);
  }

  $scope.toogleRateMode = function(){
    $scope.edit.rate = !$scope.edit.rate;
  }

  $scope.toogleAssignMode = function(){
    $scope.edit.assign = !$scope.edit.assign;
  }

  $scope.toTheBottom = function() {
    var bottom = angular.element(document.getElementById('bottom'));
    $document.scrollTo(bottom, 0, 1000);
  }

  //////////////////////////////////////
  /////////////// RATING ///////////////
  //////////////////////////////////////

  $scope.hoveringOver = function(value,object) {
    $scope.rating.percent = (100 * $scope.incidence.rate) / $scope.rating.max;
    $scope.rating.overStar = value;
    $scope.rating.percent =  (100 * value) / $scope.rating.max;
  };

  $scope.poolRating = function(){     
    $scope.updateRate($scope.rating.rate);
    $scope.edit.rate = false;
    $scope.rating.showOkButton = false;
  }

  //////////////////////////////////////
  /////////////// EFFORT ///////////////
  //////////////////////////////////////

  $scope.openModalEffort = function() {
    modalEffort();

    function modalEffort (){
      var effortModalInstance = $modal.open({
        templateUrl: '/modules/helpdesk/modules/incidences/views/partials/effort-modal.html',
        controller: EffortModalInstanceCtrl,
        size: 'sm',
        resolve: {
          incidence: function () {
            return $scope.incidence;
          }
        }
      });

      effortModalInstance.result.then(function (effortResult) {
        $scope.updateEffort(effortResult.reportedEffort);
      }, function () {
        $log.info('Report effort incidence dismissed at: ' + new Date());
      });
    }  
  };

  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.
  var EffortModalInstanceCtrl = function ($scope, $modalInstance, incidence) {
    
    init();

    /*$scope.closeModalEffort = function () {
      $modalInstance.dismiss('cancel');
    };*/

    $scope.changed = function(filed){
      return filed.$dirty;
    };

    $scope.validCurrentEffort = function(){
      return ((typeof $scope.effort.currentEffortHours != 'undefined') &&
              (typeof $scope.effort.currentEffortMinutes != 'undefined'))
    };

    $scope.effortChanged = function () {
      if ((typeof $scope.effort.currentEffortHours == 'undefined') || (typeof $scope.effort.currentEffortMinutes == 'undefined')){
        // Do Nothing: this keeps the form as invalid
      }
      else{
        $scope.effort.totalEffortMinutes = incidence.effortMinutes + $scope.effort.currentEffortMinutes;
        $scope.effort.totalEffortHours = incidence.effortHours + $scope.effort.currentEffortHours;
        $scope.effort.totalEffort = $scope.effort.totalEffortHours * 60 + $scope.effort.totalEffortMinutes;
      }  
    };

    function init(){
      $scope.effort = {};
      $scope.effort.incidence = incidence;
      $scope.effort.incidenceTotalEffort = incidence.effort;   
      $scope.effort.currentEffortMinutes = 0;
      $scope.effort.currentEffortHours = 0;
      $scope.effort.totalEffort = incidence.effort;
      $scope.effort.totalEffortMinutes = incidence.effortMinutes;
      $scope.effort.totalEffortHours = incidence.effortHours;
    }
    
    $scope.poolEffort = function () {
      var effortResult = {
        reportedEffort:  $scope.effort.currentEffortHours * 60 +  $scope.effort.currentEffortMinutes
      }
      $modalInstance.close(effortResult);
    };
  };

  //////////////////////////////////////
  /////////////// CLOSE ////////////////
  //////////////////////////////////////

  $scope.openModalClose = function() {

    modalClose();

    function modalClose (){
      var closeModalInstance = $modal.open({
        templateUrl: '/modules/helpdesk/modules/incidences/views/partials/close.html',
        controller: CloseModalInstanceCtrl,
        size: 'sm',
        resolve: {
          incidence: function () {
            return $scope.incidence;
          }
        }
      });

      closeModalInstance.result.then(function (closeResult) {
        $scope.updateClose(closeResult.reason, closeResult.effort, closeResult.duplicated, closeResult.invalidComment)
      }, function () {
        $log.info('Close incidence dismissed at: ' + new Date());
      });
    }  
  };

  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.
  var CloseModalInstanceCtrl = function ($scope, $modalInstance, incidence) {
    
    init();

    $scope.commentLength = function (form) {
        if (form.invalidComment.$viewValue == undefined){return 0};
        return form.invalidComment.$viewValue.length;     
    };

    $scope.closeIncidence = function (form) {
      var closeResult = {
        reason: $scope.close.reason.selected.type,
        effort: $scope.close.totalEffort,
        duplicated: form.duplicated.$viewValue,
        invalidComment: form.invalidComment.$viewValue
      }
      $modalInstance.close(closeResult);
    };

    /*$scope.closeModalClose = function () {
      $modalInstance.dismiss('cancel');
    };*/

    $scope.changed = function(filed){
      return filed.$dirty;
    };

    $scope.getMinlengthValidation = function(){
      if ($scope.close.reason.selected.type == 'Invalid'){
        return 25;
      }
      else return 0;
    };

    $scope.getMinutesValidation = function(){
      if ($scope.close.totalEffort == 0){
        return 1;
      }
      else return 0;
    };

    $scope.validCurrentEffort = function(){
      return ((typeof $scope.close.currentEffortHours != 'undefined') &&
              (typeof $scope.close.currentEffortMinutes != 'undefined'))
    };

    $scope.effortChanged = function () {
      if ((typeof $scope.close.currentEffortHours == 'undefined') || (typeof $scope.close.currentEffortMinutes == 'undefined')){
        // Do Nothing: this keeps the form as invalid
      }
      else{
        $scope.close.totalEffortMinutes = incidence.effortMinutes + $scope.close.currentEffortMinutes;
        $scope.close.totalEffortHours = incidence.effortHours + $scope.close.currentEffortHours;
        $scope.close.totalEffort = $scope.close.totalEffortHours * 60 + $scope.close.totalEffortMinutes;
      }  
    };

    $scope.close.currentReason = $scope.close.reason.selected;

    function init(){
      $scope.close = {};
      $scope.close.reason = {};
      $scope.close.incidence = incidence;
      $scope.close.reasons = [{type: 'Solved'}, {type:'Duplicated'}, {type:'Invalid'}];
      $scope.close.reason.selected = $scope.close.reasons[0];
      $scope.close.incidenceTotalEffort = incidence.effort;   
      $scope.close.currentEffortMinutes = 0;
      $scope.close.currentEffortHours = 0;
      $scope.close.totalEffort = incidence.effort;
      $scope.close.totalEffortMinutes = incidence.effortMinutes;
      $scope.close.totalEffortHours = incidence.effortHours;
    };
  };  

  //////////////////////////////////////
  /////////////// ASSIGN ///////////////
  //////////////////////////////////////

  $scope.openModalAssign = function() {

    modalAssign();

    function modalAssign (){
      var assignModalInstance = $modal.open({
        templateUrl: '/modules/helpdesk/modules/incidences/views/partials/assign-modal.html',
        controller: AssignModalInstanceCtrl,
        size: 'sm',
        resolve: {
          incidence: function () {
            return $scope.incidence;
          }
        }
      });

      assignModalInstance.result.then(function (assignationResult) {
        $scope.updateAssignee(assignationResult.newAssignee, assignationResult.reportedEffort);
      }, function () {
        $log.info('Assign incidence dismissed at: ' + new Date());
      });
    }  
  };

  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.
  var AssignModalInstanceCtrl = function ($scope, $modalInstance, incidence) {
    
    init();

    /*$scope.closeModalAssign = function () {
      $modalInstance.dismiss('cancel');
    };*/

    $scope.changed = function(filed){
      return filed.$dirty;
    };

    $scope.validCurrentEffort = function(){
      return ((typeof $scope.assign.currentEffortHours != 'undefined') &&
              (typeof $scope.assign.currentEffortMinutes != 'undefined'))
    };

    $scope.effortChanged = function () {
      if ((typeof $scope.assign.currentEffortHours == 'undefined') || (typeof $scope.assign.currentEffortMinutes == 'undefined')){
        // Do Nothing: this keeps the form as invalid
      }
      else{
        $scope.assign.totalEffortMinutes = incidence.effortMinutes + $scope.assign.currentEffortMinutes;
        $scope.assign.totalEffortHours = incidence.effortHours + $scope.assign.currentEffortHours;
        $scope.assign.totalEffort = $scope.assign.totalEffortHours * 60 + $scope.assign.totalEffortMinutes;
      }  
    };

    $scope.assignTo = function(technician){
      $scope.assign.currentAssignation = technician;
      $scope.assign.allowUpdate = true;
    };

    $scope.assignIncidence = function(){   
      $scope.assign.allowUpdate = false;  
      $scope.assign.allowToPool = false;
      var assignationResult = {
        newAssignee: $scope.assign.currentAssignation,
        reportedEffort:  $scope.assign.currentEffortHours * 60 +  $scope.assign.currentEffortMinutes
      }
      $modalInstance.close(assignationResult);
    };

    $scope.refreshTechnicians = function(){
      accountResourceService.findTechnicians().then(function (techniciansList){
        $scope.assign.techniciansList = techniciansList;
        if ($scope.assign.techniciansList.length == 0){
          if ($rootScope.currentUser.role = "admin"){
            openModalWarning();
          }
          else{
            $scope.assign.techniciansListReady = true;
            $scope.assign.techniciansListEmpty = true;   
          }
        }
        else{
          $scope.technician.selected = $scope.assign.techniciansList[0];
          $scope.assign.techniciansListReady = true;
          $scope.assign.techniciansListEmpty = false;   
        }
      });
    };

    function init(){
      $scope.assign = {};
      $scope.assign.incidence = incidence;
      $scope.assign.incidenceTotalEffort = incidence.effort;   
      $scope.assign.currentEffortMinutes = 0;
      $scope.assign.currentEffortHours = 0;
      $scope.assign.totalEffort = incidence.effort;
      $scope.assign.totalEffortMinutes = incidence.effortMinutes;
      $scope.assign.totalEffortHours = incidence.effortHours;


      // Technicians
      $scope.technician = {};
      $scope.assign.allowUpdate = false;
      $scope.assign.techniciansListReady = false;

      var techniciansList = accountResourceService.getTechnicians();
      if (techniciansList == null){
        $scope.assign.techniciansListReady = false;
        $scope.assign.techniciansListEmpty = false
      }
      else if (techniciansList.length == 0){
        accountResourceService.findTechnicians().then(function (techniciansList){      
          if (techniciansList.length > 0){
            $scope.assign.techniciansList = techniciansList;
            $scope.technician.selected = $scope.assign.techniciansList[0];
            $scope.assign.techniciansListReady = true;
          }
          else{
            if ($rootScope.currentUser.role = "admin"){
              openModalWarning();
            }
            else{
              $scope.assign.techniciansListReady = true;
              $scope.assign.techniciansListEmpty = true
            }
          }
        });
      }  
      else{
        $scope.assign.techniciansList = techniciansList;
        $scope.technician.selected = $scope.assign.techniciansList[0];
        $scope.assign.techniciansListReady = true;
        $scope.assign.techniciansListEmpty = false;
      }  
    };
  };  

  ////////////////////////
  //////// ASSIGN ////////
  ////////////////////////

  initAssign();
  
  $scope.assignTo = function(technician){
    $scope.assign.allowUpdate = true;
    $scope.assign.currentAssignation = technician;
  }

  $scope.poolAssignation = function(){     
      $scope.assign.allowUpdate = false;
      $scope.updateAssignee($scope.assign.currentAssignation, 0); // The first time an incidence is assigned, there is no reported effort
      $scope.edit.assign = false;
  }

  $scope.refreshTechnicians = function(){
    accountResourceService.findTechnicians().then(function (techniciansList){
      $scope.assign.techniciansList = techniciansList;
      if ($scope.assign.techniciansList.length == 0){
        if ($rootScope.currentUser.role = "admin"){
          openModalWarning();
        }
        else{
          $scope.assign.techniciansListReady = true;
          $scope.assign.techniciansListEmpty = true;   
        }
      }
      else{
        $scope.technician.selected = $scope.assign.techniciansList[0];
        $scope.assign.techniciansListReady = true;
        $scope.assign.techniciansListEmpty = false;   
      }
    });
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
      templateUrl: '/modules/helpdesk/modules/incidences/views/partials/warning-technicians.html',
      controller: ModalWarningInstanceCtrl,
      size: 'sm'
    });

    warningModalInstance.result.then(function (choice) {
      if (choice == 'ok') {$state.go('helpdesk.accounts.create.account');}
      else {$state.go(LocationService.getPreviousState());}
    }, function () { });
    
  };

  function initAssign(){

    // Technicians
    $scope.assign = {};
    $scope.technician = {};
    $scope.assign.allowUpdate = false;
    $scope.assign.techniciansListReady = false;

    var techniciansList = accountResourceService.getTechnicians();
    if (techniciansList == null){
      $scope.assign.techniciansListReady = false;
      $scope.assign.techniciansListEmpty = false
    }
    else if (techniciansList.length == 0){
      accountResourceService.findTechnicians().then(function (techniciansList){      
        if (techniciansList.length > 0){
          $scope.assign.techniciansList = techniciansList;
          $scope.technician.selected = $scope.assign.techniciansList[0];
          $scope.assign.techniciansListReady = true;
        }
        else{
          if ($rootScope.currentUser.role = "admin"){
            openModalWarning();
          }
          else{
            $scope.assign.techniciansListReady = true;
            $scope.assign.techniciansListEmpty = true
          }
        }
      });
    }  
    else{
      $scope.assign.techniciansList = techniciansList;
      $scope.technician.selected = $scope.assign.techniciansList[0];
      $scope.assign.techniciansListReady = true;
      $scope.assign.techniciansListEmpty = false;
    }  
  }

});

