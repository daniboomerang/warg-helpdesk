'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR"; 

var mongoose = require('mongoose'),
  Effort = mongoose.model('Effort'),
  ObjectId = mongoose.Types.ObjectId,
  Q = require('q');

var EFFORT_BY_USER = 'user';
var EFFORT_BY_INCIDENCE = 'incidence';


var generateEffortReport = function(type, owner, reporterId, effort ){

  var updateEffortReport = function (effortReport, reporterId, effort){

    var deferred = Q.defer();

    var existsAndUpdated = false;
    for (var i=0; ((i <= effortReport.data.length -1) && (!existsAndUpdated)) ; i++){
      if (effortReport.data[i].reporter == reporterId){
        effortReport.data[i].effort += effort;
        existsAndUpdated = true;
      }
    }

    if (!existsAndUpdated){
      effortReport.data.push({reporter: reporterId, effort: effort})
    }

    effortReport.totalEffort += effort;

    effortReport.save(function(err) {
      if (err) {
        deferred.resolve({status: RESULT_ERROR});
      } else {
        deferred.resolve({status: RESULT_SUCCESS});
      }
    });

    return deferred.promise;
  };

  var createEffortReport = function (type, owner, reporterId, effort){

    var deferred = Q.defer();
   
    if (type == EFFORT_BY_USER){
      var userEffort = {
        reporter: reporterId,
        effort: effort
      };
      var userEffort = new Effort({type: 'user', owner: owner, totalEffort: effort, data: [userEffort]});
       userEffort.save(function(err) {
        if (err) {
          deferred.resolve({status: RESULT_ERROR});
        } else {
          deferred.resolve({status: RESULT_SUCCESS});
        }
      });
    }  
    else {
      var incidenceEffort = {
        reporter: reporterId,
        effort: effort
      };
      var incidenceEffort = new Effort({type: 'incidence', owner: owner, totalEffort: effort, data: [incidenceEffort]});
       incidenceEffort.save(function(err) {
        if (err) {
          deferred.resolve({status: RESULT_ERROR});
        } else {
          deferred.resolve({status: RESULT_SUCCESS});
        }
      });
    }

    return deferred.promise;
  };

  var deferred = Q.defer();

  findEffortReport(owner).then (function (result){    
    if (result.status == 'db.exception') {
      deferred.resolve({status: 'db.exception', error: err});
    }
    else if (result.effortReport) {
      // We update the existing one
      updateEffortReport(result.effortReport, reporterId, effort).then( function(result){
        if (result.status == RESULT_SUCCESS){
          deferred.resolve ({status: RESULT_SUCCESS});
        }
        else{
          deferred.resolve ({status: RESULT_ERROR});
        }
      });
    } 
    else {
      // We create a new effort report for the existing user
      createEffortReport(type, owner, reporterId, effort).then( function(result){
        if (result.status == RESULT_SUCCESS){
          deferred.resolve ({status: RESULT_SUCCESS});
        }
        else{
          deferred.resolve ({status: RESULT_ERROR});
        }
      });
    }
  });

  return deferred.promise;
}

var findEffortReport = function (owner) {
  var deferred = Q.defer();
  var result = {};
  Effort.findOne({owner: owner}, function (err, effortReport) {
    if (err) {
      result = {status: 'db.exception', error: err};
    }
    else if(effortReport) {
      result = {status: 'report.found', effortReport: effortReport};
    } else {
      result = {status: 'report.not.found', effortReport: null};
    }
    deferred.resolve(result);
  });
  return deferred.promise;
};


/**
 *  Report
 *  Returns a PROMISE with the result 
 */
exports.reportEffort = function(user, incidence, effort) {

  var deferred = Q.defer();

  if (effort > 0){

    var effortReportPromises = Q.all([ generateEffortReport(EFFORT_BY_USER, user.email, incidence.id, effort), generateEffortReport(EFFORT_BY_INCIDENCE, incidence.id, user.email, effort)])
    
    effortReportPromises.then(function(results){
      var userEffortReport = results[0];
      var incidenceEffortReport = results[1];

      if  (userEffortReport.status == RESULT_SUCCESS &&
           incidenceEffortReport.status == RESULT_SUCCESS){
        deferred.resolve({status: RESULT_SUCCESS});
      }
      else{
        deferred.resolve({status: RESULT_ERROR});
      }
    });
  }

  setTimeout( function (){
      deferred.resolve({status: RESULT_SUCCESS});
    },50);
  
  return deferred.promise;
};

/**
 *  Return the list of effort reports
 *  Returns a PROMISE with the result 
 */
exports.listReportedEfforts = function() {

  var deferred = Q.defer();

  Effort.find().exec(function(err, effortReports) {
    if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {   
      deferred.resolve({status: RESULT_SUCCESS, list: effortReports});
    }
  });

  return deferred.promise;
};
