'use strict';

var adminControllers = angular.module('adminControllers', ['adminServices', 'authServices', 'ui.select'])

adminControllers.controller('UsersCtrl', function ($scope, Users, $q, Auth) {

  //////////
  /* CRUD */
  //////////

  $scope.create = function(email, username, password, role) {
    var deferred = $q.defer();
    Auth.createUser({
      email: email,
      username: username,
      password: password,
      role: role
    },
    function(err) {
      $scope.errors = {};
      if (!err) {
        deferred.resolve();
      } else {
        deferred.reject(err);
      }
    });
    return deferred.promise;
  };

  $scope.remove = function(incidence) {
    
  }; 

  $scope.update = function() {
   
  };

  $scope.find = function() {
    Users.query(function(users) {
      $scope.users = users;
    });
  };

  $scope.findOne = function() {
  
  };

});

adminControllers.controller('CreateUserCtrl', function ($scope, Auth, $location, $state) {

	$scope.roleTypes = [{type: 'user'}, {type:'tech'}];

  $scope.error = {};
  $scope.user = {};
  $scope.user.role = {};
	$scope.user.role.selected = {type: 'user'};
	
	$scope.clear = function(form) {
    $scope.user.email = '';
    $scope.user.username = '';
    $scope.user.password = '';
    form.$setPristine();
  };
  
  $scope.createUser = function(form){
    $scope.create(form.email.$viewValue, form.username.$viewValue,
                  form.password.$viewValue, $scope.user.role.selected.type).then(
                    function (result){
                      $scope.clear(form);
                      $state.go('helpdesk.admin.users', $state.params);
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

adminControllers.controller('UsersListCtrl', function($scope){

});

adminControllers.controller('CreateUserFormCtrl', function($scope){
  $scope.changed = function(filed){
    return filed.$dirty;
  };
});

adminControllers.controller('SchoolsCtrl', function ($scope, Schools, $q) {

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

adminControllers.controller('SchoolsListCtrl', function($scope){

});

adminControllers.controller('CreateSchoolFormCtrl', function($scope){
  $scope.changed = function(filed){
    return filed.$dirty;
  };
});


adminControllers.controller('CreateSchoolCtrl', function ($scope, Auth, $http, $state) {

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
                      $state.go('helpdesk.admin.schools', $state.params);
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