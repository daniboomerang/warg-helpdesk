'use strict';

var commonServices = angular.module('commonServices', [])

commonServices.factory('techniciansService', function ($http, $q){

  var technicians = null;

  return {
    retrieveTechnicians : function() {
      var deferred = $q.defer(); 
      $http.get('/api/techs').success(function(techniciansList) {
        technicians = techniciansList;
        return deferred.resolve(techniciansList);
        }).error(function() {
          console.log("Error retrieving technicians list")
        });
      return deferred.promise;
    },
    getTechnicians : function() {
      return technicians;
    }
  };
});

commonServices.factory('schoolsService', function ($http, $q){

  var schools = null;

  return {
    retrieveSchools : function() {
      var deferred = $q.defer(); 
      $http.get('/api/schools').success(function(schoolsList) {
        schools = schoolsList;
        return deferred.resolve(schoolsList);
        }).error(function() {
        console.log("Error retrieving the schools")
        });
      return deferred.promise;
    },
    getSchools : function() {
      return schools;
    }
  };
});



