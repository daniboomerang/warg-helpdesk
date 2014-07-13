var wargHelpdeskDirectives = angular.module('wargHelpdeskDirectives', [])


wargHelpdeskDirectives.directive('footer', function() {
  return {
    restrict: 'E',
    templateUrl: '/views/partials/footer.html'
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

wargHelpdeskDirectives.directive('uniqueUsername', function ($http) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        function validate(value) {
          if(!value) {
            ngModel.$setValidity('unique', true);
            return;
          }
          $http.get('/auth/check_username/' + value).success(function(user) {
            if(!user.exists) {
              ngModel.$setValidity('unique', true);
            } else {
              ngModel.$setValidity('unique', false);
            }
          });
        }

        scope.$watch( function() {
          return ngModel.$viewValue;
        }, validate);
      }
    };
  });
