/*  helpdesk Services */

var helpdeskServices = angular.module('helpdeskServices', [])

helpdeskServices.value('menu', []);

helpdeskServices.service('deskMenuStyleService', function(){
	
	return {
		getStyle : function(module){	
			var moduleStyle = [];	
		   	if (module == 'Incidences'){
		   		moduleStyle.module = {'background-image': 'url(/modules/helpdesk/images/icons/incidence-24.png)'};
		   		moduleStyle.create = '/modules/helpdesk/images/icons/create-16.png';
		   		moduleStyle.openId = '/modules/helpdesk/images/icons/zoom-16.png';
		   		moduleStyle.openList = '/modules/helpdesk/images/icons/list-16.png';
		   		moduleStyle.statistics = '/modules/helpdesk/images/icons/statistics-16.png';

		   	}	
		   	if (module == 'Inventory'){
		   		moduleStyle.module = {'background-image': 'url(/modules/helpdesk/images/icons/book-24.png)'};
				moduleStyle.open = '/modules/helpdesk/images/icons/inventory-16.png';
				moduleStyle.expenses = '/modules/helpdesk/images/icons/coins-16.png';
				
		   	}
		   	if (module == 'Admin'){
		   		moduleStyle.module = {'background-image': 'url(/modules/helpdesk/images/icons/settings-24.png)'};
		   		moduleStyle.schools = '/modules/helpdesk/images/icons/school-16.png';
		   		moduleStyle.users = '/modules/helpdesk/images/icons/conference-16.png';
		   	}
		   	return moduleStyle;
		}
	}
});

helpdeskServices.service('helpdeskConfigService', function ($q, $http, menu, deskMenuStyleService, $rootScope){

	function getIncidencesMenu(actionsOnIncidences) {
     	var actions = [];
     	var moduleMenuStyle = deskMenuStyleService.getStyle('Incidences');
     	for (var i=0; i<actionsOnIncidences.length; i++){
     		if (actionsOnIncidences.indexOf(actionsOnIncidences[i]) > -1){
				if (actionsOnIncidences[i] == 'open'){
					actions.push({title: 'Id Search', state: 'helpdesk.incidences.open', style: moduleMenuStyle.openId});
					actions.push({title: 'List', state: 'helpdesk.incidences.open.list', style: moduleMenuStyle.openList});
				}	
				else if (actionsOnIncidences[i] == 'create')
					actions.push({title: 'Create', state: 'helpdesk.incidences.create', style: moduleMenuStyle.create});
				else if (actionsOnIncidences[i] == 'reporting')
					actions.push({title: 'Statistics', state: 'helpdesk.incidences.statistics', style: moduleMenuStyle.statistics});
			}		
		}
        var menu = {module: 'Incidences', actions: actions, style: moduleMenuStyle.module};
        return menu;
     }

	function getInventoryMenu(actionsOnInventory) {
     	var actions = [];
     	var moduleMenuStyle = deskMenuStyleService.getStyle('Inventory');
     	for (var i=0; i<actionsOnInventory.length; i++){
     		if (actionsOnInventory.indexOf(actionsOnInventory[i]) > -1){
				if (actionsOnInventory[i] == 'open')
					actions.push({title: 'Open', state: 'helpdesk.inventory.open', style: moduleMenuStyle.open});
				else if (actionsOnInventory[i] == 'reporting')
					actions.push({title: 'Expenses', state: 'helpdesk.inventory.expenses', style: moduleMenuStyle.expenses});
			}		
		}
        var menu = {module: 'Inventory', actions: actions, style: moduleMenuStyle.module};
        return menu;
     }

     function getAdminMenu(actionsOnAdvancedSettings) {
     	var actions = [];
     	var moduleMenuStyle = deskMenuStyleService.getStyle('Admin');
     	for (var i=0; i<actionsOnAdvancedSettings.length; i++){
     		if (actionsOnAdvancedSettings.indexOf(actionsOnAdvancedSettings[i]) > -1){
				if (actionsOnAdvancedSettings[i] == 'users')
					actions.push({title: 'Users', state: 'helpdesk.admin.users', style: moduleMenuStyle.users});
				else if (actionsOnAdvancedSettings[i] == 'schools')
					actions.push({title: 'Schools', state: 'helpdesk.admin.schools', style: moduleMenuStyle.schools});
			}		
		}
        var menu = {module: 'Admin', actions: actions, style: moduleMenuStyle.module};
        return menu;
     }

    function setupMenu(modules) {
    	var menu = [];
     	for (var i=0; i<modules.length; i++){
     		if (modules[i].module == 'Incidences'){
     			menu.push(getIncidencesMenu(modules[i].actions));
     		}
     		else if(modules[i].module == 'Inventory'){
     			menu.push(getInventoryMenu(modules[i].actions));
     		}
     		else if (modules[i].module == 'Admin'){
     			menu.push(getAdminMenu(modules[i].actions));
     		}
		}
		return menu;
    } 

	return{
		setupDesk : function(){	

			function userModules() {
			      var deferred = $q.defer();
			      $http.get('/api/modules').success(function(data) {
			        var actions = data.actions
			        deferred.resolve(data);
			      }).error(function() {
			        deferred.reject();
			      });
			      return deferred.promise;
			};

		    var deferred = $q.defer(); 		
		    userModules().then(function(modules) {
		    	// Now that we have all the modules and right over the modules for the current user we can create our Menu
		    	menu = setupMenu(modules);
		    	// Finally, when the menu is created we trigger the .then of the promise
		    	deferred.resolve();
		    });
		    return deferred.promise;
		},
		getMenu : function(){
			return menu;
		}
	}
});

helpdeskServices.factory('notificationService', function ($http, $q){
	return {
		getNotifications : function() {
			var deferred = $q.defer(); 
		  		$http.get('/api/notifications').success(function(notifications) {
		    		return deferred.resolve(notifications);
		  		}).error(function() {
		    		console.log("Error retrieving the user notifications")
		  		});
		  	return deferred.promise;
		}
	};
});
