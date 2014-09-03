'use strict';
			
// Define main module Auth and injects all other modules as dependencies
var notifications = angular.module('notifications',
  [
    'notificationServices'
  ]
);