'use strict';
			
// Define main module messenger and injects all other modules as dependencies
var messenger = angular.module('messenger',
  [
    'messengerServices'
  ]
);