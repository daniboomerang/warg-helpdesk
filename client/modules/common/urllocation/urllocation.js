'use strict';
			
// Define main module url location and injects all other modules as dependencies
var urlLocation = angular.module('urlLocation',
  [
    'urlLocationServices'
  ]
);