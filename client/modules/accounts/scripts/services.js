var accountsServices = angular.module('accountsServices', [])

accountsServices.factory('Accounts', function ($resource) {
    return $resource('api/users', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });