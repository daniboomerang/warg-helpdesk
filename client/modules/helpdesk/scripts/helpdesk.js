'use strict';
			
// Define main module Auth and injects all other modules as dependencies
var helpdesk = angular.module('helpdesk',
  [
  	'helpdeskControllers',
  	'helpdeskServices',
  	'incidences'
  ]
);