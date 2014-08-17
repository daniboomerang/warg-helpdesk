'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";
var ROLE_USER = "user";
var ROLE_TECH = "tech";
var ROLE_ADMIN = "admin";

/**
 *  Provides user modules rights and actions from user role
 *  returns a PROMISE with the result
 */

exports.getUserModules = function (role) {  

  function getActionsOnIncidences (role) {  
    if (role === ROLE_USER){
      return ['create', 'open', 'list'];
    }
      else if (role === ROLE_TECH){
      return ['create', 'open', 'list'];
    }  
    else if (role === ROLE_ADMIN){
      return ['create', 'open', 'list', 'reporting'];
    }  
  }

  function getActionsOnInventory (role) {  
    if (role === ROLE_ADMIN){
      return ['open', 'reporting'];
    }  
  }

  function getActionsOnAdvancedSettings (role) {  
    if (role === ROLE_ADMIN){
      return ['users', 'schools'];
    }  
  }

  function getModules (role) {
    if(role === ROLE_USER)
      return ['Incidences'];
    else if(role === ROLE_TECH)
      return ['Incidences'];
    else if(role === ROLE_ADMIN)
      return ['Incidences', 'Inventory', 'Admin'];    
  }

  if(role != null){
    var userModules = [];
    var actions = [];        
    var modules = getModules(role); 
    for (var i=0; i<modules.length; i++){
      if (modules[i] == 'Home'){
        actions = getActionsOnHome(role);
        userModules.push({module: 'Home', actions: actions});
      }
      else if (modules[i] == 'Incidences'){
        actions = getActionsOnIncidences(role);
        userModules.push({module: 'Incidences', actions: actions});
      }
      else if(modules[i] == 'Inventory'){
        actions = getActionsOnInventory(role);
        userModules.push({module: 'Inventory', actions: actions});
      }
      else if (modules[i] == 'Admin'){
        actions = getActionsOnAdvancedSettings(role);
        userModules.push({module: 'Admin', actions: actions});
      }
    }
    return {status: RESULT_SUCCESS, modules: userModules};
  }
  else return {status: RESULT_ERROR, modules: null}; 
}
