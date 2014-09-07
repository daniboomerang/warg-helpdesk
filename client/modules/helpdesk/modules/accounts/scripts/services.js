var accountsServices = angular.module('accountsServices', [])

accountsServices.factory('accountResourceService', function ($http, $q, $resource, $rootScope){

	var accountsList = null;

	/* PRE: accountsList != null */
	function filterTechnicians(){
		var techniciansList = []
		for (var i=0; i < accountsList.length; i++){
			if (accountsList[i].role = "tech"){
				techniciansList.push(accountsList[i]);
			}
		}
		return techniciansList;
	};

	var resourceService = $resource('api/users/:userId', {
	  userId: '@_id'
	}, {
	  update: {
	    method: 'PUT'
	  }
	});  

	var resourceServiceTechnicians = $resource('api/users/technicians', {
	  userId: '@_id'
	}, {
	  update: {
	    method: 'PUT'
	  }
    });

  return {
  	createAccount : function(email, username, password, role, school){
      	var deferred = $q.defer(); 
		var account = new resourceService({
		    email: email,
	      	username: username,
	      	password: password,
	      	role: role,
	      	school: school  
		});
		account.$save(function(account) {	      
		      deferred.resolve(account);
		}, function (error){
		      deferred.reject(error);
		});
    	return deferred.promise;
    },
    findAccounts : function() {
      	var deferred = $q.defer(); 
      	resourceService.query(function (accounts) {
      		accountsList = accounts;
			deferred.resolve(accounts);
    	}, function (error){
	    	accountsList = null;
	    	deferred.reject(error);
	    });
	    return deferred.promise;
    },
    findOne : function(id) {
    	var deferred = $q.defer(); 
     	resourceService.get({
        	userId: id
      	}, function (account) {
	 		deferred.resolve(account);
	    }, function (error){
		    deferred.reject(error);
		});
      	return deferred.promise;
    },
    findTechnicians : function() {
      	var deferred = $q.defer(); 
      	resourceServiceTechnicians.query(function (accounts) {
      		accountsList = accounts;
			deferred.resolve(filterTechnicians());
    	}, function (error){
	    	accountsList = null;
	    	deferred.reject(error);
	    });
	    return deferred.promise;
    },
    getTechnicians : function() {
    	if (accountsList == null){
    		return null;
    	}
    	return filterTechnicians();
    }
  };
});