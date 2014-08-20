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
		   	if (module == 'Schools'){
		   		moduleStyle.module = {'background-image': 'url(/modules/helpdesk/images/icons/school-24.png)'};
		   		moduleStyle.create = '/modules/helpdesk/images/icons/create-16.png';
		   		moduleStyle.openCode = '/modules/helpdesk/images/icons/zoom-16.png';
		   		moduleStyle.openList = '/modules/helpdesk/images/icons/list-16.png';
		   	}
		   	if (module == 'Accounts'){
		   		moduleStyle.module = {'background-image': 'url(/modules/helpdesk/images/icons/accounts-24.png)'};
		   		moduleStyle.create = '/modules/helpdesk/images/icons/create-16.png';
		   		moduleStyle.import = '/modules/helpdesk/images/icons/excel-16.png';
		   		moduleStyle.openList = '/modules/helpdesk/images/icons/list-16.png';
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
     			if (actionsOnIncidences[i] == 'create')
					actions.push({title: 'Create', state: 'helpdesk.incidences.create', style: moduleMenuStyle.create});
				else if (actionsOnIncidences[i] == 'list')
					actions.push({title: 'List', state: 'helpdesk.incidences.open.list', style: moduleMenuStyle.openList});
				else if (actionsOnIncidences[i] == 'find')
					actions.push({title: 'Id Search', state: 'helpdesk.incidences.open', style: moduleMenuStyle.openId});	
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
				if (actionsOnInventory[i] == 'list')
					actions.push({title: 'Open', state: 'helpdesk.inventory.open', style: moduleMenuStyle.open});
				else if (actionsOnInventory[i] == 'reporting')
					actions.push({title: 'Expenses', state: 'helpdesk.inventory.expenses', style: moduleMenuStyle.expenses});
			}		
		}
        var menu = {module: 'Inventory', actions: actions, style: moduleMenuStyle.module};
        return menu;
     }

     function getSchoolsMenu(actionsOnSchools) {
     	var actions = [];
     	var moduleMenuStyle = deskMenuStyleService.getStyle('Schools');
     	for (var i=0; i<actionsOnSchools.length; i++){
     		if (actionsOnSchools.indexOf(actionsOnSchools[i]) > -1){
				if (actionsOnSchools[i] == 'create')
					actions.push({title: 'Create', state: 'helpdesk.schools.create.school', style: moduleMenuStyle.create});
				else if (actionsOnSchools[i] == 'find'){
					actions.push({title: 'List', state: 'helpdesk.schools.open.list', style: moduleMenuStyle.openList});
				}
			}		
		}
        var menu = {module: 'Schools', actions: actions, style: moduleMenuStyle.module};
        return menu;
     }

	function getAccountsMenu(actionsOnAccounts) {
     	var actions = [];
     	var moduleMenuStyle = deskMenuStyleService.getStyle('Accounts');
     	for (var i=0; i<actionsOnAccounts.length; i++){
     		if (actionsOnAccounts.indexOf(actionsOnAccounts[i]) > -1){
				if (actionsOnAccounts[i] == 'create')
					actions.push({title: 'Create', state: 'helpdesk.accounts.create.account', style: moduleMenuStyle.create});
				else if (actionsOnAccounts[i] == 'list')
					actions.push({title: 'List', state: 'helpdesk.accounts.open.list', style: moduleMenuStyle.openList});
				else if (actionsOnAccounts[i] == 'import')
					actions.push({title: 'Import Excel', state: 'helpdesk.accounts.create.list', style: moduleMenuStyle.import});
			}		
		}
        var menu = {module: 'Accounts', actions: actions, style: moduleMenuStyle.module};
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
     		else if (modules[i].module == 'Schools'){
     			menu.push(getSchoolsMenu(modules[i].actions));
     		}
     		else if (modules[i].module == 'Accounts'){
     			menu.push(getAccountsMenu(modules[i].actions));
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
