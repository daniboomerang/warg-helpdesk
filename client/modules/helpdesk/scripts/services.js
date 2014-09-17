/*  helpdesk Services */

var helpdeskServices = angular.module('helpdeskServices', [])

helpdeskServices.value('menu', []);

helpdeskServices.service('deskMenuStyleService', function(){
	
	return {
		getStyle : function(module){	
			var style = {};
			var moduleStyle = [];	
			var actionsStyle = [];
		   	if (module == 'Incidences'){
		   		actionsStyle.create = '/modules/helpdesk/images/icons/create-16.png';
		   		actionsStyle.openId = '/modules/helpdesk/images/icons/zoom-16.png';
		   		actionsStyle.openList = '/modules/helpdesk/images/icons/list-16.png';
		   		actionsStyle.statistics = '/modules/helpdesk/images/icons/statistics-16.png';
		   		moduleStyle.image = {'background-image': 'url(/modules/helpdesk/images/icons/incidence-24.png)'};
		   		moduleStyle.active = 'enlarged-active-module arrow-box-yellow';
		   		moduleStyle.color = {'color': '#F4BE6E'};
		   	}	
		   	if (module == 'Inventory'){
				actionsStyle.open = '/modules/helpdesk/images/icons/inventory-16.png';
				actionsStyle.expenses = '/modules/helpdesk/images/icons/coins-16.png';
				moduleStyle.image = {'background-image': 'url(/modules/helpdesk/images/icons/book-24.png)'};
		   		moduleStyle.active = 'enlarged-active-module arrow-box-claret';
		   		moduleStyle.color = {'color': '#B54646'};
		   	}
		   	if (module == 'Schools'){
		   		actionsStyle.create = '/modules/helpdesk/images/icons/create-16.png';
		   		actionsStyle.openCode = '/modules/helpdesk/images/icons/zoom-16.png';
		   		actionsStyle.openList = '/modules/helpdesk/images/icons/list-16.png';
				moduleStyle.image = {'background-image': 'url(/modules/helpdesk/images/icons/school-24.png)'};
		   		moduleStyle.active ='enlarged-active-module arrow-box-purple';
		   		moduleStyle.color = {'color': '#9572A9'};
		   	}
		   	if (module == 'Accounts'){
		   		actionsStyle.create = '/modules/helpdesk/images/icons/create-16.png';
		   		actionsStyle.import = '/modules/helpdesk/images/icons/excel-16.png';
		   		actionsStyle.openList = '/modules/helpdesk/images/icons/list-16.png';
				moduleStyle.image = {'background-image': 'url(/modules/helpdesk/images/icons/accounts-24.png)'};
		   		moduleStyle.active ='enlarged-active-module arrow-box-green';
		   		moduleStyle.color = {'color': '#2e8b57'};
		   	}
		   	style = {moduleStyle: moduleStyle, actionsStyle: actionsStyle};
		   	return style;
		}
	}
});

helpdeskServices.service('helpdeskConfigService', function ($q, $http, menu, deskMenuStyleService, $rootScope){

	function getIncidencesMenu(actionsOnIncidences) {
     	var actions = [];
     	var style = deskMenuStyleService.getStyle('Incidences');
     	var actionsStyle = style.actionsStyle;
     	for (var i=0; i<actionsOnIncidences.length; i++){
     		if (actionsOnIncidences.indexOf(actionsOnIncidences[i]) > -1){
     			if (actionsOnIncidences[i] == 'create')
					actions.push({title: 'Create', state: 'helpdesk.incidences.create', style: actionsStyle.create});
				else if (actionsOnIncidences[i] == 'list')
					actions.push({title: 'List', state: 'helpdesk.incidences.open.list', style: actionsStyle.openList});
				else if (actionsOnIncidences[i] == 'find')
					actions.push({title: 'Id Search', state: 'helpdesk.incidences.open', style: actionsStyle.openId});	
				else if (actionsOnIncidences[i] == 'reporting')
					actions.push({title: 'Statistics', state: 'helpdesk.incidences.statistics', style: actionsStyle.statistics});
			}		
		}
        var menu = {name: 'Incidences', actions: actions, style: style.moduleStyle};
        return menu;
     }

	function getInventoryMenu(actionsOnInventory) {
     	var actions = [];
     	var style = deskMenuStyleService.getStyle('Inventory');
     	var actionsStyle = style.actionsStyle;
     	for (var i=0; i<actionsOnInventory.length; i++){
     		if (actionsOnInventory.indexOf(actionsOnInventory[i]) > -1){
				if (actionsOnInventory[i] == 'list')
					actions.push({title: 'Open', state: 'helpdesk.inventory.index', style: actionsStyle.open});
				else if (actionsOnInventory[i] == 'reporting')
					actions.push({title: 'Expenses', state: 'helpdesk.inventory.expenses', style: actionsStyle.expenses});
			}		
		}
        var menu = {name: 'Inventory', actions: actions, style: style.moduleStyle};
        return menu;
     }

     function getSchoolsMenu(actionsOnSchools) {
     	var actions = [];
     	var style = deskMenuStyleService.getStyle('Schools');
     	var actionsStyle = style.actionsStyle;
     	for (var i=0; i<actionsOnSchools.length; i++){
     		if (actionsOnSchools.indexOf(actionsOnSchools[i]) > -1){
				if (actionsOnSchools[i] == 'create')
					actions.push({title: 'Create', state: 'helpdesk.schools.create.school', style: actionsStyle.create});
				else if (actionsOnSchools[i] == 'find'){
					actions.push({title: 'List', state: 'helpdesk.schools.open', style: actionsStyle.openList});
				}
			}		
		}
        var menu = {name: 'Schools', actions: actions, style: style.moduleStyle};
        return menu;
     }

	function getAccountsMenu(actionsOnAccounts) {
     	var actions = [];
     	var style = deskMenuStyleService.getStyle('Accounts');
     	var actionsStyle = style.actionsStyle;
     	for (var i=0; i<actionsOnAccounts.length; i++){
     		if (actionsOnAccounts.indexOf(actionsOnAccounts[i]) > -1){
				if (actionsOnAccounts[i] == 'create')
					actions.push({title: 'Create', state: 'helpdesk.accounts.create.account', style: actionsStyle.create});
				else if (actionsOnAccounts[i] == 'list')
					actions.push({title: 'List', state: 'helpdesk.accounts.open', style: actionsStyle.openList});
				else if (actionsOnAccounts[i] == 'import')
					actions.push({title: 'Import CSV', state: 'helpdesk.accounts.create.list', style: actionsStyle.import});
			}		
		}
        var menu = {name: 'Accounts', actions: actions, style: style.moduleStyle};
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
