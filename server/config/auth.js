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

  getModules: function(req, res) {

    if (req.user.role != null){
      if(req.user.role === 'user')
        return res.json({modules: ['Incidences']});
      else if(req.user.role === 'tech')
        return res.json({modules: ['Incidences']});
      else if(req.user.role === 'admin')
        return res.json({modules: ['Incidences', 'Inventory', 'Reporting', 'Advanced Settings']});   
    }
    res.send(403);    
  },
  getRightsOnIncidences: function(req, res) {
    if (req.user != null){
      if (req.user.role === "user"){
        return res.json(['create', 'edit', 'rate', 'list', 'dashboard']);
      }
        else if (req.user.role === "tech"){
        return res.json(['asign', 'accept', 'edit', 'close', 'list', 'list.all', 'dashboard']);
      }  
      else if (req.user.role === "admin"){
        return res.json(['create', 'edit', 'rate', 'list', 'list.all', 'dashboard']);
      }  
    }
    else {res.send(403);}
  }
}