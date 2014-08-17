var modulesDomain = require('../domain/modules-domain');
var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";

/**
 * Get user rights
 * requires: {role}
 * returns: {userRights}
 */
exports.modules = function (req, res, next) {
  
  var modulesResult = modulesDomain.getUserModules(req.user.role);
  if (modulesResult.status == RESULT_SUCCESS){return res.json(modulesResult.modules);}
  else {return res.send(403);}  
}