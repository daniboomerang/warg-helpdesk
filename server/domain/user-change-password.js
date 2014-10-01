'use strict';

module.exports = UserChangePassword;

var _userId, 
    _oldPass,
    _newPass;

var UsersRepo = require('./users-repo');
var usersRepo;

function UserChangePassword(theUserId, theOldPass, theNewpass, theUsersRepo){
  usersRepo = theUsersRepo || new UsersRepo();
  _userId = theUserId;
  _oldPass = theOldPass;
  _newPass = theNewpass;

  this.change = _change;
};

var _change = function(){
  var changePromise = usersRepo.findUser({_id: _userId})
    // .then(usersRepo.checkCurrentPassword.bind({}, _oldPass))
    .then(usersRepo.changePassword.bind({}, _newPass));

  return changePromise;
};