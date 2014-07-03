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


/* @@@ Hardcoded history => This must come from the server */

      $scope.incidence.history = [
    {
      postMetadata: [
        {
          date: "updatedDate",
          by: "tech1"
        }
      ],
      postContent: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui."
    },
    {
      postMetadata: [
        {
          date: "updatedDate",
          by: "user1"
        }
      ],
      postContent: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui."
    },
    {
      postMetadata: [
        {
          date: "updatedDate",
          by: "tech1"
        }
      ],
      postContent: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui."
    },
    {
      postMetadata: [
        {
          date: "updatedDate",
          by: "tech1"
        }
      ],
      postContent: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui."
    },
    {
      postMetadata: [
        {
          date: "updatedDate",
          by: "user1"
        }
      ],
      postContent: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui."
    },
    {
      postMetadata: [
        {
          date: "updatedDate",
          by: "tech1"
        }
      ],
      postContent: "Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui."
    }
  ];
    });
  };

});

incidencesControllers.controller('ListCtrl', function ($scope, $stateParams, $state) {

  init();


  $scope.onClickRow = function(row) {
    $state.go('helpdesk.incidences.open.list.overview', { incidenceId: row._id });
  };



  function init(){

    $scope.filterOptions = { filterText: '', useExternalFilter: false };

    $scope.gridOptions = {
      data: 'incidences',
      enableRowSelection: true,
      multiSelect: false, 
      columnDefs: 'colDefs',
      //rowTemplate: '<div ng-click="onClickRow(row.entity)" ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>',
      rowTemplate: '<div ng-click="onClickRow(row.entity)" style="height: 100%" ng-class="{green: row.getProperty(\'severity\') == \'\'}"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
                             '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
                             '<div ng-cell></div>' +
                       '</div></div>',
      cellTemplate: '<div style="height: 20px"></div>',
      filterOptions: $scope.filterOptions
    };

    $scope.colDefs = [
      {field  : "severity", displayName: 'Severity'},
      {field  : "priority", displayName: 'Priority'},
      {field  : "title", displayName: 'Title'},
      {field  : "creator.username", displayName: 'Owner'},
      {field  : "updated", displayName: 'Updated'},
      {field  : "created", displayName: 'Created'},
      {field  : "status", displayName: 'Status'},
      {field  : "assigned", displayName: 'Assigned'},
    ];

    $scope.showFilterBar = false;
  }

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
  }

});


incidencesControllers.controller('RateCtrl', function ($scope, $routeParams, $state) {

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

});

incidencesControllers.controller('EffortCtrl', function ($scope, $routeParams, $state) {

$scope.max = 200;

  $scope.random = function() {
    var value = Math.floor((Math.random() * 100) + 1);
    var type;

    if (value < 25) {
      type = 'success';
    } else if (value < 50) {
      type = 'info';
    } else if (value < 75) {
      type = 'warning';
    } else {
      type = 'danger';
    }

    $scope.showWarning = (type === 'danger' || type === 'warning');

    $scope.dynamic = value;
    $scope.type = type;
  };
  $scope.random();

  $scope.randomStacked = function() {
    $scope.stacked = [];
    var types = ['success', 'info', 'warning', 'danger'];

    for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
        var index = Math.floor((Math.random() * 4));
        $scope.stacked.push({
          value: Math.floor((Math.random() * 30) + 1),
          type: types[index]
        });
    }
  };
  $scope.randomStacked();

});


incidencesControllers.controller('AssignCtrl', function ($scope, $routeParams, $state) {

  $scope.technicians = ['tech1','tech1','tech1','tech1','tech1','tech1','tech1','tech1'];

});


var ModalCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

