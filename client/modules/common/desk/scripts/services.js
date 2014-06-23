/*  desk Services */

var deskServices = angular.module('deskServices', [])

deskServices.value('deskConfig', {});

deskServices.factory('deskConfigService', function (deskConfig){
	
	return {
		setMenu : function(menu) {
			deskConfig.menu = menu;
		},
		getMenu : function() {
			return deskConfig.menu;
		}
	}	
});

