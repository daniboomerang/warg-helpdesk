'use strict';

angular.module('wargHelpdeskApp')
  .controller('MainCtrl', function ($scope, $rootScope, $location) {
  	if ($rootScope.currentUser != null && $rootScope.currentUser.role != null){
  		$location.url('/helpdesk/' + $rootScope.currentUser.username);
  	}
    /*    else if ($rootScope.currentUser != null && $rootScope.currentUser.role != null && $rootScope.currentUser.role == 'user'){
      $location.url('/user/home');
    }
  	else if ($rootScope.currentUser != null && $rootScope.currentUser.role != null && $rootScope.currentUser.role == 'admin'){
  		$location.url('/admin/home');
  	}*/
  });
