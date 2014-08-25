var helpdeskDirectives = angular.module('helpdeskDirectives', []);

helpdeskDirectives.directive('menu', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/helpdesk/views/partials/menu.html'
  };
})

helpdeskDirectives.directive('content', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/helpdesk/views/partials/content.html'
  };
})

helpdeskDirectives.directive('navbar', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/helpdesk/views/partials/navbar.html'
  };
});

wargHelpdeskDirectives.directive('footer', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/helpdesk/views/partials/footer.html'
  };
});

helpdeskDirectives.directive('helpdesk', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/helpdesk/views/helpdesk.html'
  };
})

