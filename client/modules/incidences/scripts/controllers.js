'use strict';

var incidencesControllers = angular.module('incidencesControllers', ['incidencesServices'])

incidencesControllers.controller('IncidencesCtrl', function ($scope, Incidences, $location, $routeParams, $state) {

  //////////
  /* CRUD */
  //////////

  $scope.create = function() {
    var incidence = new Incidences({
      title: this.title,
      content: this.content
    });
    incidence.$save(function(response) {
      $location.path("incidences/" + response._id);
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
      $location.path('incidences/' + incidence._id);
    });
  };

  $scope.updateProperty = function(property) {
    var incidence = $scope.incidence;
    incidence.$update(function() {
      $location.path('incidences/' + incidence._id + '/' + property);
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


      $scope.incidence.assigned = null;
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
      $scope.incidence.rate = -1; 
      $scope.incidence.effort = -1;
    });
  };

});

incidencesControllers.controller('ListCtrl', function ($scope, $stateParams, $state, $rootScope) {

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
    $state.go('helpdesk.incidences.open.list.overview', { incidenceId: incidence._id });
  };

});

incidencesControllers.controller('OverviewCtrl', function ($scope, $routeParams, $state) {

  $scope.open = function () {
    $state.go('helpdesk.incidences.open.incidence', $state.params);
  };  

});

incidencesControllers.controller('IncidenceCtrl', function ($scope, $routeParams, $state, incidenceAuth) {

  initAuth()

  $scope.goToState = function (state) {
    $state.goToState('helpdesk.incidences.open.incidence' + state, $state.params);
  }; 

  function initAuth(){
    $scope.incidenceAuth = {};

    $scope.incidenceAuth.rate = incidenceAuth.isAllowedToReportRate($scope.incidence);
    $scope.incidenceAuth.effort = incidenceAuth.isAllowedToReportEffort($scope.incidence);
    $scope.incidenceAuth.assign = incidenceAuth.isAllowedToAssign($scope.incidence);
    $scope.incidenceAuth.close = incidenceAuth.isAllowedToClose($scope.incidence);
    
    $scope.edit = {};

    $scope.edit.rate = false;
    $scope.edit.effort = false;
    $scope.edit.assign = false;
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

});

incidencesControllers.controller('RateCtrl', function ($scope) {

  $scope.rating = {};
  $scope.rating.max = 5;
  $scope.rating.rate = 1;
  $scope.$watch('incidence', function() {
    $scope.rating.percent = (100 * $scope.incidence.rate) / $scope.rating.max;
  },
  true);
  
  $scope.hoveringOver = function(value,object) {
    $scope.rating.overStar = value;
    $scope.rating.percent =  (100 * value) / $scope.rating.max;
  };

  $scope.saveRating = function() {
    $scope.incidence.rate = $scope.rating.rate;
    $scope.edit.rate = false;
  };
});


incidencesControllers.controller('EffortCtrl', function ($scope, $routeParams, $state) {
  $scope.mytime = new Date();
  $scope.mytime.setHours( 0 );
  $scope.mytime.setMinutes( 0 );
  $scope.hstep = 1;
  $scope.mstep = 15;
  $scope.changed = function () {
    console.log('Time changed to: ' + $scope.mytime);
  };

});


incidencesControllers.controller('AssignCtrl', function ($scope, $routeParams, $state) {
  $scope.technicians = ["tech1", "tech2", "tech3", "tech4", "tech5"];
});

incidencesControllers.controller('ModalCtrl', function ($scope, $modal, $log) {

  $scope.openRate = function () {

    var modalInstance = $modal.open({
      templateUrl: '/modules/incidences/views/partials/rate.html',
      controller: ModalInstanceCtrl,
      size: 'lg',
      resolve: {
        incidence: function () {
          return $scope.incidence;
        }
      }
    });

    modalInstance.result.then(function (rate) {
      $scope.rate = rate;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
});

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

incidencesControllers.controller('ModalInstanceCtrl', function ($scope, $modalInstance, incidence) {

  $scope.rate = 7;
  $scope.max = 10;
  $scope.isReadonly = false;

  $scope.hoveringOver = function(value) {
    $scope.overStar = value;
    $scope.percent = 100 * (value / $scope.max);
  };

  $scope.ratingStates = [
    {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
    {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
    {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
    {stateOn: 'glyphicon-heart'},
    {stateOff: 'glyphicon-off'}
  ];

  $scope.ok = function () {
    $modalInstance.close($scope.rate);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});



// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var CreateCtrl = function ($scope, $modalInstance, items) {

};



