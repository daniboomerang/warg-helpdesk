'use strict';

var commonServices = angular.module('commonServices', [])

commonServices.factory('techniciansService', function ($http){

  var techsList = [];

  return {
    initTechList : function() {
      $http.get('/api/techs').success(function(list) {
        techsList = list;
      }).error(function() {
        console.log("Error retrieving technicians list")
      });
    },
    getTechList: function() {
      return techsList;
    }
  };
});

/*commonServices.factory('schoolsService', function ($http){

  var schoolsList = [];

  return {
    initSchoolsList : function() {
      $http.get('/api/schools').success(function(list) {
        schoolsList = list;
        return schoolsList;
      }).error(function() {
        console.log("Error retrieving schools list")
      });
    },
    getSchoolsList: function() {
      return schoolsList;
    }
  };
});


commonServices.factory('schoolsServicet', function ($http){

  return {
    getSchools : function() {
      $http.get('/api/schools').success(function(list) {
        return list;
      }).error(function() {
        console.log("Error retrieving schools list")
      });
    }
  };
});

*/

commonServices.factory('schoolsService', function ($http, $q){
  return {
    getSchools : function() {
      var deferred = $q.defer(); 
          $http.get('/api/schools').success(function(schools) {
            return deferred.resolve(schools);
          }).error(function() {
            console.log("Error retrieving the schools")
          });
        return deferred.promise;
    }
  };
});



