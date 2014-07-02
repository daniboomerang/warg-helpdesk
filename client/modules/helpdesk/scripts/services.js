/*  helpdesk Services */

var helpdeskServices = angular.module('helpdeskServices', ['authServices'])

helpdeskServices.value('menu', []);

helpdeskServices.service('deskMenuStyleService', function(){
	
	return {
		getStyle : function(module){	
			var moduleStyle = [];
			if (module == 'Home'){
		   		moduleStyle.module = {'background-image': 'url(/modules/helpdesk/images/icons/administrator-24.png)'};
		   		moduleStyle.border = {'-webkit-box-shadow': '0px 0px 7px 3px rgba(8,139,148,1)',
									 '-moz-box-shadow': '0px 0px 7px 3px rgba(8,139,148,1)',
									 'box-shadow': '0px 0px 7px 3px rgba(8,139,148,1)'};
		   		moduleStyle.dashboard = '/modules/helpdesk/images/icons/dashboard-16.png';
		   		moduleStyle.profile = '/modules/helpdesk/images/icons/edit-user-16.png';
			}			
		   	if (module == 'Incidences'){
		   		moduleStyle.module = {'background-image': 'url(/modules/helpdesk/images/icons/zoom-24.png)'};
		   		moduleStyle.create = '/modules/helpdesk/images/icons/create-16.png';
		   		moduleStyle.list = '/modules/helpdesk/images/icons/list-16.png';
		   	}	
		   	if (module == 'Reporting'){
		   		moduleStyle.module = {'background-image': 'url(/modules/helpdesk/images/icons/combo-24.png)'};
				moduleStyle.effort = '/modules/helpdesk/images/icons/pie-16.png';
				moduleStyle.expenses = '/modules/helpdesk/images/icons/coins-16.png';
		   	}
		   	if (module == 'Inventory'){
		   		moduleStyle.module = {'background-image': 'url(/modules/helpdesk/images/icons/book-24.png)'};
				moduleStyle.list = '/modules/helpdesk/images/icons/list-16.png';
				moduleStyle.create = '/modules/helpdesk/images/icons/create-16.png';
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

helpdeskServices.service('helpdeskConfigService', function ($q, UserRights, menu, deskMenuStyleService, $rootScope){

     function getHomeMenu(rightsOnHome) {
		var actions = [];
     	var moduleMenuStyle = deskMenuStyleService.getStyle('Home');

     	for (var i=0; i<rightsOnHome.length; i++){
     		if (rightsOnHome.indexOf(rightsOnHome[i]) > -1){
				if (rightsOnHome[i] == 'dashboard')
					actions.push({title: 'Board', state: 'helpdesk.home.dashboard', style: moduleMenuStyle.dashboard});
				else if (rightsOnHome[i] == 'profile')
					actions.push({title: 'Profile', state: 'helpdesk.home.profile', style: moduleMenuStyle.profile});
			}		
		}
        var menu = {module: 'Home', actions: actions, style: moduleMenuStyle.module, border: moduleMenuStyle.border};
        return menu;
     }

	function getIncidencesMenu(rightsOnIncidences) {
     	var actions = [];
     	var moduleMenuStyle = deskMenuStyleService.getStyle('Incidences');
     	for (var i=0; i<rightsOnIncidences.length; i++){
     		if (rightsOnIncidences.indexOf(rightsOnIncidences[i]) > -1){
				if (rightsOnIncidences[i] == 'list')
					actions.push({title: 'List', state: 'helpdesk.incidences.list', style: moduleMenuStyle.list});
				else if (rightsOnIncidences[i] == 'create')
					actions.push({title: 'Create', state: 'helpdesk.incidences.create', style: moduleMenuStyle.create});
			}		
		}
        var menu = {module: 'Incidences', actions: actions, style: moduleMenuStyle.module};
        return menu;
     }
	function getReportingMenu(rightsOnReporting) {
     	var actions = [];
     	var moduleMenuStyle = deskMenuStyleService.getStyle('Reporting');
     	for (var i=0; i<rightsOnReporting.length; i++){
     		if (rightsOnReporting.indexOf(rightsOnReporting[i]) > -1){
				if (rightsOnReporting[i] == 'effort')
					actions.push({title: 'Effort', state: 'helpdesk.reporting.effort', style: moduleMenuStyle.effort});
				else if (rightsOnReporting[i] == 'expenses')
					actions.push({title: 'Expenses', state: 'helpdesk.reporting.expenses', style: moduleMenuStyle.expenses});
			}		
		}
        var menu = {module: 'Reporting', actions: actions, style: moduleMenuStyle.module};
        return menu;
     }

	function getInventoryMenu(rightsOnInventory) {
     	var actions = [];
     	var moduleMenuStyle = deskMenuStyleService.getStyle('Inventory');
     	for (var i=0; i<rightsOnInventory.length; i++){
     		if (rightsOnInventory.indexOf(rightsOnInventory[i]) > -1){
				if (rightsOnInventory[i] == 'list')
					actions.push({title: 'List', state: 'helpdesk.inventory.list', style: moduleMenuStyle.list});
				else if (rightsOnInventory[i] == 'create')
					actions.push({title: 'Create', state: 'helpdesk.inventory.create', style: moduleMenuStyle.create});
			}		
		}
        var menu = {module: 'Inventory', actions: actions, style: moduleMenuStyle.module};
        return menu;
     }

     function getAdminMenu(rightsOnAdvancedSettings) {
     	var actions = [];
     	var moduleMenuStyle = deskMenuStyleService.getStyle('Admin');
     	for (var i=0; i<rightsOnAdvancedSettings.length; i++){
     		if (rightsOnAdvancedSettings.indexOf(rightsOnAdvancedSettings[i]) > -1){
				if (rightsOnAdvancedSettings[i] == 'users')
					actions.push({title: 'Users', state: 'helpdesk.admin.users', style: moduleMenuStyle.users});
				else if (rightsOnAdvancedSettings[i] == 'schools')
					actions.push({title: 'Schools', state: 'helpdesk.admin.schools', style: moduleMenuStyle.schools});
			}		
		}
        var menu = {module: 'Admin', actions: actions, style: moduleMenuStyle.module};
        return menu;
     }

    function setupMenu(rights) {
    	var menu = [];
     	for (var i=0; i<rights.length; i++){
     		if (rights[i].module == 'Home'){
     			menu.push(getHomeMenu(rights[i].rights));
     		}
     		if (rights[i].module == 'Incidences'){
     			menu.push(getIncidencesMenu(rights[i].rights));
     		}
     		else if(rights[i].module == 'Inventory'){
     			menu.push(getInventoryMenu(rights[i].rights));
     		}
     		else if (rights[i].module == 'Reporting'){
     			menu.push(getReportingMenu(rights[i].rights));
     		}
     		else if (rights[i].module == 'Admin'){
     			menu.push(getAdminMenu(rights[i].rights));
     		}
		}
		return menu;
    } 

	return{
		setupDesk : function(){	
		    var deferred = $q.defer(); 		
		    UserRights.getRights().then(function(rights) {
		    	// Now that we have all the modules and right over the modules for the current user we can create our Menu
		    	menu = setupMenu(rights);
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