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
    var filteredIncidences = [];
    for (var i = 0; i<= incidences.length -1; i++){
      if (incidences[i].status.currentStatus == status){
        filteredIncidences.push(incidences[i]);
      }
    }
    return filteredIncidences;
  }

  function filterIncidencesBySeverity (incidences, severity){
    var filteredIncidences = [];
    for (var i = 0; i<= incidences.length -1; i++){
      if (incidences[i].severity == severity){
        filteredIncidences.push(incidences[i]);
      }
    }
    return filteredIncidences;
  }

  function filterIncidencesByPriority (incidences, priority){
    var filteredIncidences = [];
    for (var i = 0; i<= incidences.length -1; i++){
      if (incidences[i].priority == priority){
        filteredIncidences.push(incidences[i]);
      }
    }
    return filteredIncidences;
  }

  function filterIncidencesBySchool (incidences, school){
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
    var filteredUsers = [];
    for (var i = 0; i<= users.length -1; i++){
      if (users[i].role == role){
        filteredUsers.push(users[i]);
      }
    }
    return filteredUsers;
  }


  function filterIncidencesByTechnician (incidences, technician){
    var filteredIncidences = [];
    for (var i = 0; i<= incidences.length -1; i++){
      if (incidences[i].assigned){
        if (incidences[i].assigned == technician.username){
          filteredIncidences.push(incidences[i]);
        }
      }
     
    }
    return filteredIncidences;
  }

  function getTotalIncidencesEffort (incidences){
    var totalEffort = 0;
    for (var i = 0; i<= incidences.length -1; i++){
      totalEffort = totalEffort + incidences[i].effort;
    }
    return totalEffort;
  }

  function generateTotalListReport (incidences, schools, users){

    var totalsTotalsReport = {};

    totalsTotalsReport.totalInstitutions = 0;
    totalsTotalsReport.totalAccounts = 0;
    totalsTotalsReport.totalTechnicians = 0;
    totalsTotalsReport.totalIncidences = 0;
    totalsTotalsReport.totalOpen = 0;
    totalsTotalsReport.totalOnGoing = 0;
    totalsTotalsReport.totalClosed = 0;

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

    var totalsListReport = [];
    for (var i=0; i<=schools.length -1; i++){
      var currentRow = generateRow(schools[i],
                                       filterIncidencesBySchool(incidences, schools[i]),
                                       filterUsersBySchool(users, schools[i]))
      totalsListReport.push(currentRow);  
      totalsTotalsReport.totalInstitutions += 1;
      totalsTotalsReport.totalAccounts = currentRow.totalAccounts;
      totalsTotalsReport.totalTechnicians = currentRow.totalTechnicians;
      totalsTotalsReport.totalIncidences = currentRow.numberIncidences;
      totalsTotalsReport.totalOpen = currentRow.numberOpenIncidences;
      totalsTotalsReport.totalOnGoing = currentRow.numberOnGoingIncidences;
      totalsTotalsReport.totalClosed = currentRow.numberClosedIncidences;

    }
    return {totals: totalsTotalsReport, list: totalsListReport};
  }

  function generateSeverityPriorityListReport (incidences, schools){

    var totalsSevPriReport = {};

    totalsSevPriReport.totalInstitutions = 0;
    totalsSevPriReport.totalSevSerious = 0; 
    totalsSevPriReport.totalSevHigh = 0;
    totalsSevPriReport.totalSevMedium = 0;
    totalsSevPriReport.totalSevLow = 0;
    totalsSevPriReport.totalPriSerious = 0; 
    totalsSevPriReport.totalPriHigh = 0;
    totalsSevPriReport.totalPriMedium = 0;
    totalsSevPriReport.totalPriLow = 0;

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
      var currentRow = generateRow(schools[i], filterIncidencesBySchool(incidences, schools[i]));
      severityPriorityListReport.push(currentRow);

      totalsSevPriReport.totalInstitutions += 1;
      totalsSevPriReport.totalSevSerious += currentRow.numberSevSerious;
      totalsSevPriReport.totalSevHigh += currentRow.numberSevHigh;
      totalsSevPriReport.totalSevMedium += currentRow.numberSevMedium;
      totalsSevPriReport.totalSevLow += currentRow.totalSevLow;
      totalsSevPriReport.totalPriSerious += currentRow.numberPriSerious;
      totalsSevPriReport.totalPriHigh += currentRow.numberPriHigh;
      totalsSevPriReport.totalPriMedium += currentRow.numberPriMedium;
      totalsSevPriReport.totalPriLow += currentRow.numberPriLow;

    }
    return {totals: totalsSevPriReport, list: severityPriorityListReport};
  }

  function generateEffortsReport (incidences, schools, users){

    var effortTotalsReport = {};

    effortTotalsReport.totalInstitutions = 0;
    effortTotalsReport.totalEffort = 0;

    function generateRow(school, schoolTechnician, schoolTechnicianEffort){

      effortTotalsReport.totalEffort += schoolTechnicianEffort;

      return {
        // This is a row SCHOOL/TECHNICIAN
        institution: school.name,
        institutionCode: school.code,
        technician: schoolTechnician.username,
        totalEffort: schoolTechnicianEffort
      }
    }

    var effortsListReport = []
    for (var i=0; i<=schools.length -1; i++){
      
      effortTotalsReport.totalInstitutions =+ 1 ;
      
      var currentSchool = schools[i];
      var currentSchoolTechnicians = filterUsersByRole(filterUsersBySchool(users, currentSchool), ROLE_TECH);
      for (var j=0; j <= currentSchoolTechnicians.length -1; j++){
        var currentSchoolTechnician = currentSchoolTechnicians[j];
        var currentRow = generateRow(currentSchool, currentSchoolTechnician, 100);
        effortsListReport.push(currentRow);
        effortTotalsReport.totalEffort += currentRow.totalEffort;
      } 
    }
    return {totals: effortTotalsReport, list: effortsListReport};
  }

  function generateAssignationsListReport (incidences, schools, users){

    var assignationsTotalsReport = {};

    assignationsTotalsReport.totalInstitutions = 0;
    assignationsTotalsReport.totalAssignations= 0;

    function generateRow(school, technicianIncidences, schoolTechnician){
      return {
        // This is a row SCHOOL/TECHNICIAN
        institution: school.name,
        institutionCode: school.code,
        technician: schoolTechnician.username,
        numberAssignedIncidences: technicianIncidences.length
      };
    }

    var assignationsListReport = [];
    for (var i=0; i<=schools.length -1; i++){

      assignationsTotalsReport.totalInstitutions =+ 1 ;

      var currentSchool = schools[i];
      var currentSchoolTechnicians = filterUsersByRole(filterUsersBySchool(users, currentSchool), ROLE_TECH);
      for (var j=0; j <= currentSchoolTechnicians.length -1; j++){
        var currentSchoolTechnician = currentSchoolTechnicians[j];
        var technicianIncidences = filterIncidencesByTechnician(incidences, currentSchoolTechnician);
        var currentRow = generateRow(currentSchool, technicianIncidences, currentSchoolTechnician);
        assignationsListReport.push(currentRow);

        assignationsTotalsReport.totalAssignations += currentRow.numberAssignedIncidences;

      } 
    }
    return {totals: assignationsTotalsReport, list: assignationsListReport};
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

        var totalsReport = generateTotalListReport(incidencesData.list, schoolsData.list, usersData.list);
        var severityPriorityReport = generateSeverityPriorityListReport(incidencesData.list, schoolsData.list);
        var effortsReport = generateEffortsReport(incidencesData.list, schoolsData.list, usersData.list);
        var assignationsReport = generateAssignationsListReport(incidencesData.list, schoolsData.list, usersData.list);
        deferred.resolve({status: RESULT_SUCCESS, report: [totalsReport, severityPriorityReport, effortsReport, assignationsReport]});
    }
    else {
      var errorMessage = "There has been an error trying to compile the data in order to generate the incidences report.";
      console.error(errorMessage);  
      deferred.resolve({status: RESULT_ERROR, error: errorMessage});
    }
  });
      
  return deferred.promise;
};


