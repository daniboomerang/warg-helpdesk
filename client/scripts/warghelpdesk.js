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
  'duScroll',
  // VENDOR
  'trNgGrid',
  'toaster',
  'angularCharts',
  'googlechart',
  // WARG HELPDESK
  'wargHelpdeskDirectives',
  'wargHelpdeskFilters',
  // MODULES
    // COMMON
    'translation',
    'urlLocation',
    'securityCheck',
    'auth',
    // SUB-SECTIONS
    'sign',
    'helpdesk'
])
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  
    $locationProvider.html5Mode(true);
    $urlRouterProvider.when('/', '/helpdesk');
    $urlRouterProvider.otherwise('/');
  })

.run(function ($rootScope, $location, Auth, LocationService, SecurityCheckService) {

  // INIT COMMON SERVICES
  LocationService.init();
  SecurityCheckService.init();
  // COMMON SERVICES // 
  // SETTING UP TRANSLATION FOR TRNGGRID
  /* TrNgGrid.translations['en'] = translationService.getTranslation('en');
   TrNgGrid.translations['es'] = translationService.getTranslation('es');*/
  // TRNGGRID //

  // Watching the value of the currentUser variable.
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
    /*messengerService.popMessage('error', UNAUTHORIZED_ERROR, 'This operation requires administration permissions.');
    $location.path('/');*/
    $location.path('/sign/in');
    return false;
  });
});
