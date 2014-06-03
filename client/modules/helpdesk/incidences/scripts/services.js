'use strict';

var incidencesServices = angular.module('incidencesServices', [])

incidencesServices.factory('Incidences', function ($resource) {
    return $resource('api/incidences/:incidenceId', {
      incidenceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });
