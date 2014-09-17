var inventoryServices = angular.module('inventoryServices', [])

inventoryServices.factory('Inventory', function ($resource) {
    return $resource('api/inventory/:inventoryId', {
      inventoryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });
