'use strict';
			
// Define main module url location and injects all other modules as dependencies
var securityCheck = angular.module('securityCheck',
  [
    'securityCheckServices'
  ]
);