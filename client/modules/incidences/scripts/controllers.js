'use strict';

var incidencesControllers = angular.module('incidencesControllers', ['incidencesServices'])

incidencesControllers.controller('IncidencesCtrl', function ($scope, Incidences, $location, $routeParams, userRights, incidencesConfigService) {

  /* Setting up the desk for Component Incidences */
  //////////////////////////////////////////////////
  incidencesConfigService.init(userRights);
  //////////////////////////////////////////////////


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
      incidenceId: $routeParams.incidenceId
    }, function(incidence) {
      $scope.incidence = incidence;
    });
  };

});

