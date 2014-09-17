'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";

var inventoryDomain = require('../domain/inventory-domain');

exports.index = function(req, res) {
  inventoryDomain.listByUserSchool(req.user).then (function (resultList){
    if (resultList.status == RESULT_ERROR){
      res.json(500, resultList.error);
    }  
    else if (resultList.status == RESULT_SUCCESS){
      res.json(resultList.list);
    }
  });
};

