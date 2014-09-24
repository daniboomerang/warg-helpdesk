var reportsServices = angular.module('reportsServices', [])

reportsServices.factory('reportsService', function ($http, $q, $resource){

  var resourceService = $resource('api/reports/incidences', {
    }, {
      update: {
        method: 'PUT'
      }
    });

  return {
    generateIncidencesReport : function() {
      var deferred = $q.defer(); 
      	resourceService.query(
          function (report) {
			      deferred.resolve(report);
    	    },
          function (error){
	    	    deferred.reject(error);
	         }
        );
	    return deferred.promise;
    }
  };
});