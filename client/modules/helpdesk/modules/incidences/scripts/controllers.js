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
      messengerService.popMessage('error', 'Incidence not created.', error.status + ' - ' + error.statusText);
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
      messengerService.popMessage('error', 'Incidence not updated.', error.status + ' - ' + error.statusText);
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
      messengerService.popMessage('error', 'Comment not posted.', error.status + ' - ' + error.statusText);
    });
  };

  $scope.updateAssignee = function(assignation, effort) {
    var incidence = new IncidenceAssign({
      _id: $scope.incidence.id,
      assigned: assignation,
      effort: effort
    });
    incidence.$updateAssignee(function (incidence) {
      messengerService.popMessage('success', 'Incidence successfully assigned', incidence.assigned + ' is in charge now.');
      $scope.incidence = incidence;
      $scope.incidence.effortHours = Math.floor(incidence.effort / 60);
      $scope.incidence.effortMinutes = incidence.effort % 60;
    },
    function (error){
      messengerService.popMessage('error', 'Assination couldn´t be done.', error.status + ' - ' + error.statusText);
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
      messengerService.popMessage('error', 'Rate couldn´t be done.', error.status + ' - ' + error.statusText);
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
      messengerService.popMessage('error', 'Time effort couldn´t be reported.', error.status + ' - ' + error.statusText);
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
      messengerService.popMessage('error', 'The incidence couldn´t be closed.', error.status + ' - ' + error.statusText);
    });
  };

  $scope.find = function() {
    Incidences.query(function (incidences) {
      $scope.incidences = incidences;
      //messengerService.popMessage('success', 'Incidences successfully retrieved', null);    
    },
    function (error){
      messengerService.popMessage('error', 'The list of incidences couldn´t be retrieved.', error.status + ' - ' + error.statusText);
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
        messengerService.popMessage('error', 'Incidence ' + $state.params.incidenceId +  ' couldn´t be retrieved.', error.status + ' - ' + error.statusText);
        $state.go('helpdesk.incidences.open.list');
      });
    }
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

incidencesControllers.controller('CreateIncidenceCtrl', function ($scope, $rootScope, $modal, $state, schoolResourceService, LocationService){

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

  init();

  $scope.goToState = function (state) {
    $state.go(state);
  }; 

  $scope.openIncidence = function (id) {
    $state.go('helpdesk.incidences.open.incidence', { incidenceId: id });
  };
  
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

  $scope.getDay = function(date){
    return date.getDay();
  }

  function init(){

    // It helps us with the fact that if we click on overview, the watcher of selectedIncidences is
    // triggered and therefore redirected to open. And we don´t want that.
    $scope.overviewing = false; 

    $scope.today = Date.now();
    $scope.yesterday = new Date();
    $scope.yesterday.setDate($scope.yesterday.getDate() - 1);
    $scope.twoDaysAgo = new Date();
    $scope.twoDaysAgo.setDate($scope.twoDaysAgo.getDate() - 2);

    $scope.selectedIncidences = [];
  }

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


