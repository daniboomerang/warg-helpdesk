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
      console.log(selectedItem);
      // $scope.disableItem(selectedItem);
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
      console.log('Modal dismissed at: ' + new Date());
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
};

inventoryControllers.controller('CreateCtrl', function ($scope, $location, inventoryService, messengerService, InventoryItem) {
  $scope.kinds = [
    { name: 'PC' }, 
    { name: 'PRINTER' }, 
    { name: 'MONITOR' }, 
    { name: 'MOUSE' }, 
    { name: 'KEYBOARD' }, 
    { name: 'OTHER' }
  ];

  $scope.serial = "";
  $scope.internalId = "";
  $scope.kind = {};
  $scope.acquisitionDate = "";

  $scope.create = function(form) {
    var data = {};
    data.serial = $scope.serial;
    data.internalId = $scope.internalId;
    data.kind = $scope.kind.selected.name;
    data.acquisitionDate = $scope.acquisitionDate;
    var inventoryItem = new InventoryItem(data);
    inventoryItem.$save(function(inventoryItem){
      $location.path("helpdesk/inventory/index");
      messengerService.popMessage('success', 'Inventory item successfully created.');
    }, function(error){
      messengerService.popMessage('error', 'Inventory Item not created.', error.status + ' - ' + error.statusText);
    });
  };

});



