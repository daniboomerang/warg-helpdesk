'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";

var reportsDomain = require('../domain/reports-domain');

/**
 * Incidences Report
 */
exports.incidences = function(req, res) {
	reportsDomain.incidences().then (function (result){
		if (result.status == RESULT_ERROR){
			res.json(result.error);
		}  
		if (result.status == RESULT_SUCCESS){
			res.json(result.report);
		}
	});
};