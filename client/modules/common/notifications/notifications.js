'use strict';
			
// Define main module notifications and injects all other modules as dependencies
var notifications = angular.module('notifications',
  [
    'notificationServices'
  ]
);