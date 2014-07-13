  'use strict';

var incidencesControllers = angular.module('incidencesControllers', ['incidencesServices', 'duScroll'])

incidencesControllers.controller('IncidencesCtrl', function ($scope, $location, $anchorScroll, $routeParams, $state, Incidences, IncidenceRate, IncidenceAssign, IncidenceEffort, IncidenceClose) {

  //////////
  /* CRUD */
  //////////

  $scope.create = function() {
    var incidence = new Incidences({
      title: this.title,
      content: this.content
    });
    incidence.$save(function(response) {
      $location.path("helpesk/incidences/open/" + response._id);
    });

    this.title = "";
    this.content = "";
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
    });
  };

  $scope.updateAssigned = function(assignation) {
    var incidence = new IncidenceAssign({
      _id: $scope.incidence._id,
      assigned: assignation
    });
    incidence.$updateAssign(function(response) {
      $scope.incidence.assigned = response.assigned;
    },
    function (error){
      console.log("Server error trying to assign a technician for incidence " + incidence._id);
    });
  };

  $scope.updateRate = function(rate) {
    var incidence = new IncidenceRate({
      _id: $scope.incidence._id,
      rate: rate
    });
    incidence.$updateRate(function(response) {
      $scope.incidence.rate = response.rate;
    },
    function (error){
      console.log("Server error trying to rate the incidence " + incidence._id);
    });  
  };

  $scope.updateEffort = function(effort) {
    var incidence = new IncidenceEffort({
      _id: $scope.incidence._id,
      effort: effort
    });
    incidence.$updateEffort(function(response) {
      $scope.incidence.effortHours = Math.floor(response.effort / 60);
      $scope.incidence.effortMinutes = response.effort % 60;
    },
    function (error){
      console.log("Server error trying to report effort for the incidence " + incidence._id);
    });
  };

  $scope.close = function(reason) {
    var incidence = new IncidenceClose({
      _id: $scope.incidence._id,
      substatus: reason
    });
    incidence.$closeIncidence(function(response) {
      $scope.incidence.status = response.status;
      $scope.incidence.substatus = response.substatus;
    },
    function (error){
      console.log("Server error trying to close the incidence " + incidence._id);
    });
  };


  $scope.find = function() {
    Incidences.query(function(incidences) {
      $scope.incidences = incidences;
    });
  };

  $scope.findOne = function() {
    Incidences.get({
      incidenceId: $state.params.incidenceId
    }, function(incidence) {
      $scope.incidence = incidence;
      $scope.incidence.effortHours = Math.floor(incidence.effort / 60);
      $scope.incidence.effortMinutes = incidence.effort % 60;
      /* @@@ Hardcoded history => This must come from the server */
      var date = Date.now();
      $scope.incidence.history = [
        {
          post: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.",
          date: date,
          author: "tech1"
        },
         {
          post: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.",
          date: date,
          author: "tech1"
        },
         {
          post: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.",
          date: date,
          author: "tech1"
        },
         {
          post: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.",
          date: date,
          author: "tech1"
        },
        {
          post: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.",
          date: date,
          author: "tech1"
        }
      ];
    },
     function (error){
      console.log("Server error trying to open the incidence " + $state.params.incidenceId);
      $state.go('helpdesk.incidences.open.list');
    });
  };

});


incidencesControllers.controller('ListCtrl', function ($scope, $state, $document) {

  $scope.selectedIncidences = [];
  $scope.$watch('selectedIncidences', function() {
    if ($scope.selectedIncidences.length > 0){
      if ($scope.selectedIncidences.length > 1)
        $scope.selectedIncidences.splice( 0, 1 );
      $scope.onSelectedIncidence($scope.selectedIncidences[$scope.selectedIncidences.length - 1]);
    } 
  },
  true);

  $scope.onSelectedIncidence = function(incidence) {
    var sectionOverview = angular.element(document.getElementById('overview'));
    $state.go('helpdesk.incidences.open.list.overview', { incidenceId: incidence._id });
    $document.scrollTo(sectionOverview, 0, 1000);
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

incidencesControllers.controller('IncidenceCtrl', function ($scope, $routeParams, $state, incidenceAuth, $document) {

  init()

  $scope.goToState = function (state) {
    $state.goToState('helpdesk.incidences.open.incidence' + state, $state.params);
  }; 

  function init(){
    $scope.incidenceAuth = {};

    $scope.incidenceAuth.rate = incidenceAuth.isAllowedToReportRate($scope.incidence);
    $scope.incidenceAuth.effort = incidenceAuth.isAllowedToReportEffort($scope.incidence);
    $scope.incidenceAuth.assign = incidenceAuth.isAllowedToAssign($scope.incidence);
    $scope.incidenceAuth.close = incidenceAuth.isAllowedToClose($scope.incidence);
    
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


incidencesControllers.controller('AssignCtrl', function ($scope) {
  
  $scope.technicians = ["tech1", "tech2", "tech3", "tech4", "tech5"];

  init();
  
  $scope.assignTo = function(technician){
    $scope.assign.allowUpdate = true;
    $scope.assign.currentAssignation = technician;
    $scope.assign.techniciansList = filterTechnicianFromList(technician, $scope.technicians);
  }

  $scope.poolAssignation = function(){     
      $scope.assign.allowUpdate = false;
      $scope.updateAssigned($scope.assign.currentAssignation);
      $scope.edit.assign = false;
  }

  function filterTechnicianFromList(technician, list){

    /* Lets filter and delete from the possble selections,
       the one already assigned to the incidence (if so) */
    function remove(array, elem, all) {
      for (var i=array.length-1; i>=0; i--) {
        if (array[i] === elem) {
            array.splice(i, 1);
            if(!all)
              break;
        }
      }
      return array;
    };

    var techniciansCopy = list.slice();
    if (technician != null)
      remove(techniciansCopy, technician);
    return techniciansCopy;
  }

  function init(){

    $scope.assign = {};
    $scope.assign.techniciansList = $scope.technicians;
    $scope.assign.allowUpdate = false;
  }

});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var CreateCtrl = function ($scope, $modalInstance, items) {

};

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




