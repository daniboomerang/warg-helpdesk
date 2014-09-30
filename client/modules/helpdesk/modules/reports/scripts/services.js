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

        ////////////
        // TOTALS //
        ////////////

        for (var j=0; ((j <= cachedGeneralReport[0].list.length -1) && (!institutionFound)); j++){
          if (cachedGeneralReport[0].list[j].institutionCode == schoolCode){
            var schoolDataObject = cachedGeneralReport[0].list[j];
            var totals = {totalAccounts: schoolDataObject.totalAccounts,
                          totalTechnicians: schoolDataObject.techniciansAccounts,
                          totalIncidences: schoolDataObject.numberIncidences,
                          totalOpen: schoolDataObject.numberOpenIncidences,
                          totalOnGoing: schoolDataObject.numberOnGoingIncidences,
                          totalClosed: schoolDataObject.numberClosedIncidences};
            specificSchoolReport[0] = {totals: totals, list: [schoolDataObject]};
            institutionFound = true;
          }
        }
        if (institutionFound == false){
          specificSchoolReport[i] = {totals: {}, list: []};
        }
        else {institutionFound = false;}

        ///////////////
        // SEV & PRI //
        ///////////////

        for (var j=0; ((j <= cachedGeneralReport[1].list.length -1) && (!institutionFound)); j++){
          if (cachedGeneralReport[1].list[j].institutionCode == schoolCode){
            var schoolDataObject = cachedGeneralReport[1].list[j];
            var totals = {totalSevSerious: schoolDataObject.numberSevSerious,
              totalSevHigh: schoolDataObject.numberSevHigh,
              totalSevMedium: schoolDataObject.numberSevMedium,
              totalSevLow: schoolDataObject.numberSevLow,
              totalPriSerious: schoolDataObject.numberPriSerious,
              totalPriHigh: schoolDataObject.numberPriHigh,
              totalPriMedium: schoolDataObject.numberPriMedium,
              totalPriLow: schoolDataObject.numberPriLow};
            specificSchoolReport[1] = {totals: totals, list: [schoolDataObject]};
            institutionFound = true;
          }
        }
        if (institutionFound == false){
          specificSchoolReport[i] = {totals: {}, list: []};
        }
        else {institutionFound = false;}

        ////////////
        // EFFORT //
        ////////////

        var list = [];
        var totalEffort = 0;
        var averageResolutionTime = 0;
        for (var j=0; j <= cachedGeneralReport[2].list.length -1; j++){
          if (cachedGeneralReport[2].list[j].institutionCode == schoolCode){
            var schoolDataObject = cachedGeneralReport[2].list[j];
            list.push(schoolDataObject);
            institutionFound = true;
            totalEffort += schoolDataObject.totalTimeReportedOn;
            averageResolutionTime += schoolDataObject.averageResolutionTime;
          }
        }
        institutionFound = false;
        specificSchoolReport[2] = {totals: {totalEffort: totalEffort, averageResolutionTime: averageResolutionTime}, list: list};

        //////////////////
        // ASSIGNATIONS //
        //////////////////

        list = [];
        var totalAssignations = 0;
        for (var j=0; j <= cachedGeneralReport[3].list.length -1; j++){
          if (cachedGeneralReport[3].list[j].institutionCode == schoolCode){
            var schoolDataObject = cachedGeneralReport[3].list[j];
            list.push(schoolDataObject);
            institutionFound = true;
            totalAssignations += schoolDataObject.numberAssignedIncidences;
          }
        }
        institutionFound = false;
        specificSchoolReport[3] = {totals: {totalAssignations: totalAssignations}, list: list};
        
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