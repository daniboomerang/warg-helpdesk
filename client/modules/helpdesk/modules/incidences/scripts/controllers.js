  'use strict';

var incidencesControllers = angular.module('incidencesControllers', [])

incidencesControllers.controller('IncidencesCtrl', function ($scope, $location, $anchorScroll, $routeParams, $state, messengerService, Incidences, IncidenceRate, IncidenceAssign, IncidenceEffort, IncidenceClose, IncidenceComment) {

  $scope.create = function(title, description, severity, priority, school) {
    var incidence = new Incidences({
      title: title,
      description: description,
      severity: severity,
      priority: priority,
      school: school
    });
    incidence.$save(function(incidence) {
      $location.path("helpesk/incidences/open/" + incidence.id);
      messengerService.popMessage('success', 'Incidence successfully created.', 'Your incidence ID is: ' + incidence.id + '.');
    },
    function (error){
      messengerService.popMessage('error', 'Incidence not created.', error.data);
    });
  };

  $scope.remove = function(incidence) {
    incidence.$remove();
    for (var i in $scope.incidences) {
      if ($scope.incidences[i] == incidence) {
        $scope.incidences.splice(i, 1);
      }
    }
  }; 

  $scope.update = function() {
    var incidence = $scope.incidence;
    incidence.$update(function (incidence) {
      $scope.incidence = incidence;
      messengerService.popMessage('success', 'Incidence successfully updated.', null);
    },
    function (error){
      messengerService.popMessage('error', 'Incidence not updated.', error.data);
    });
  };

  $scope.updateComment = function(comment) {
    var incidence = new IncidenceComment({
      _id: $scope.incidence.id,
      comment: comment
    });
    incidence.$updateComment(function (incidence) {
      $scope.incidence = incidence;
      $scope.incidence.effortHours = Math.floor(incidence.effort / 60);
      $scope.incidence.effortMinutes = incidence.effort % 60;
      messengerService.popMessage('success', 'Comment successfully posted.', null);
    },
    function (error){
      messengerService.popMessage('error', 'Comment not posted.', error.data);
    });
  };

  $scope.updateAssignee = function(assignation) {
    var incidence = new IncidenceAssign({
      _id: $scope.incidence.id,
      assigned: assignation
    });
    incidence.$updateAssignee(function (incidence) {
      messengerService.popMessage('success', 'Incidence successfully assigned', incidence.assigned + ' is in charge now.');
      $scope.incidence = incidence;
      $scope.incidence.effortHours = Math.floor(incidence.effort / 60);
      $scope.incidence.effortMinutes = incidence.effort % 60;
    },
    function (error){
      messengerService.popMessage('error', 'Assination couldn´t be done.', error.data);
    });
  };

  $scope.updateRate = function(rate) {
    var incidence = new IncidenceRate({
      _id: $scope.incidence.id,
      rate: rate
    });
    incidence.$updateRate(function (incidence) {
      $scope.incidence = incidence;
      $scope.incidence.effortHours = Math.floor(incidence.effort / 60);
      $scope.incidence.effortMinutes = incidence.effort % 60;
      messengerService.popMessage('success', 'Incidence successfully rated', 'The rate for ' + incidence.id + ' is ' + incidence.rate );
    },
    function (error){
      messengerService.popMessage('error', 'Rate couldn´t be done.', error.data);
    });  
  };

  $scope.updateEffort = function(effort) {
    var incidence = new IncidenceEffort({
      _id: $scope.incidence.id,
      effort: effort
    });
    incidence.$updateEffort(function (incidence) {
      $scope.incidence = incidence;
      $scope.incidence.effortHours = Math.floor(incidence.effort / 60);
      $scope.incidence.effortMinutes = incidence.effort % 60;
      messengerService.popMessage('success', 'Effort successfully reported', 'The total expended time for ' + incidence.id
                                   + ' is ' + $scope.incidence.effortHours + ' hours and '
                                   + $scope.incidence.effortMinutes + ' minutes.');
    },
    function (error){
      messengerService.popMessage('error', 'Time effort couldn´t be reported.', error.data);
    });
  };

  $scope.updateClose = function(reason, effort, duplicated, invalidComment) {
    var incidence = new IncidenceClose({
      _id: $scope.incidence.id,
      substatus: reason,
      effort: effort,
      duplicated: duplicated,
      invalidComment: invalidComment
    });
    incidence.$closeIncidence(function (incidence) {
      $scope.incidence = incidence;
      messengerService.popMessage('success', 'Incidence successfully closed', 'The incidence has been closed as ' + incidence.status.currentSubstatus + '.');
      $location.path("helpesk/incidences/open/list");
    },
    function (error){
      messengerService.popMessage('error', 'The incidence couldn´t be closed.', error.data);
    });
  };

  $scope.find = function() {
    Incidences.query(function (incidences) {
      $scope.incidences = incidences;
      //messengerService.popMessage('success', 'Incidences successfully retrieved', null);    
    },
    function (error){
      messengerService.popMessage('error', 'The list of incidences couldn´t be retrieved.', error.data);
    });
  };

  $scope.findOne = function() {
    if ($state.params.incidenceId == ''){
      $state.go('helpdesk.incidences.open.list');
    }
    else{
      Incidences.get({
        incidenceId: $state.params.incidenceId
      }, function (incidence) {
        $scope.incidence = incidence;
        $scope.incidence.effortHours = Math.floor(incidence.effort / 60);
        $scope.incidence.effortMinutes = incidence.effort % 60;
        $scope.incidence.previousPosts = incidence.history;
      },
       function (error){
        messengerService.popMessage('error', 'Incidence ' + $state.params.incidenceId +  ' couldn´t be retrieved.', error.data);
        $state.go('helpdesk.incidences.open.list');
      });
    }
  };

});

incidencesControllers.controller('CreateCtrl', function ($scope, $rootScope, $modal, $state, schoolResourceService, LocationService){

  init();

  $scope.changed = function(filed){
    return filed.$dirty;
  };

  $scope.createIncidence = function(form){
    var incidenceSchool;
    var incidenceTitle = form.title.$viewValue;
    var incidenceDescription = form.description.$viewValue;
    var incidenceSeverity = $scope.severity.selected.type;
    var incidencePriority = $scope.priority.selected.type;
    if (($rootScope.currentUser.role == 'user') || ($rootScope.currentUser.role == 'tech')){
      incidenceSchool = $rootScope.currentUser.school;
    }
    else{
      incidenceSchool = $scope.school.selected;
    }
    $scope.create(incidenceTitle, incidenceDescription, incidenceSeverity, incidencePriority, incidenceSchool);
  };

  $scope.descriptionLength = function (form) {
      if (form.description.$viewValue == undefined){return 0};
      return form.description.$viewValue.length;     
  };

  $scope.titleLength = function (form) {
      if (form.title.$viewValue == undefined){return 0};
      return form.title.$viewValue.length;     
  };

  $scope.refreshSchools = function(){
    schoolResourceService.findSchools().then(function (schoolsList){      
      if (schoolsList.length > 0){
        $scope.schoolsList = schoolsList;
        $scope.school.selected = $scope.schoolsList[0];
        $scope.schoolsListReady = true;
      }
      else{
        if ($rootScope.currentUser.role = "admin"){
          openModalWarning();
        }
        else{
          $scope.schoolsListReady = true;
          $scope.schoolsListEmpty = true;   
        }
      }
    });
  };

  function init(){

    // Schools
    $scope.school = {};
    $scope.allowUpdate = false;
    $scope.schoolsListReady = false;

    var schoolsList = schoolResourceService.getSchools();
    if (schoolsList == null){
      $scope.schoolsListReady = false;
      $scope.schoolsListEmpty = false
    }
    else if (schoolsList.length == 0){
      // We need to check a School has been created recently.
      // So we ensure that, calling again to the server.
      schoolResourceService.findSchools().then(function (schoolsList){      
        if (schoolsList.length > 0){
          $scope.schoolsList = schoolsList;
          $scope.school.selected = $scope.schoolsList[0];
          $scope.schoolsListReady = true;
        }
        else{
          if ($rootScope.currentUser.role = "admin"){
            openModalWarning();
          }
          else{
            $scope.schoolsListReady = true;
            $scope.schoolsListEmpty = true;   
          }
        }
      });
    }
    else{
      $scope.schoolsList = schoolsList;
      $scope.school.selected = $scope.schoolsList[0];
      $scope.schoolsListReady = true;
      $scope.schoolsListEmpty = false;
    }

    // Priority
    $scope.severity = {};
    $scope.priority = {};
    $scope.severity.selected = {type: 'Medium'};
    $scope.priority.selected = {type: 'Medium'};
    $scope.urgencyTypes = [
      { type: 'Serious'},
      { type: 'High'},
      { type: 'Medium'},
      { type: 'Low'}
    ];
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
 

incidencesControllers.controller('ListCtrl', function ($scope, $state, $document, $modal, $log) {

  $scope.goToState = function (state) {
    $state.go(state);
  }; 

  // It helps us with the fact that if we click on overview, the watcher of selectedIncidences is
  // triggered and therefore redirected to open. And we don´t want that.
  $scope.overviewing = false; 

  $scope.today = Date.now();
  $scope.yesterday = new Date();
  $scope.yesterday.setDate($scope.yesterday.getDate() - 1);
  $scope.twoDaysAgo = new Date();
  $scope.twoDaysAgo.setDate($scope.twoDaysAgo.getDate() - 2);

  $scope.selectedIncidences = [];
  $scope.$watch('selectedIncidences', function() {
    if ($scope.overviewing == false){
      if ($scope.selectedIncidences.length > 0){
        if ($scope.selectedIncidences.length > 1)
          $scope.selectedIncidences.splice( 0, 1 );
        $state.go('helpdesk.incidences.open.incidence', { incidenceId: $scope.selectedIncidences[$scope.selectedIncidences.length - 1].id });
      } 
    }
  },
  true);

  /* DEPRECATED */
  /*
  $scope.onSelectedIncidence = function(incidence) {
    var sectionOverview = angular.element(document.getElementById('overview'));
    $state.go('helpdesk.incidences.open.list.overview', { incidenceId: incidence.id });
    $document.scrollTo(sectionOverview, 0, 1000);
  };*/

  $scope.overview = function(incidence) {

    $scope.overviewing = true; 
    $scope.selectedIncidence = incidence;
    modalOverview();

    function modalOverview (incidence) {
      var overviewModalInstance = $modal.open({
        templateUrl: '/modules/helpdesk/modules/incidences/views/partials/overview-popover.html',
        controller: OverviewModalInstanceCtrl,
        size: 'sm',
        resolve: {
        incidence: function () {
          return $scope.selectedIncidence;
          }
        }
      });

      overviewModalInstance.result.then(function (incidenceId) {
        $state.go('helpdesk.incidences.open.incidence', {incidenceId: incidenceId});
      }, function () {
        $scope.overviewing = false; 
        $log.info('Overview dismissed at: ' + new Date());
      });
    };
  };

  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.
  var OverviewModalInstanceCtrl = function ($scope, $modalInstance, incidence) {

    $scope.overviewingIncidence = incidence;

    $scope.openIncidence = function () {
      $modalInstance.close(incidence.id);
    };
    $scope.backToList = function () {
      $modalInstance.dismiss('cancel');
    };
  };

});

incidencesControllers.controller('OverviewCtrl', function ($scope, $routeParams, $state, $document) {

  $scope.open = function () {
    $state.go('helpdesk.incidences.open.incidence', $state.params);
  };  

  $scope.toTheTop = function() {
    var top = angular.element(document.getElementById('incidences-list'));
    $document.scrollTo(top, 0, 1000);
  };

});

incidencesControllers.controller('IncidenceNavCtrl', function ($scope, $document, $rootScope, accountResourceService) {
  
  init();

  function init(){

    $scope.edit = {};
    $scope.edit.rate = false;
    $scope.edit.effort = false;
    $scope.edit.assign = false;
    $document.scrollTo(top, 0, 1000);

  }

  $scope.toogleRateMode = function(){
    $scope.edit.rate = !$scope.edit.rate;
  }

  $scope.toogleEffortMode = function(){
    $scope.edit.effort = !$scope.edit.effort;
  }

  $scope.toogleAssignMode = function(){
    $scope.edit.assign = !$scope.edit.assign;
  }

  $scope.toTheBottom = function() {
    var bottom = angular.element(document.getElementById('bottom'));
    $document.scrollTo(bottom, 0, 1000);
  };

});

incidencesControllers.controller('IncidenceCtrl', function ($scope, $routeParams, $state, $document, $rootScope) {

  $scope.commentsStatus = {};
  $scope.commentsStatus.expanded = false;

  $scope.toogleComments = function(){
    $scope.commentsStatus.expanded = !$scope.commentsStatus.expanded;
  };

//Is this function = CACA!!!!! ???
//Is this function = CACA!!!!! ???
//Is this function = CACA!!!!! ???
  $scope.goToState = function (state) {
    $state.goToState('helpdesk.incidences.open.incidence' + state, $state.params);
  }; 
//Is this function = CACA!!!!! ???
//Is this function = CACA!!!!! ???
//Is this function = CACA!!!!! ???

  $scope.goToIncidence = function (id) {
    $state.go('helpdesk.incidences.open.incidence', { incidenceId: id });
  };

  $scope.toTheTop = function() {
    $document.scrollTo(top, 0, 1000);
  };

  $scope.sendComment = function(comment) {
    $scope.updateComment(comment);
    $scope.form.$setPristine();
    $scope.comment = '';
  };

  $scope.changed = function(filed){
    return filed.$dirty;
  };

  $scope.commentLength = function (form) {
      if (form.comment.$viewValue == undefined){return 0};
      return form.comment.$viewValue.length;     
  };

});

incidencesControllers.controller('RateCtrl', function ($scope) {

  $scope.rating = {};
  $scope.rating.max = 5;
  $scope.rating.rate = 1;
  $scope.rating.showOkButton = false;
  
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
});


incidencesControllers.controller('EffortCtrl', function ($scope) {

  $scope.effort = {};
  $scope.effort.hours = 0;
  $scope.effort.minutes = 0;
  $scope.effort.allowToPool = false;
  $scope.effortChanged = function () {
    if ((typeof $scope.effort.hours == 'undefined') || (typeof $scope.effort.minutes == 'undefined')){
      $scope.effort.allowToPool = false;
    }
    else if ($scope.effort.minutes > 60)
      $scope.effort.minutes = 0;
    else if ($scope.effort.hours < 0)
      $scope.effort.hours = 99;
    else if ($scope.effort.minutes < 0)
      $scope.effort.minutes = 60;
    else if (($scope.effort.hours > 0) || (($scope.effort.hours == 0) && ($scope.effort.minutes > 0)))
      $scope.effort.allowToPool = true;
    else
      $scope.effort.allowToPool = false;
  };
  $scope.poolEffort = function () {
    $scope.updateEffort( $scope.effort.hours * 60 +  $scope.effort.minutes);
    $scope.effort.allowToPool = false;
    $scope.edit.effort = false;
  };
});


incidencesControllers.controller('AssignCtrl', function ($rootScope, $scope, $state, $modal, accountResourceService, LocationService) {

  init();
  
  $scope.assignTo = function(technician){
    $scope.assign.allowUpdate = true;
    $scope.assign.currentAssignation = technician;
  }

  $scope.poolAssignation = function(){     
      $scope.assign.allowUpdate = false;
      $scope.updateAssignee($scope.assign.currentAssignation);
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
  };

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

  function init(){

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

incidencesControllers.controller('CloseCtrl', function ($scope, $modal, $log) {

  $scope.closeIncidence = function () {

    modalClose();

    function modalClose (){
      var closeModalInstance = $modal.open({
        templateUrl: '/modules/helpdesk/modules/incidences/views/partials/close.html',
        controller: ModalInstanceCtrl,
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
  var ModalInstanceCtrl = function ($scope, $modalInstance, incidence) {
    
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

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

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
});

incidencesControllers.controller('IncidencesStatisticsCtrl', function($scope){
 
  $scope.chartType = 'pie';

    $scope.statisticsConfig = {
      labels: false,
      title : "HTML-enabled legend",
      legend : {
        display:true,
        htmlEnabled: true,
        position:'right'
      },
      lineLegend: 'traditional'
    }

   $scope.statisticsData = {
      series: ['<em>500</em> Keyboards', '<em>105</em> Laptops', '<em>100</em> TVs'],
      data : [{
        x : "Sales",
        y: [100, 500, 0],
        tooltip:"this is tooltip"
      },
      {
        x : "Income",
        y: [300, 100, 100]
      },
      {
        x : "Expense",
        y: [351, 50, 25]
      }]
    }   
});