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

incidencesServices.factory('incidenceAuth', function ($rootScope) {

/* @@@ Hardcoded status => This must come from the server and be incidence.status */
var status = 'open';
/* @@@ Hardcoded assignedTo => This must come from the server and be incidence.assignedTo */
var assignedTo = '';


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
