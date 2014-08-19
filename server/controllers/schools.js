'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR"; 
var schoolsDomain = require('../domain/schools-domain');


/**
 * List of schools
 */
exports.list = function(req, res) {
  schoolsDomain.listSchools(req.body.schoolCode).then (function (resultList){
    if (resultList.status == RESULT_ERROR){
      res.json(500, resultList.error);
    }  
    else if (resultList.status == RESULT_SUCCESS){
      res.json(resultList.list);
    }
  });
};

/**
 * Create a school
 */
exports.create = function(req, res) {
 schoolsDomain.createSchool(req.body.code, req.body.name, req.body.address).then (function (result){
    if (result.status == 'school.created'){
      res.json(result.school);
    }  
    else if (result.status == 'school.not.created'){
      res.json(500, result.err);
    }
  });   
};

/**
 *  School Code exists
 *  returns {exists}
 */
 
exports.exists = function (req, res, next) {
  schoolsDomain.findByCode(req.params.schoolCode).then (function (result){
    if (result.status == 'school.found'){
      res.json({exists: true});
    }  
    else if (result.status == 'school.not.found'){
      res.json({exists: false});
    }
    else if (result.status == 'db.exception'){
      return next(new Error('DB Exception: Failed to load School with code ' + schoolCode));
    }
  });   
};