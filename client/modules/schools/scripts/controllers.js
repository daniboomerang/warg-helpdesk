'use strict';

var schoolsControllers = angular.module('schoolsControllers', ['schoolsServices', 'authServices'])

schoolsControllers.controller('SchoolsCtrl', function ($scope, Schools, $q) {

  //////////
  /* CRUD */
  //////////

  $scope.create = function(code, name, address) {

    var deferred = $q.defer();

    var school = new Schools({
      code: code,
      name: name,
      address: address
    });
    school.$save(function(response) {
      deferred.resolve(response);
    });

    return deferred.promise;
  };

  $scope.remove = function() {
    
  }; 

  $scope.update = function() {
   
  };

  $scope.find = function() {
    Schools.query(function(schools) {
      $scope.schools = schools;
    });
  };

  $scope.findOne = function() {
  
  };

});

schoolsControllers.controller('SchoolsListCtrl', function ($scope, $state){
  $scope.goToState = function (state) {
    $state.go(state);
  }; 
});

schoolsControllers.controller('CreateSchoolFormCtrl', function ($scope){
  $scope.changed = function(filed){
    return filed.$dirty;
  };
});


schoolsControllers.controller('CreateSchoolCtrl', function ($scope, Auth, $http, $state) {

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
    $scope.create(form.code.$viewValue.toUpperCase(), form.name.$viewValue,
                  $scope.address.selected).then(
                    function (result){
                      $state.go('helpdesk.schools.open.list', $state.params);
                    },
                    function(err) {
                      angular.forEach(err.errors, function(error, field) {
                        form[field].$setValidity('mongoose', false);
                        $scope.errors[field] = error.message;
                      });
                      $scope.error.other = err.message;
                    });
    };
});