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

commonServices.factory('schoolsService', function ($http){

  var schoolsList = [];

  return {
    initSchoolsList : function() {
      $http.get('/api/schools').success(function(list) {
        schoolsList = list;
      }).error(function() {
        console.log("Error retrieving schools list")
      });
    },
    getSchoolsList: function() {
      return schoolsList;
    }
  };
});


