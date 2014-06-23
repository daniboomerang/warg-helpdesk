'use strict';
			
// Define main module Auth and injects all other modules as dependencies
var auth = angular.module('auth',
  [
    'authServices'
  ]
);