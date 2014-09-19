var inventoryServices = angular.module('inventoryServices', [])

inventoryServices.factory('inventoryService', function ($resource, $q) {
  var resourceService = $resource('api/inventory/:inventoryId', {
      inventoryId: '@_id'
    }, 
    {
      update: {
        method: 'PUT'
      },
      disable: {
        method: 'PUT',
        url: 'api/inventory/:inventoryId/disable'
      }
    }
  );

  var _find = function(){
    var deferred = $q.defer();

    resourceService.query(
      function (items) {
        deferred.resolve(items);
      },
      function (error){
        deferred.reject(error);
      }
    );

    return deferred.promise;
  };

  var _disableItem = function(item){
    var deferred = $q.defer();

    item.$disable(
      function(msg){
        deferred.resolve(msg);
      }, 
      function(error){
        deferred.reject(error);
      }
    );

    return deferred.promise;
  };

  return {
    find: _find,
    disableItem: _disableItem
  }
});

inventoryServices.factory('InventoryItem', function ($resource) {
  return $resource('api/inventory/:inventoryId', {
    inventoryId: '@_id',
  }, {
    disable: {
      method: 'PUT'
    }
  });
});
