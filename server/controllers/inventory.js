'use strict';

var RESULT_SUCCESS = "SUCCESS";
var RESULT_ERROR = "ERROR";

var inventoryDomain = require('../domain/inventory-domain');

exports.index = function(req, res) {
  inventoryDomain.listByUserSchool(req.user)
  .then((new ResponseBuilder(res)).build);
};

exports.disable = function(req, res){
  inventoryDomain.disableItem(req.params.inventoryId)
  .then((new ResponseBuilder(res)).build);
};

var ResponseBuilder = function(res){
  return {
    build: function(result){
      if (result.status == RESULT_ERROR){
        res.json(500, result.error);
      }  
      else if (result.status == RESULT_SUCCESS){
        res.json(result.data);
      }
    }
  }
};

