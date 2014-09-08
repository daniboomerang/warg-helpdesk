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
      $state.go('helpdesk.schools.open');
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

  $scope.findOne = function() {
    if ($state.params.schoolId == ''){
      $state.go('helpdesk.schools.open');
    }
    else{
      schoolResourceService.findOne($state.params.schoolId).then(function(school) {
      $scope.school = school;
      },
      function (error){
        messengerService.popMessage('error', 'The school couldn´t be retrieved.', error.data);
        $state.go('helpdesk.schools.open');
      });
    }  
  };

});

schoolsControllers.controller('ListSchoolsCtrl', function ($scope, $state) {

  $scope.selectedSchools = [];
  $scope.openSchool = function (id) {
    $state.go('helpdesk.schools.open.school', { schoolId: id });
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

schoolsControllers.controller('SchoolCtrl', function ($scope, $http){

  $scope.changed = function(filed){
    return filed.$dirty;
  };

  $scope.someGroupFn = function (item){

    if (item.name[0] >= 'A' && item.name[0] <= 'M')
        return 'From A - M';

    if (item.name[0] >= 'N' && item.name[0] <= 'Z')
        return 'From N - Z';

  };

  $scope.refreshAddresses = function(address) {
    var params = {address: address, sensor: false};
    return $http.get(
      'http://maps.googleapis.com/maps/api/geocode/json',
      {params: params}
    ).then(function(response) {
      $scope.addresses = response.data.results;
    });
  };
});
