var wargHelpdeskDirectives = angular.module('wargHelpdeskDirectives', [])


wargHelpdeskDirectives.directive('footer', function() {
  return {
    restrict: 'E',
    templateUrl: '/views/partials/footer.html'
  };
});

wargHelpdeskDirectives.directive('navbar', function() {
  return {
    restrict: 'E',
    templateUrl: '/views/partials/navbar.html'
  };
});

wargHelpdeskDirectives.directive('mongooseError', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      element.on('keydown', function() {
        return ngModel.$setValidity('mongoose', true);
      });
    }
  };
});


wargHelpdeskDirectives
  .constant('focusConfig', {
    focusClass: 'focused'
  })

  .directive('onFocus', function (focusConfig) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$focused = false;
        element
          .bind('focus', function(evt) {
            element.addClass(focusConfig.focusClass);
            scope.$apply(function() {ngModel.$focused = true;});
          })
          .bind('blur', function(evt) {
            element.removeClass(focusConfig.focusClass);
            scope.$apply(function() {ngModel.$focused = false;});
          });
      }
    }
  });