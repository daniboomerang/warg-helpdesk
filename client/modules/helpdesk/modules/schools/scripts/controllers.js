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
        
        /*var formatAddress = function(addressString){

          var replaceAll = function (toReplace, str1, str2, ignore) {
              return toReplace.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
          }
          return replaceAll(addressString, ", ", "\n", true);
        }*/
        $scope.school = school;
        /*$scope.school.formatted_address = formatAddress($scope.school.address);*/

      },
      function (error){
        messengerService.popMessage('error', 'The school couldn´t be retrieved.', error.data);
        $state.go('helpdesk.schools.open');
      });
    }  
  };

});

schoolsControllers.controller('ListSchoolsCtrl', function ($scope, $state) {

  $scope.goToSchool = function (id) {
    $state.go('helpdesk.schools.open.school', { schoolId: id });
  };

/*
  $scope.selectedSchools = [];
  $scope.$watch('selectedSchools', function() {
    if ($scope.selectedSchools.length > 0){
      if ($scope.selectedSchools.length > 1)
        $scope.selectedSchools.splice( 0, 1 );
      $scope.onSelectedSchool($scope.selectedSchools[$scope.selectedSchools.length - 1]);
    } 
  },
  true);

  $scope.onSelectedSchool = function(school) {
    $state.go('helpdesk.schools.open.school', { schoolId: school._id });
  };*/

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

  /*if ($scope.school == null) $scope.address.selected = 'Loading....';
  else $scope.address.selected = $scope.school.address;*/

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
