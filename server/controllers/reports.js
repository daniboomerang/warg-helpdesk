'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";
var INTERNAL_SERVER_ERROR = '500 - Internal server error';

//var reportingDomain = require('../domain/reporting-domain');

/**
 * Incidences Report
 */
exports.incidences = function(req, res) {
	console.log("dsfkjlsflñadslkdj");
	res.json(['asd', 'asd', 'asd']);
	/*reportingDomain.incidencesReporting().then (function (result){
		if (result.status == RESULT_ERROR){
			
		}  
		if (result.status == RESULT_SUCCESS){

		}
	});*/
};