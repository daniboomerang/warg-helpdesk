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
  School = mongoose.model('School'),
  ObjectId = mongoose.Types.ObjectId,
  Q = require('q');

var effortDomain = require('./efforts-domain');
/**
 * Create a incidence
 *  Returns a PROMISE with the result 
 */
var generateNewId = function (schoolCode){

  var deferred = Q.defer();
  var regExp = new RegExp(schoolCode, 'i');
  //var regExp = '/'+ schoolCode + '/';
  var nextIncidenceId;
  Incidence.findOne({id: regExp}).sort({ 'created' : -1 }).exec(function(err, lastIncidence) {
    if (err) {
      deferred.reject({status: 'incidence.not.created', error: 'Error at incidence creation, trying to retrieve the last record on incidences.'});
    } else {
      if (lastIncidence == null){
        nextIncidenceId = 1; 
      } else {
        nextIncidenceId = parseInt(lastIncidence.id.split('-')[1]) + 1; 
      }
      deferred.resolve(schoolCode + '-' + nextIncidenceId.toString());
    }
  });

  return deferred.promise;
};

var defaultStatus = {  
  // Possible statuses : Open, Closed, Reopened
  currentStatus: STATUS_OPEN,
  // Possible substatuses : Open-OnGoing, Open-Blocked,
  // Closed-Solved, Closed-Duplicated, Closed-Invalid
  currentSubstatus: '',
  duplicatedOf: null,
  blockedBy: null
};

var DEFAULT_SEVERITY = "Medium";
var DEFAULT_PRIORITY = "Medium";

exports.createIncidence = function(title, description, user, severity, priority) {

  var school = user.school;

  severity = severity || DEFAULT_SEVERITY;
  priority = priority || DEFAULT_PRIORITY;

  if (school == null) return noSchoolRejection();
  return generateNewId(school.code)
    .then(createIncidenceWithId.bind(this, title, description, user, severity, priority));

};

var noSchoolRejection = function(){
  var deferredSchool = Q.defer();
  deferredSchool.reject({status: 'incidence.not.created', error: "Server internal error: 'User organization not found.'"});
  return deferredSchool.promise;
};

var createIncidenceWithId = function(title, description, user, severity, priority, generatedId){
  var deferredPureCreation = Q.defer();

  var incidence = new Incidence({title: title, description: description, severity: severity, priority: priority, status: defaultStatus });
  incidence.creator =  user;
  incidence.id = generatedId;

  incidence.save(function(err) {
    if (err) {
      deferredPureCreation.reject({status: 'incidence.not.created', error: err});
    } else {
      deferredPureCreation.resolve({status: 'incidence.created', incidence: incidence});
    }
  });

  return deferredPureCreation.promise;
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
  incidence.effort += effort;
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
 *  Updates incidence effort
 *  Returns a PROMISE with the result 
 */
exports.updateEffort= function(user, incidence, effort) {

  var deferred = Q.defer();

  incidence.effort += effort;
  
  incidence.save(function(err) {
    if (err) {
      deferred.resolve({status: 'incidence.not.updated', error: err});
    } else {
      effortDomain.reportEffort(user, incidence, effort).then( function (result){
        if (result.status == RESULT_ERROR) {
          deferred.resolve({status: 'incidence.not.updated'});
        } else {
          deferred.resolve({status: 'incidence.updated', incidence: incidence});
        }
      });
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

/**
 *  Updates the arry of comments of an incidence
 *  Returns a PROMISE with the result 
 */
exports.postComment = function(incidenceId, comment, author, date) {

  var deferred = Q.defer();

  var safe_tags = function(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
  };

  Incidence.findOne({ id: incidenceId }).exec(function(err, incidence){
    if (err) {
      deferred.resolve({status: RESULT_ERROR, error: err});
    } else {
      var post = {post: safe_tags(comment), author: author, date: date};
      incidence.history.unshift(post);
      incidence.save(function(err) {
        if (err) {
          deferred.resolve({status: 'incidence.not.updated', error: err});
        } else {
          deferred.resolve({status: 'incidence.updated', incidence: incidence});
        }
      });
    }
  });

  return deferred.promise;

};
