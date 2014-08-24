  'use strict';

var incidencesControllers = angular.module('incidencesControllers', ['incidencesServices', 'duScroll', 'commonServices'])

incidencesControllers.controller('IncidencesCtrl', function ($scope, $location, $anchorScroll, $routeParams, $state, Incidences, IncidenceRate, IncidenceAssign, IncidenceEffort, IncidenceClose, IncidenceComment) {

  //////////
  /* CRUD */
  //////////

  $scope.create = function(title, description, severity, priority, school) {
    var incidence = new Incidences({
      title: title,
      description: description,
      severity: severity,
      priority: priority,
      school: school
    });
    incidence.$save(function(response) {
      $location.path("helpesk/incidences/open/" + response.id);
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
    incidence.$update(function() {
    },
    function (error){
      console.log("Server error trying to update the incidence " + incidence.id);
    });
  };


  $scope.updateComment = function(comment) {
    var incidence = new IncidenceComment({
      _id: $scope.incidence.id,
      comment: comment
    });
    incidence.$updateComment(function(response) {
      $scope.incidence.history = response.history;
    },
    function (error){
      console.log("Server error trying to post a comment for incidence " + incidence.id);
    });
  };

  $scope.updateAssignee = function(assignation) {
    var incidence = new IncidenceAssign({
      _id: $scope.incidence.id,
      assigned: assignation
    });
    incidence.$updateAssignee(function(response) {
      $scope.incidence.assigned = response.assigned;
    },
    function (error){
      console.log("Server error trying to assign a technician for incidence " + incidence.id);
    });
  };

  $scope.updateRate = function(rate) {
    var incidence = new IncidenceRate({
      _id: $scope.incidence.id,
      rate: rate
    });
    incidence.$updateRate(function(response) {
      $scope.incidence.rate = response.rate;
    },
    function (error){
      console.log("Server error trying to rate the incidence " + incidence.id);
    });  
  };

  $scope.updateEffort = function(effort) {
    var incidence = new IncidenceEffort({
      _id: $scope.incidence.id,
      effort: effort
    });
    incidence.$updateEffort(function(response) {
      $scope.incidence.effort = response.effort;
      $scope.incidence.effortHours = Math.floor(response.effort / 60);
      $scope.incidence.effortMinutes = response.effort % 60;
    },
    function (error){
      console.log("Server error trying to report effort for the incidence " + incidence.id);
    });
  };

  $scope.close = function(reason) {
    var incidence = new IncidenceClose({
      _id: $scope.incidence.id,
      substatus: reason
    });
    incidence.$closeIncidence(function(response) {
      $scope.incidence.status = response.status;
      $scope.incidence.substatus = response.substatus;
    },
    function (error){
      console.log("Server error trying to close the incidence " + incidence.id);
    });
  };

  $scope.find = function() {
    Incidences.query(function(incidences) {
      $scope.incidences = incidences;
    });
  };

  $scope.findOne = function() {
    if ($state.params.incidenceId == ''){
      $state.go('helpdesk.incidences.open.list');
    }
    else{
      Incidences.get({
        incidenceId: $state.params.incidenceId
      }, function(incidence) {
        $scope.incidence = incidence;
        $scope.incidence.effortHours = Math.floor(incidence.effort / 60);
        $scope.incidence.effortMinutes = incidence.effort % 60;
      },
       function (error){
        console.log("Server error trying to open the incidence " + $state.params.incidenceId);
        $state.go('helpdesk.incidences.open.list');
      });
    }
  };

});

incidencesControllers.controller('CreateCtrl', function ($scope, schoolsService, $rootScope){

  $scope.changed = function(filed){
    return filed.$dirty;
  };

  $scope.createIncidence = function(form){
    var incidenceSchool;
    var incidenceTitle = form.title.$viewValue;
    var incidenceDescription = form.description.$viewValue;
    var incidenceSeverity = $scope.severity.selected.type;
    var incidencePriority = $scope.priority.selected.type;
    if ($rootScope.currentUser.role == 'user'){incidenceSchool = $rootScope.currentUser.school}
    else{incidenceSchool = $scope.school.selected;}
    $scope.create(incidenceTitle, incidenceDescription, incidenceSeverity, incidencePriority, incidenceSchool);
  };

  // INITIALIZING DROPDOWNS DATA

  $scope.school = {};
  $scope.schoolsList = schoolsService.getSchoolsList();
  if ($scope.schoolsList.length > 0){
    $scope.school.selected = $scope.schoolsList[0];
  }
  else{
    $scope.school.selected = "Error retreiving the schools";
  }
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

  ////////////////////////////

  $scope.descriptionLength = function (form) {
      if (form.description.$viewValue == undefined){return 0};
      return form.description.$viewValue.length;     
  };

  $scope.titleLength = function (form) {
      if (form.title.$viewValue == undefined){return 0};
      return form.title.$viewValue.length;     
  };

});
 

incidencesControllers.controller('ListCtrl', function ($scope, $state, $document, $modal, $log) {

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
        templateUrl: '/modules/incidences/views/partials/overview-popover.html',
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

incidencesControllers.controller('IncidenceNavCtrl', function ($scope, $document, $rootScope) {
  
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

  $scope.toTheTop = function() {
    $document.scrollTo(top, 0, 1000);
  };

  $scope.toTheReply = function() {
    var reply = angular.element(document.getElementById('incidence-reply'));
    $document.scrollTo(reply, 0, 1000);
  };

});

incidencesControllers.controller('IncidenceCtrl', function ($scope, $routeParams, $state, $document, $rootScope) {

  init();

  $scope.goToState = function (state) {
    $state.goToState('helpdesk.incidences.open.incidence' + state, $state.params);
  }; 

  function init(){
    $document.scrollTo(top, 0, 1000);
  }

  $scope.toTheTop = function() {
    $document.scrollTo(top, 0, 1000);
  };

  $scope.toTheReply = function() {
    var reply = angular.element(document.getElementById('incidence-reply'));
    $document.scrollTo(reply, 0, 1000);
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
  $scope.effort.minutes = 0
  $scope.effort.allowToPool = false;
  $scope.effortChanged = function () {
    if ($scope.effort.minutes > 60)
      $scope.effort.minutes = 0;
    if ($scope.effort.hours < 0)
      $scope.effort.hours = 99;
    if ($scope.effort.minutes < 0)
      $scope.effort.minutes = 60;
    if (($scope.effort.hours > 0) || (($scope.effort.hours == 0) && ($scope.effort.minutes > 0)))
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


incidencesControllers.controller('AssignCtrl', function ($scope, techniciansService) {

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

  function init(){
    $scope.assign = {};
    $scope.assign.allowUpdate = false;
    $scope.assign.techniciansList = techniciansService.getTechList();
    $scope.assign.techniciansListDropdown = $scope.assign.techniciansList;
  }

});

incidencesControllers.controller('CloseCtrl', function ($scope, $modal, $log) {

  $scope.closeIncidence = function () {

    var closeModalInstance = $modal.open({
      templateUrl: '/modules/incidences/views/partials/close.html',
      controller: ModalInstanceCtrl,
      size: 'lg',
      resolve: {
        incidence: function () {
          return $scope.incidence;
        }
      }
    });

    closeModalInstance.result.then(function (reason, effort) {
      $scope.incidence.substatus = reason;
      $scope.incidence.effort = effort;
    }, function () {
      $log.info('Close incidence dismissed at: ' + new Date());
    });
  };

  // Please note that $modalInstance represents a modal window (instance) dependency.
  // It is not the same as the $modal service used above.
  var ModalInstanceCtrl = function ($scope, $modalInstance, incidence) {

    $scope.close = {};
    $scope.close.incidence = incidence;
    $scope.close.reasons = ['Solved', 'Duplicated', 'Invalid'];
    $scope.close.currentEffort = incidence.effort; // 1hour
    $scope.close.selectedReason;


    $scope.ok = function () {
      $modalInstance.close($scope.close.reason, $scope.close.updatedEffort);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  };
});

incidencesControllers.controller('CreateIncidenceFormCtrl', function($scope){
  $scope.changed = function(filed){
    return filed.$dirty;
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