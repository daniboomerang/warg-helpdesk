'use strict';

var deskControllers = angular.module('deskControllers', ['deskServices'])

deskControllers.controller('DeskCtrl', function ($scope, $routeParams, deskConfigService) {
    
    $scope.oneAtATime = false;
    $scope.status = {
      isFirstOpen: true,
      isFirstDisabled: false
    };
    $scope.menu = deskConfigService.getMenu();

});