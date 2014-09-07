'use strict';

var notificationServices = angular.module('notificationServices', [])

notificationServices.factory('Notifications', function ($resource) {
    return $resource('api/notifications/:notificationId', {
      notificationId: '@_id',

    }, {
      update: {
        method: 'PUT'
      }
    });
  });


notificationServices.factory('NotificationStatus', function ($resource) {
    return $resource('api/notifications/:notificationId/status', {
      notificationId: '@_id',

    }, {
      updateStatus: {
        method: 'PUT'
      }
    });
  });