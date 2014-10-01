'use strict';

var Q = require('q');
var _User, mongoose, ObjectId;

module.exports = function(User){
  mongoose = require('mongoose');
  ObjectId = mongoose.Types.ObjectId;
  _User = User || mongoose.model('User');

  return {
    findUser: Q.nbind(_User.findOne, _User),
    checkCurrentPassword: syncToPromise(_checkCurrentPassword),
    changePassword: _changePassword
  }
};

var _checkCurrentPassword = function(oldPass, user){
  var matches = user.checkPassword(oldPass);
  if (!matches) throw "password.not.matching";
  return user;
};

var _changePassword = function(newPass, user){
  user.password = newPass;
  return Q.mcall(user, "save");
};

var syncToPromise = function(fn) {
  return function(){
    var deferred = Q.defer();
    try {
      deferred.resolve(fn.apply(this, arguments));
    } catch (err) {
      deferred.reject(err);
    }
    return deferred.promise;
  }
};

