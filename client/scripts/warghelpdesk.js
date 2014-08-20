'use strict';

angular.module('wargHelpdeskApp', [
  // NG 
  'ui.router',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'http-auth-interceptor',
  'ui.bootstrap',
  'ngMessages',
  'ui.select',
  // VENDOR
  'trNgGrid',
  // WARG HELPDESK
  'wargHelpdeskControllers',
  'wargHelpdeskDirectives',
  // MODULES
  'auth',
  'sign',
  'helpdesk',
  'inventory',
  'accounts'
])
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  
    $locationProvider.html5Mode(true);
    $urlRouterProvider.when('/', '/helpdesk');
    $urlRouterProvider.otherwise('/');
  })

  .run(function ($rootScope, $location, Auth) {

    //watching the value of the currentUser variable.
    $rootScope.$watch('currentUser', function(currentUser) {
      // if no currentUser and on a page that requires authorization then try to update it
      // will trigger 401s if user does not have a valid session
      if (!currentUser && (['/', '/sign/in'].indexOf($location.path()) == -1 )) {
        Auth.currentUser();
      }
      $rootScope.$broadcast('event:currentUser-changed');
    });

    // On catching 401 errors, redirect to the login page.
    $rootScope.$on('event:auth-loginRequired', function() {
      $location.path('/sign');
      return false;
    });
  });