'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";

/**
 *  Provides user modules rights and actions from user role
 *  returns a PROMISE with the result
 */

exports.getRightsByRole = function (role) {  
  
  function getRightsOnHome (role) {  
    return ['dashboard', 'profile'];
  }

  function getRightsOnIncidences (role) {  
    if (role === "user"){
      return ['create', 'open', 'rate', 'list'];
    }
      else if (role === "tech"){
      return ['create', 'rate', 'assign', 'open', 'close', 'list'];
    }  
    else if (role === "admin"){
      return ['create', 'assign', 'open', 'rate', 'list'];
    }  
  }

  function getRightsOnInventory (role) {  
    if (role === "admin"){
      return ['create', 'open', 'list', 'delete'];
    }  
  }

  function getRightsOnReporting (role) {  
    if (role === "admin"){
      return ['expenses', 'effort', 'statistics'];
    }  
  }

  function getRightsOnAdvancedSettings (role) {  
    if (role === "admin"){
      return ['users', 'schools'];
    }  
  }

  function getModules (role) {
    if(role === 'user')
      return ['Home', 'Incidences'];
    else if(role === 'tech')
      return ['Home', 'Incidences'];
    else if(role === 'admin')
      return ['Home', 'Incidences', 'Inventory', 'Reporting', 'Admin'];    
  }

  if(role != null){
    var userRights = [];
    var rights = [];        
    var modules = getModules(role); 
    for (var i=0; i<modules.length; i++){
      if (modules[i] == 'Home'){
        rights = getRightsOnHome(role);
        userRights.push({module: 'Home', rights: rights});
      }
      else if (modules[i] == 'Incidences'){
        rights = getRightsOnIncidences(role);
        userRights.push({module: 'Incidences', rights: rights});
      }
      else if(modules[i] == 'Inventory'){
        rights = getRightsOnInventory(role);
        userRights.push({module: 'Inventory', rights: rights});
      }
      else if (modules[i] == 'Reporting'){
        rights = getRightsOnReporting(role);
        userRights.push({module: 'Reporting', rights: rights});
      }
      else if (modules[i] == 'Admin'){
        rights = getRightsOnAdvancedSettings(role);
        userRights.push({module: 'Admin', rights: rights});
      }
    }
    return {status: RESULT_SUCCESS, rights: userRights};
  }
  else return {status: RESULT_ERROR, rights: null}; 
}
