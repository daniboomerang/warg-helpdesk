var incidencesServices = angular.module('incidencesServices', ['ngResource'])

incidencesServices.factory('Incidences', function ($resource) {
    return $resource('api/incidences/:incidenceId', {
      incidenceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });

incidencesServices.factory('IncidenceComment', function ($resource) {
    return $resource('api/incidences/:incidenceId/comment', {
      incidenceId: '@_id',

    }, {
      updateComment: {
        method: 'PUT'
      }
    });
  });


incidencesServices.factory('IncidenceAssign', function ($resource) {
    return $resource('api/incidences/:incidenceId/assignee', {
      incidenceId: '@_id',

    }, {
      updateAssignee: {
        method: 'PUT'
      }
    });
  });

incidencesServices.factory('IncidenceRate', function ($resource) {
    return $resource('api/incidences/:incidenceId/rate', {
      incidenceId: '@_id',

    }, {
      updateRate: {
        method: 'PUT'
      }
    });
  });

incidencesServices.factory('IncidenceEffort', function ($resource) {
    return $resource('api/incidences/:incidenceId/effort', {
      incidenceId: '@_id',

    }, {
      updateEffort: {
        method: 'PUT'
      }
    });
  });

incidencesServices.factory('IncidenceClose', function ($resource) {
    return $resource('api/incidences/:incidenceId/close', {
      incidenceId: '@_id',

    }, {
      closeIncidence: {
        method: 'PUT'
      }
    });
  });
