'use strict';
			
// Define main module Auth and injects all other modules as dependencies
var incidences = angular.module('incidences',
  [
    'incidencesControllers',
    'incidencesServices'
  ]
);