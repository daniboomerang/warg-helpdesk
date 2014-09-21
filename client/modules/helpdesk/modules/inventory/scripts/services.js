var inventoryServices = angular.module('inventoryServices', [])

inventoryServices.factory('inventoryService', function ($resource, $q) {
  var resourceService = $resource('api/inventory/:inventoryId', {
      inventoryId: '@_id'
    }, 
    {
      update: {
        method: 'PUT'
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

  return {
    find: _find,
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

inventoryServices.factory('InventoryItemCustomData', function () {
  var customFields = {
    'PRINTER': [],
    'MONITOR': ['size', 'connector'],
    'KEYBOARD': ['usb'],
    'MOUSE': ['usb'],
    'PC': ['processor', 'ram', 'hd', 'video', 'cd', 'type'],
  };

  return {
    clean: function(fields){
      Object.getOwnPropertyNames(fields.custom).forEach(function(customProp){
        if (customFields[fields.kind].indexOf(customProp) < 0){
          delete fields.custom[customProp];
        }
      });
      return fields;
    }
  };

});
