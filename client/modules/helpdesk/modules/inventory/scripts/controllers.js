'use strict';

var inventoryControllers = angular.module('inventoryControllers', [])

inventoryControllers.controller('InventoryCtrl', function ($scope, messengerService) {
});

inventoryControllers.controller('IndexCtrl', function ($scope, $modal, $state, inventoryService, messengerService) {

  $scope.items = [];

  $scope.find = function(){
    inventoryService.find().then(
      function(items){
        $scope.items = items;
      },
      function(error){
        messengerService.popMessage('error', 'The inventory couldn´t be retrieved.', error.status + ' - ' + error.statusText);
      }
    );
  };

  $scope.edit = function(item){
    $state.go ('helpdesk.inventory.create.' + item.kind, {
      itemId: item._id
    });
  };

  $scope.disable = function (item, size) {
    var modalInstance = $modal.open({
      templateUrl: '/modules/helpdesk/modules/inventory/views/partials/disablePopup.html',
      controller: ModalInstanceCtrl,
      size: size,
      resolve: {
        item: function () {
          return item;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      selectedItem.$update(
        function(item){
          messengerService.popMessage('success', 'Item disabled successfuly.');
          $scope.items = $scope.items.filter(function(el){
            return el._id != item._id;
          });
        },
        function(){
          messengerService.popMessage('error', 'The item couldn\'t be disabled.');
        }
      );
    }, function () {
    });
  };

});

var ModalInstanceCtrl = function ($scope, $modalInstance, item) {

  $scope.item = item;

  $scope.ok = function () {
    $modalInstance.close($scope.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.uncompleteData = function(){
    return !$scope.item.availability || !$scope.item.availability.why || !$scope.item.availability.when;
  };

};

inventoryControllers.controller('CreateInventoryCtrl', function ($scope, $location, $stateParams, $modal, inventoryService, messengerService, InventoryItem, InventoryItemCustomData) {

  $scope.open = function($event, opened) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope[opened] = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.format = 'dd/MM/yyyy';

  $scope.data = {};
  $scope.data.serial = "";
  $scope.data.internalId = "";
  $scope.data.kind = "OTHER";
  $scope.data.acquisitionDate = "";
  $scope.data.guaranteeExpirationDate = "";
  $scope.data.lastInventoryDate = "";
  $scope.data.model = "";
  $scope.data.manufacturer = "";
  $scope.data.location = "";
  $scope.data.description = "";
  $scope.data.price = "";

  $scope.data.custom = {};
  $scope.buttonText = "BUTTON.CREATE";

  $scope.kinds = [
    'PC', 
    'PRINTER', 
    'MONITOR', 
    'MOUSE', 
    'KEYBOARD', 
    'OTHER'
  ];

  var resource;
  if ($stateParams.itemId){
    $scope.buttonText = "BUTTON.UPDATE";
    resource = new InventoryItem({ _id: $stateParams.itemId});
    resource.$get(function(data){
      _setView(data);
    });
  }

  $scope.create = function(form) {
    if ($scope.data._id){
      resource.$update(function(inventoryItem){
        $location.path("helpdesk/inventory/index");
        messengerService.popMessage('success', 'Inventory item successfully created.');
      }, function(error){
        messengerService.popMessage('error', 'Inventory Item not created.', error.status + ' - ' + error.statusText);
      });
    }else{
      var inventoryItem = new InventoryItem(InventoryItemCustomData.clean($scope.data));
      inventoryItem.$save(function(inventoryItem){
        $location.path("helpdesk/inventory/index");
        messengerService.popMessage('success', 'Inventory item successfully created.');
      }, function(error){
        messengerService.popMessage('error', 'Inventory Item not created.', error.status + ' - ' + error.statusText);
      });
    }
  };

  $scope.switchStatus = function(){
    var modalInstance = $modal.open({
      templateUrl: '/modules/helpdesk/modules/inventory/views/partials/disablePopup.html',
      controller: ModalInstanceCtrl,
      resolve: {
        item: function () {
          return $scope.data;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      selectedItem.$update(
        function(item){
          messengerService.popMessage('success', 'Item '+ item.availability.status +' successfuly.');
          _setView(item);
        },
        function(){
          messengerService.popMessage('error', 'The item couldn\'t be '+ item.availability.status +'.');
        }
      );
    }, function () {
    });
  };

  var _setView = function(item){
    $scope.data = item;
    $scope.data.isEnabled = !$scope.data.availability || $scope.data.availability.status == "enabled";
    $scope.data.isDisabled = !$scope.data.isEnabled;
    $scope.data.statusText = $scope.data.availability ? $scope.data.availability.status.capitalize() : "Enabled";
  };

});