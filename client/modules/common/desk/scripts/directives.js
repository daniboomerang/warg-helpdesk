var deskDirectives = angular.module('deskDirectives', []);

deskDirectives.directive('menusimple', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/common/desk/views/menu-simple.html'
  };
})

deskDirectives.directive('desksimple', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/common/desk/views/desk-simple.html'
  };
})

deskDirectives.directive('menuaccordion', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/common/desk/views/menu-accordion.html'
  };
})

deskDirectives.directive('deskaccordion', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/common/desk/views/desk-accordion.html'
  };
})

deskDirectives.directive('content', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/common/desk/views/content.html'
  };
})
