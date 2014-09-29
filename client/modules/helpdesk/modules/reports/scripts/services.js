var reportsServices = angular.module('reportsServices', [])

reportsServices.factory('reportsService', function ($http, $q, $resource){

  var resourceService = $resource('api/reports/incidences', {
    }, {
      update: {
        method: 'PUT'
      }
    });

  var cachedGeneralReport = [];

  return {
    fusionAssignAndEffort: function (listOfAssignations, listOfEffort) {
      for (var i = 0; i <= listOfAssignations.length - 1; i++){
          listOfAssignations[i].workedOn = listOfEffort[i].workedOn;
          listOfAssignations[i].totalTimeReportedOn = listOfEffort[i].totalTimeReportedOn;
          listOfAssignations[i].solved = listOfEffort[i].solved;
          listOfAssignations[i].averageResolutionTime = listOfEffort[i].averageResolutionTime;
      } 
      return listOfAssignations;
    },
    generateIncidencesReport : function() {
      var deferred = $q.defer(); 
      	resourceService.query(
          function (report) {
            cachedGeneralReport = report;
			      deferred.resolve(report);
    	    },
          function (error){
	    	    deferred.reject(error);
	         }
        );
	    return deferred.promise;
    },
    generateIncidencesSchoolReport : function(schoolCode) {

      var deferred = $q.defer(); 
    
      var filterGeneralReportBySchool = function (cachedGeneralReport){
        var specificSchoolReport = [];
        var institutionFound = false;
        for (var i=0; i <= 3; i++){
          for (var j=0; ((j <= cachedGeneralReport[i].list.length -1) && (!institutionFound)); j++){
            if (cachedGeneralReport[i].list[j].institutionCode == schoolCode){
              var schoolDataObject = cachedGeneralReport[i].list[j];
              var totals = {};
              specificSchoolReport[i] = {totals: totals, list: [schoolDataObject]};
              institutionFound = true;
            }
          }
          if (institutionFound == false){
            specificSchoolReport[i] = {totals: {}, list: []};
          }
          else {institutionFound = false;}
        }
        return specificSchoolReport;
      };

      if (cachedGeneralReport.length > 0){
        deferred.resolve(filterGeneralReportBySchool(cachedGeneralReport));
      }
      else{
        resourceService.query(
          function (report) {
            cachedGeneralReport = report;
            deferred.resolve(filterGeneralReportBySchool(cachedGeneralReport));
          },
          function (error){
            deferred.reject(error);
          }
        );
      }

      return deferred.promise;

    }
  };
});