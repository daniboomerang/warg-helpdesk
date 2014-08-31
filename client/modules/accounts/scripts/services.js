var accountsServices = angular.module('accountsServices', ['ngResource'])

accountsServices.factory('Accounts', function ($resource) {
    return $resource('/api/users/:accountId', {
      accountId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });

