'use strict';

var incidencesServices = angular.module('incidencesServices', ['deskServices', 'ngResource'])

incidencesServices.value('incidencesConfig', {});

incidencesServices.factory('Incidences', function ($resource) {
    return $resource('api/incidences/:incidenceId', {
      incidenceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });

incidencesServices.service('incidencesConfigService', function (deskConfigService, incidencesConfig){
	
	function createIncidencesMenu(userRights) {
		var menu = [];
     	var action = [];

     	for (var i=0; i<userRights.length; i++){
     		if (userRights.indexOf(userRights[i]) > -1){
     			if (userRights[i] == 'dashboard')
					action.push({title: 'Dashboard', state: 'incidences.dashboard'});
				else if (userRights[i] == 'list')
					action.push({title: 'My Incidences', state: 'incidences.list'});
				else if (userRights[i] == 'list.all')
					action.push({title: 'Show All', state: 'incidences.list.all'});
				else if (userRights[i] == 'create')
					action.push({title: 'Open Incidence', state: 'incidences.create'});	
			}		
		}

        menu.push({title: 'Box', action: action});

        return menu;
     }

	return{
		init : function(userRights){
			// First we set up the current user rights for module incidences
			incidencesConfig.userRights = userRights;
			// Second we configure our Asset DESK to hold Incidences Module
			deskConfigService.setMenu(createIncidencesMenu(userRights));
		},

		getUserRigths : function (){
			return incidencesConfig.userRights;
		}
	}
});


