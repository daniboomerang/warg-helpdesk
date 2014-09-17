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

inventoryControllers.controller('IndexCtrl', function ($scope, Auth, $location, Inventory) {

  $scope.items = [];

  $scope.find = function(){
    Inventory.query(function (items) {
      $scope.items = items;
    },
    function (error){
      messengerService.popMessage('error', 'The list of incidences couldn´t be retrieved.', error.status + ' - ' + error.statusText);
    });
  };

});



