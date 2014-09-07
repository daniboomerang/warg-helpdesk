'use strict';

var schoolsControllers = angular.module('schoolsControllers', [])

schoolsControllers.controller('SchoolsCtrl', function ($scope, $q, $state, messengerService, schoolResourceService) {

  //////////
  /* CRUD */
  //////////

  $scope.create = function(code, name, address) {
    schoolResourceService.createSchool(code, name, address).then(function(school) {
      $scope.school = school;
      messengerService.popMessage('success', 'School successfully created.', null);
      $state.go('helpdesk.schools.open.list');
    },
    function (error){
      messengerService.popMessage('error', 'School couldn´t be created.', error.data);
    });
  };

  $scope.find = function() {
    schoolResourceService.findSchools().then(function(schools) {
      $scope.schools = schools;
    },
    function (error){
      messengerService.popMessage('error', 'The Schools couldn´t be retrieved.', error.data);
    });
  };

  $scope.findOne = function(id) {
    if ($state.params.accountId == ''){
      $state.go('helpdesk.schools.open.list');
    }
    else{
      schoolResourceService.findOne($state.params.accountId).then(function(school) {
        $scope.school = school;
        messengerService.popMessage('success', 'School successfully created.', null);
      },
      function (error){
        messengerService.popMessage('error', 'School couldn´t be created.', error.data);
      });
    }  
  };

});

schoolsControllers.controller('SchoolsListCtrl', function ($scope, $state){
  $scope.goToState = function (state) {
    $state.go(state);
  }; 
});

schoolsControllers.controller('CreateSchoolCtrl', function ($scope, $http) {

  $scope.school = {};

  $scope.someGroupFn = function (item){

    if (item.name[0] >= 'A' && item.name[0] <= 'M')
        return 'From A - M';

    if (item.name[0] >= 'N' && item.name[0] <= 'Z')
        return 'From N - Z';

  };

  $scope.address = {};
  $scope.refreshAddresses = function(address) {
    var params = {address: address, sensor: false};
    return $http.get(
      'http://maps.googleapis.com/maps/api/geocode/json',
      {params: params}
    ).then(function(response) {
      $scope.addresses = response.data.results;
    });
  };

  $scope.createSchool = function(form){
    $scope.create(form.code.$viewValue.toUpperCase(), form.name.$viewValue, $scope.address.selected);
  };

  $scope.changed = function(filed){
    return filed.$dirty;
  };
});