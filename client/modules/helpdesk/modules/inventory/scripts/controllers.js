'use strict';

var inventoryControllers = angular.module('inventoryControllers', [])

inventoryControllers.controller('InventoryCtrl', function ($scope, messengerService) {
});

inventoryControllers.controller('ExpensesReportCtrl', function ($scope, Auth, $location, $timeout) {

  $timeout(function() {
    $scope.expensesData = {
      series: ['Sales', 'Income', '<i>Expense</i>', 'Laptops', 'Keyboards'],
      data : [{
        x : "Sales",
        y: [100,500, 0],
        tooltip:"this is tooltip"
      },
      {
        x : "Not Sales",
        y: [300, 100, 100]
      },
      {
        x : "Tax",
        y: [351]
      },
      {
        x : "Not Tax",
        y: [54, 0, 879]
      }]
    };
  }, 100);

  $scope.chartType = 'bar';

  $scope.expensesConfig = {
    labels: false,
    title : "Products",
    legend : {
      display:true,
      position:'left'
    },
    innerRadius: 0
  };
});

inventoryControllers.controller('StatisticsReportCtrl', function ($scope, Auth, $location) {

  $scope.chartType = 'pie';

  $scope.statisticsConfig = {
    labels: false,
    title : "HTML-enabled legend",
    legend : {
      display:true,
      htmlEnabled: true,
      position:'right'
    },
    lineLegend: 'traditional'
  }

 $scope.statisticsData = {
    series: ['<em>500</em> Keyboards', '<em>105</em> Laptops', '<em>100</em> TVs'],
    data : [{
      x : "Sales",
      y: [100, 500, 0],
      tooltip:"this is tooltip"
    },
    {
      x : "Income",
      y: [300, 100, 100]
    },
    {
      x : "Expense",
      y: [351, 50, 25]
    }]
  }   
});

inventoryControllers.controller('IndexCtrl', function ($scope, $modal, inventoryService, messengerService) {

  $scope.items = [];

  $scope.find = function(){
    inventoryService.find().then(
      function(items){
        $scope.items = items;
      },
      function(error){
        messengerService.popMessage('error', 'The list of incidences couldn´t be retrieved.', error.status + ' - ' + error.statusText);
      }
    );
  };

  $scope.disableItem = function(item){
    inventoryService.disableItem(item).then(
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
  };

  $scope.open = function (item, size) {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
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
    return !$scope.item.disabled || !$scope.item.disabled.why || !$scope.item.disabled.when;
  };

};

inventoryControllers.controller('CreateInventoryCtrl', function ($scope, $location, inventoryService, messengerService, InventoryItem, InventoryItemCustomData) {
  $scope.kinds = [
    { name: 'PC' }, 
    { name: 'PRINTER' }, 
    { name: 'MONITOR' }, 
    { name: 'MOUSE' }, 
    { name: 'KEYBOARD' }, 
    { name: 'OTHER' }
  ];

  $scope.data = {};
  $scope.data.serial = "";
  $scope.data.internalId = "";
  $scope.data.kind = {};
  $scope.data.acquisitionDate = "";
  $scope.data.guaranteeExpirationDate = "";
  $scope.data.lastInventoryDate = "";
  $scope.data.model = "";
  $scope.data.manufacturer = "";
  $scope.data.location = "";
  $scope.data.description = "";
  $scope.data.price = "";

  $scope.data.custom = {};

  $scope.create = function(form) {
    var inventoryData = JSON.parse(JSON.stringify($scope.data));
    inventoryData.kind = $scope.data.kind.selected.name;
    inventoryData = InventoryItemCustomData.clean(inventoryData);
    var inventoryItem = new InventoryItem(inventoryData);
    inventoryItem.$save(function(inventoryItem){
      $location.path("helpdesk/inventory/index");
      messengerService.popMessage('success', 'Inventory item successfully created.');
    }, function(error){
      messengerService.popMessage('error', 'Inventory Item not created.', error.status + ' - ' + error.statusText);
    });
  };

  $scope.pcSelected = function(){
    return $scope.data.kind.selected && $scope.data.kind.selected.name == 'PC';
  };

});
