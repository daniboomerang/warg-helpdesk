var schoolsServices = angular.module('schoolsServices', [])

schoolsServices.factory('Schools', function ($resource) {
    return $resource('api/schools', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });