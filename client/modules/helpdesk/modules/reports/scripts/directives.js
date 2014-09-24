var reportsDirectives = angular.module('reportsDirectives', []);

reportsDirectives.directive('totals', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/helpdesk/modules/reports/views/partials/totals.html'
  };
})

reportsDirectives.directive('sevPriReport', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/helpdesk/modules/reports/views/partials/sev-pri-report.html'
  };
})

reportsDirectives.directive('effortsReport', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/helpdesk/modules/reports/views/partials/efforts-report.html'
  };
});

