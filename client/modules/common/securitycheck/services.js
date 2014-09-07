'use strict';

var securityCheckServices = angular.module('securityCheckServices', [])

securityCheckServices.factory('SecurityCheckService', function SecurityCheckService($location, $rootScope) {
  
	var UNAUTHORIZED_ERROR = '401 - Authorization Required';

	function passSecurityCheck(module, role){
		if (role == null){
			if (module == 'sign'){
				return true;
			}
			return false;
		}			
		else {
			if ((role != 'admin') && ((module == 'inventory') || (module == 'schools') || (module == 'accounts'))){
				return false;
			}
			return true;
		}
	};

	function parseModule(state){
		var states = state.split(".")
        if ((states.indexOf('sign') > -1)){ return 'sign';}
        else if ((states.indexOf('incidences') > -1)){ return 'incidences';}
        else if ((states.indexOf('inventory') > -1)){ return 'inventory';}
        else if ((states.indexOf('accounts') > -1)){ return 'accounts';}
        else if ((states.indexOf('schools') > -1)){ return 'schools';}
        return undefined;
	};

	function parseAction(state){
		return;
	};

	return {
		init: function() {
	  		$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) { 
	  			var module = parseModule(to.name); 
	  			if (module != undefined){
		  			//var action = parseAction(to.name); 
		  			var role;
		  			if (!$rootScope.currentUser){role = null;}
		  			else {role = $rootScope.currentUser.role;}
		    		if (!passSecurityCheck(module, role)){
		      			$location.path('/');
		    		}
		    		else {
		    		//console.log("Security Check: Success");
		    		}  
		    	}
		    	else{console.log("Security Check: undefined module");}
		  	});
		}
  	}
});


