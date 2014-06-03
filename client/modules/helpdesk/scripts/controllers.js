'use strict';

var helpdeskControllers = angular.module('helpdeskControllers', ['helpdeskServices'])

helpdeskControllers.controller('HelpdeskCtrl', function ($scope, $rootScope, $routeParams, helpdeskContentLoader) {

    init();

    function init(){
      $scope.userName = $routeParams.param1;
      $scope.localPath = 'modules/helpdesk/views/';
      $scope.incidencesLocalPath = 'modules/helpdesk/incidences/views/'
      $scope.mainContent = $scope.incidencesLocalPath + 'dashboard.html';
      $scope.menuActionsContent = $scope.localPath + 'menu.html';
    }

    $scope.$on('contentUrlChanged', function(event, contentUrl) {   
      $scope.mainContent = contentUrl;
    }); 
  });


helpdeskControllers.controller('ActionsMenuCtrl', function ($scope, $rootScope, helpdeskContentLoader) {

  $scope.oneAtATime = false;
  var currentMainContent = $scope.mainContentUrl;

  if ($rootScope.currentUser.role == "user"){
    $scope.groups = [
      {
        title: 'Incidences',
        action: [{title: 'Incidences Dashboard', link: $scope.incidencesLocalPath + "dashboard.html"},
                 {title: 'My Incidences', link: $scope.incidencesLocalPath + "list.html"},
                 {title: 'New Incidence', link: $scope.incidencesLocalPath + "create.html"}]
      }
    ];
  }
  else if ($rootScope.currentUser.role == "tech"){
    $scope.groups = [
      {
        title: 'Incidences',
        action: [{title: 'Incidences Dashboard', link: $scope.incidencesLocalPath + "dashboard.html"},
                 {title: 'Accepted Incidences', link: $scope.incidencesLocalPath + "list.html"},
                 {title: 'New Incidence', link: $scope.incidencesLocalPath + "create.html"}]
      }
    ];
  }  
  else if ($rootScope.currentUser.role == "admin"){
    $scope.groups = [
      {
        title: 'Incidences',
        action: [{title: 'Incidences Dashboard', link: $scope.incidencesLocalPath + "dashboard.html"},
                 {title: 'Accepted Incidences', link: $scope.incidencesLocalPath + "list.html"},
                 {title: 'New Incidence', link: $scope.incidencesLocalPath + "create.html"}]
      },
      {
        title: 'Inventories ',
        action: [{title: 'Inventory Dashboard', link: $scope.localPath + "underConstruction.html"}, {title: 'New Item', link: $scope.localPath + "underConstruction.html"}]
      },
      {
        title: 'Reporting ',
        action: [{title: 'Reporting Dashboard', link: $scope.localPath + "underConstruction.html"}, {title: 'New report', link: $scope.localPath + "underConstruction.html"}]
      },
      {
        title: 'Advanced Settings ',
        action: [{title: 'Users Management', link: $scope.localPath + "underConstruction.html"}, {title: 'Schools Management', link: $scope.localPath + "underConstruction.html"}]
      }
    ];
  }  
  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };


  $scope.loadMainContent = function(contentUrl){
    helpdeskContentLoader.loadContentUrl(contentUrl);
  };
    
});
