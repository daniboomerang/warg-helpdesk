'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR"; 
var ROLE_TECH = "tech";
var ROLE_USER = "user";
var STATUS_ONGOING = "On Going";
var STATUS_CLOSED = "Closed";
var STATUS_OPEN = "Open"

var incidencesDomain = require('./incidences-domain');
var schoolsDomain = require('./schools-domain');
var usersDomain = require('./users-domain');
var Q = require('q');

/**
 *  
 *   
 */
exports.incidences = function() {

  function filterIncidencesByStatus (incidences, status){
    console.log("filterIncidencesByStatus");
    var filteredIncidences = [];
    for (var i = 0; i<= incidences.length -1; i++){
      if (incidences[i].status.currentStatus == status){
        filteredIncidences.push(incidences[i]);
      }
    }
    return filteredIncidences;
  }

  function filterIncidencesBySchool (incidences, school){
    console.log("filterIncidencesBySchool");
    function idBelongsToSchoolCode(incidenceId, schoolCode){
      return (incidenceId.split('-')[0] == schoolCode);
    }

    var filteredIncidences = [];
    for (var i = 0; i<= incidences.length -1; i++){
      if (idBelongsToSchoolCode(incidences[i].id, school.code)){
        filteredIncidences.push(incidences[i]);
      }
    }
    return filteredIncidences;
  }

  function filterUsersBySchool (users, school){
    console.log("filterUsersBySchool");
   
    var filteredUsers = [];
    for (var i = 0; i<= users.length -1; i++){
      if (users[i].school == school._id){
        filteredUsers.push(users[i]);
      }
    }
    return filteredUsers;
  }

  function generateTotalListReport (incidences, schools, users){

    console.log("generateTotalListReport");
    function generateRow(school, schoolIncidences, schoolUsers){
      return {
        institution: school.name,
        numberOfUsers: schoolUsers.length,
        numberOpenIncidences: filterIncidencesByStatus(schoolIncidences, STATUS_OPEN).length,
        numberClosedIncidences: filterIncidencesByStatus(schoolIncidences, STATUS_CLOSED).length,
        numberIncidences: schoolIncidences.length,
        incidencesPerUser: schoolIncidences.length / schoolUsers.length
      }
    }

    var totalListReport = []
    for (var i=0; i<=schools.length -1; i++){
      totalListReport.push(generateRow(schools[i],
                                       filterIncidencesBySchool(incidences, schools[i]),
                                       filterUsersBySchool(users, schools[i])));
    }
    return totalListReport;
  }

  function generateSeverityPriorityListReport (incidences, schools){
    console.log("generateSeverityPriorityListReport");
    return ["sdfsdf"];
  }

  function generateAsignationsListReport (incidences, schools, users){
    console.log("generateAsignationsListReport");
    return ["sdfsdf"];
  }

  var deferred = Q.defer();
  
  var compiledDataPromise = Q.all([ incidencesDomain.listIncidences(), schoolsDomain.listSchools(), usersDomain.listUsers()])
  compiledDataPromise.then(function(results){
    var incidencesData = results[0];
    var schoolsData = results[1];
    var usersData = results[2];

    if  (incidencesData.status == RESULT_SUCCESS &&
         schoolsData.status == RESULT_SUCCESS &&
         usersData.status == RESULT_SUCCESS){

        var totalListReport = generateTotalListReport(incidencesData.list, schoolsData.list, usersData.list);
        var severityPriorityListReport = generateSeverityPriorityListReport(incidencesData.list, schoolsData.list);
        var assignationsListReport = generateAsignationsListReport(incidencesData.list, schoolsData.list, usersData.list);

        deferred.resolve({status: RESULT_SUCCESS, report: [totalListReport, severityPriorityListReport, assignationsListReport]});
    }
    else {
      var errorMessage = "There has been an error trying to compile the data in order to generate the incidences report.";
      console.error(errorMessage);  
      deferred.resolve({status: RESULT_ERROR, error: errorMessage});
    }
  });
      
  return deferred.promise;
};


