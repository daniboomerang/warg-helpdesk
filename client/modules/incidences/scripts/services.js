'use strict';

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
    return $resource('api/incidences/:incidenceId/postComment', {
      incidenceId: '@_id',

    }, {
      postComment: {
        method: 'PUT'
      }
    });
  });


incidencesServices.factory('IncidenceAssign', function ($resource) {
    return $resource('api/incidences/:incidenceId/assign', {
      incidenceId: '@_id',

    }, {
      updateAssign: {
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

incidencesServices.factory('incidenceAuth', function ($rootScope) {

  return {

  	isAllowedToReportRate: function(incidence){
  		return true;/*((status == 'close') &&
  			    (assignedTo != $rootScope.currentUser) &&
  			    (assignedTo != null) && (assignedTo != '') &&
  			    (incidence.creator == $rootScope.currentUser)); */
  	},
  	isAllowedToReportEffort: function(incidence){
  		return true;/*(assignedTo == $rootScope.currentUser); */
  	},
  	isAllowedToAssign: function(incidence){
  		return true;/*((status == 'open') &&
  				($rootScope.currentUser.role != 'user')); */
  	},
  	isAllowedToClose: function(incidence){
  		return true;/*((status == 'assigned') &&
  				(assigned == $rootScope.currentUser)); */
  	}
  }
});

incidencesServices.factory('techniciansService', function ($http, $q){
  return {
    getList : function() {
      var deferred = $q.defer();
      $http.get('/api/techs').success(function(list) {
        deferred.resolve(list);
      }).error(function() {
        deferred.reject();
      });
      return deferred.promise;
    }
  };
});
