var rightsDomain = require('../domain/rights-domain');
var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";

/**
 * Get user rights
 * requires: {role}
 * returns: {userRights}
 */
exports.rights = function (req, res, next) {
  
  var rightsResult = rightsDomain.getRightsByRole(req.user.role);
  if (rightsResult.status == RESULT_SUCCESS){return res.json(rightsResult.rights);}
  else {return res.send(403);}  
}