var accountsServices = angular.module('accountsServices', [])

accountsServices.factory('Accounts', function ($resource) {
    return $resource('api/users', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });

accountsServices.factory('schoolsService', function ($http){

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