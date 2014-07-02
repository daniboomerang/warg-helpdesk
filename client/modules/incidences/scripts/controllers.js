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
    });
  };

});

incidencesControllers.controller('ListCtrl', function ($scope, $stateParams, $state) {

  init();


  $scope.onClickRow = function(row) {
    $state.go('helpdesk.incidences.list.overview', { incidenceId: row._id });
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

  $scope.view = function () {
    $state.go('helpdesk.incidences.view', $state.params);
  };  

});

