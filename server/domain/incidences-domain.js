'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR"; 
var ROLE_TECH = "tech";
var ROLE_USER = "user";
var STATUS_ONGOING = "On Going";
var STATUS_CLOSED = "Closed";
var STATUS_OPEN = "Open"

var mongoose = require('mongoose'),
  Incidence = mongoose.model('Incidence'),
  ObjectId = mongoose.Types.ObjectId,
  Q = require('q');

/**
 * Create a incidence
 *  Returns a PROMISE with the result 
 */
exports.createIncidence = function(title, description, user, severity, priority, school) {

  var generateNewId = function (schoolCode){

      console.log("########### GENERATE NEW INC ID ");
    var deferred = Q.defer();
    var regExp = new RegExp(schoolCode, 'i');
    //var regExp = '/'+ schoolCode + '/';
    var nextIncidenceId;
    Incidence.findOne({id: regExp}).sort({ 'created' : -1 }).exec(function(err, lastIncidence) {
      if (err) {
      console.log("########### ERROR GENERATE NEW INC ID ");
        deferred.resolve({status: 'incidence.not.created', error: 'Error at incidence creation, trying to retrieve the last record on incidences.'});
      } else {
        if (lastIncidence == null){
          nextIncidenceId = 1; 
        } else {
          nextIncidenceId = parseInt(lastIncidence.id.split('-')[1]) + 1; 
        }
      console.log("########### GENERATED INC ID ");
        deferred.resolve(schoolCode + '-' + nextIncidenceId.toString());
      }
    });

    return deferred.promise;
  };

  var deferred = Q.defer();

  if (severity==null){severity = "Medium";}
  if (priority==null){priority = "Medium";}

  var status = {
      // Possible statuses : Open, Closed, Reopened
      currentStatus: STATUS_OPEN,
      // Possible substatuses : Open-OnGoing, Open-Blocked,
      // Closed-Solved, Closed-Duplicated, Closed-Invalid
      currentSubstatus: '',
      duplicatedOf: null,
      blockedBy: null
  };

 var incidence = new Incidence({title: title, description: description, severity: severity, priority: priority, status: status });
  incidence.creator =  user;
      console.log("########### INCIDENCE MODEL CREATED");


  if (school == null){
    deferred.resolve({status: 'incidence.not.created', error: "Server internal error: 'User organization not found.'"});
  }
  else {
    generateNewId(school.code).then(function (newId){
      incidence.id = newId;
      console.log("########### GOING TO SAVE INCIDENCIA ");
      incidence.save(function(err) {
        if (err) {
          deferred.resolve({status: 'incidence.not.created', error: err});
        } else {
          deferred.resolve({status: 'incidence.created', incidence: incidence});
        }
      });
    })
  }  
  return deferred.promise;
};

/**
 *  Finds an incidence
 *  returns {incidence}
 */
exports.findIncidence = function (id) {

  var deferred = Q.defer();

   Incidence.load(id, function (err, incidence) {
      if (err) {
        deferred.resolve({status: 'incidence.not.found', error: err});
      } else if (incidence == null){
        deferred.resolve({status: 'incidence.not.found', error: 'Failed to load incidence ' + id + '.' + '\n' + 'Please be sure ' + id + 'is correct.' });
      } else deferred.resolve({status: 'incidence.found', incidence: incidence});
    });

  return deferred.promise;

};

/**
 *  Return the list of incidences of a user
 *  Returns a PROMISE with the result 
 */
exports.listUserIncidences = function(user) {

  var deferred = Q.defer();

  // Role determines which incidences can be listed

  // Role: user -> only those he owns
  if (user.role == ROLE_USER){
    Incidence.find({creator: user}).sort('-created').populate('creator', 'username').exec(function(err, incidences) {
     if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {   
      deferred.resolve({status: RESULT_SUCCESS, list: incidences});
    }
    });
  }
  else if (user.role == ROLE_TECH) {
    var regExp = new RegExp(user.school.code, 'i');
    Incidence.find({id: regExp}).sort('-created').populate('creator', 'username').exec(function(err, incidences) {
    if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {   
      deferred.resolve({status: RESULT_SUCCESS, list: incidences});
    }
    });
  }
  else{ //user.role = admin || tech
    Incidence.find().sort('-created').populate('creator', 'username').exec(function(err, incidences) {
    if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {   
      deferred.resolve({status: RESULT_SUCCESS, list: incidences});
    }
    });
  }
  return deferred.promise;
};


/**
 *  Return list with ALL the incidences
 *  Returns a PROMISE with the result 
 */
exports.listIncidences = function() {

  var deferred = Q.defer();

  Incidence.find().sort('-created').populate('creator', 'username').exec(function(err, incidences) {
    if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {   
      deferred.resolve({status: RESULT_SUCCESS, list: incidences});
    }
  });
  
  return deferred.promise;
};

/**
 *  Closes an incidence 
 *  Returns a PROMISE with the result 
 */
exports.closeIncidence = function(incidence, reason, effort, duplicated, invalidComment, date) {

  var deferred = Q.defer();

  var status = {
      // Possible statuses : Open, Closed, Reopened
      currentStatus: STATUS_CLOSED,
      // Possible substatuses : Open-OnGoing, Open-Blocked,
      // Closed-Solved, Closed-Duplicated, Closed-Invalid
      currentSubstatus: reason,
      duplicatedOf: duplicated,
      blockedBy: null
  };
  
  incidence.status = status;
  incidence.effort = effort;
  incidence.markModified('status');

  if (reason == "Invalid"){
    var post = {post: invalidComment, author: incidence.assigned, date: date};
    incidence.history.unshift(post);  
  }
  
  incidence.assigned = null;
  incidence.save(function(err) {
    if (err) {
      deferred.resolve({status: 'incidence.not.closed', error: err});
    } else {
      deferred.resolve({status: 'incidence.closed', incidence: incidence});
    }
  });

  return deferred.promise;
};

/**
 *  Updates an incidence assignation
 *  Returns a PROMISE with the result 
 */
exports.updateAssignee = function(incidence, assigned) {

  var deferred = Q.defer();

  incidence.assigned = assigned.username;
  incidence.status.currentStatus = STATUS_ONGOING;
  incidence.markModified('status.currentStatus');

  incidence.save(function(err) {
    if (err) {
      deferred.resolve({status: 'incidence.not.updated', error: err});
    } else {
      deferred.resolve({status: 'incidence.updated', incidence: incidence});
    }
  });

  return deferred.promise;
};

/**
 *  Updates the arry of comments of an incidence
 *  Returns a PROMISE with the result 
 */
exports.updateComment = function(incidence, comment, author, date) {

  var deferred = Q.defer();
  var post = {post: comment, author: author, date: date};
  incidence.history.unshift(post);
  incidence.save(function(err) {
    if (err) {
      deferred.resolve({status: 'incidence.not.updated', error: err});
    } else {
      deferred.resolve({status: 'incidence.updated', incidence: incidence});
    }
  });

  return deferred.promise;
};
