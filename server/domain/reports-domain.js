'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR"; 
var ROLE_TECH = "tech";
var ROLE_USER = "user";
var ROLE_ADMIN = "admin";
var STATUS_ONGOING = "On Going";
var STATUS_CLOSED = "Closed";
var STATUS_OPEN = "Open";
var SERIOUS = "Serious";
var HIGH = "High";
var MEDIUM = "Medium";
var LOW = "Low";

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

  function filterIncidencesBySeverity (incidences, severity){
    console.log("filterIncidencesBySeverity");
    var filteredIncidences = [];
    for (var i = 0; i<= incidences.length -1; i++){
      if (incidences[i].severity == severity){
        filteredIncidences.push(incidences[i]);
      }
    }
    return filteredIncidences;
  }

  function filterIncidencesByPriority (incidences, priority){
    console.log("filterIncidencesByPriority");
    var filteredIncidences = [];
    for (var i = 0; i<= incidences.length -1; i++){
      if (incidences[i].priority == priority){
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
      if (users[i].role == ROLE_ADMIN) {continue;}
      if (users[i].school._id.toString() == school._id.toString()){
        filteredUsers.push(users[i]);
      }
    }
    return filteredUsers;
  }

  function filterUsersByRole (users, role){
    console.log("filterUsersByRole");
   
    var filteredUsers = [];
    for (var i = 0; i<= users.length -1; i++){
      if (users[i].role == role){
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
        institutionCode: school.code,
        totalAccounts: schoolUsers.length,
        usersAccounts: filterUsersByRole(schoolUsers, ROLE_USER).length,
        techniciansAccounts: filterUsersByRole(schoolUsers, ROLE_TECH).length,
        numberOpenIncidences: filterIncidencesByStatus(schoolIncidences, STATUS_OPEN).length,
        numberOnGoingIncidences: filterIncidencesByStatus(schoolIncidences, STATUS_ONGOING).length,
        numberClosedIncidences: filterIncidencesByStatus(schoolIncidences, STATUS_CLOSED).length,
        numberIncidences: schoolIncidences.length,
        incidencesPerUser: schoolIncidences.length / schoolUsers.length
      }
    }

    var totalsListReport = []
    for (var i=0; i<=schools.length -1; i++){
      totalsListReport.push(generateRow(schools[i],
                                       filterIncidencesBySchool(incidences, schools[i]),
                                       filterUsersBySchool(users, schools[i])));
    }
    return totalsListReport;
  }

  function generateSeverityPriorityListReport (incidences, schools){
    console.log("generateSeverityPriorityListReport");
    function generateRow(school, schoolIncidences){
      return {
        institution: school.name,
        institutionCode: school.code,
        numberSevSerious: filterIncidencesBySeverity(schoolIncidences, SERIOUS).length,
        numberSevHigh: filterIncidencesBySeverity(schoolIncidences, HIGH).length,
        numberSevMedium: filterIncidencesBySeverity(schoolIncidences, MEDIUM).length,
        numberSevLow: filterIncidencesBySeverity(schoolIncidences, LOW).length,
        numberPriSerious: filterIncidencesByPriority(schoolIncidences, SERIOUS).length,
        numberPriHigh: filterIncidencesByPriority(schoolIncidences, HIGH).length,
        numberPriMedium: filterIncidencesByPriority(schoolIncidences, MEDIUM).length,
        numberPriLow: filterIncidencesByPriority(schoolIncidences, LOW).length,
        numberIncidences: schoolIncidences.length
      }
    }

    var severityPriorityListReport = []
    for (var i=0; i<=schools.length -1; i++){
      severityPriorityListReport.push(generateRow(schools[i],
                                       filterIncidencesBySchool(incidences, schools[i])));
    }
    return severityPriorityListReport;
  }

  function generateAsignationsListReport (incidences, schools, users){
    console.log("generateAsignationsListReport");
    var totalsListReport = ["sadasd"];
    return totalsListReport;
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

        var totalsReport = {totalsListReport: generateTotalListReport(incidencesData.list, schoolsData.list, usersData.list)};
        var severityPriorityReport = {severityPriorityListReport: generateSeverityPriorityListReport(incidencesData.list, schoolsData.list)};
        var assignationsReport = {assignationsListReport: generateAsignationsListReport(incidencesData.list, schoolsData.list, usersData.list)};

        deferred.resolve({status: RESULT_SUCCESS, report: [totalsReport, severityPriorityReport, assignationsReport]});
    }
    else {
      var errorMessage = "There has been an error trying to compile the data in order to generate the incidences report.";
      console.error(errorMessage);  
      deferred.resolve({status: RESULT_ERROR, error: errorMessage});
    }
  });
      
  return deferred.promise;
};


