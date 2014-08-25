var incidencesDirectives = angular.module('incidencesDirectives', []);

incidencesDirectives.directive('rate', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/incidences/views/partials/rate.html'
  };
})

incidencesDirectives.directive('assign', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/incidences/views/partials/assign.html'
  };
})


incidencesDirectives.directive('effort', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/incidences/views/partials/effort.html'
  };
})

incidencesDirectives.directive('reply', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/incidences/views/partials/reply.html'
  };
})