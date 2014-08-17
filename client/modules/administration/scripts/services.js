var adminServices = angular.module('adminServices', [])

adminServices.factory('Users', function ($resource) {
    return $resource('api/administration/users', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });