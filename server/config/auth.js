'use strict';

/**
 *  Route middleware to ensure user is authenticated.
 */
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(401);
}

/**
 * User authorizations routing middleware
 */
exports.userAuthorization = {

  getRights: function(req, res) {

    function getRightsOnHome (role) {  
      return ['dashboard', 'profile'];
    }

    function getRightsOnIncidences (role) {  
      if (role === "user"){
        return ['create', 'view', 'edit', 'rate', 'list'];
      }
        else if (role === "tech"){
        return ['asign', 'accept', 'view', 'edit', 'close', 'list'];
      }  
      else if (role === "admin"){
        return ['create', 'view', 'edit', 'rate', 'list'];
      }  
    }

    function getRightsOnInventory (role) {  
      if (role === "admin"){
        return ['create', 'view', 'edit', 'list'];
      }  
    }

    function getRightsOnReporting (role) {  
      if (role === "admin"){
        return ['expenses', 'effort'];
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

    var role = req.user.role;
    if(role != null){
      var userRights = [];
      var rights = [];        
      var modules = getModules(role); 
      for (var i=0; i<modules.length; i++){
        if (modules[i] == 'Home'){
          rights = getRightsOnHome(role);
          userRights.push({module: 'Home', rights: rights});
        }
        if (modules[i] == 'Incidences'){
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
      return res.json(userRights);
    }
    else {res.send(403);}
  }
}