var schoolsServices = angular.module('schoolsServices', [])

schoolsServices.factory('schoolResourceService', function ($http, $q, $resource){

  var schoolsList = null;

  var resourceService = $resource('api/schools/:schoolId', {
      schoolId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

  return {
  	createSchool : function(code, name, address){
      	var deferred = $q.defer(); 
		var school = new resourceService({
		      code: code,
		      name: name,
		      address: address
		});
		school.$save(function(school) {	      
		      deferred.resolve(school);
		}, function (error){
		      deferred.reject(error);
		});
    	return deferred.promise;
    },
    findSchools : function() {
      	var deferred = $q.defer(); 
      	resourceService.query(function (schools) {
      		schoolsList = schools;
			deferred.resolve(schools);
    	}, function (error){
	    	schoolsList = null;
	    	deferred.reject(error);
	    });
	    return deferred.promise;
    },
    findOne : function(id) {
    	var deferred = $q.defer(); 
     	resourceService.get({
        	schoolId: id
      	}, function (school) {
	 		deferred.resolve(school);
	    }, function (error){
		    deferred.reject(error);
		});
      	return deferred.promise;
    },
    getSchools : function() {
    	return schoolsList;
    }
  };
});
