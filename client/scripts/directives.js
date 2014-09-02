var wargHelpdeskDirectives = angular.module('wargHelpdeskDirectives', [])

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


wargHelpdeskDirectives.directive('uniqueSchoolCode', function ($http) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        function validate(value) {
          if(!value) {
            ngModel.$setValidity('unique', true);
            return;
          }
          $http.get('/schools/check_schoolcode/' + value).success(function (school) {
            if(!school.exists) {
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

wargHelpdeskDirectives.directive('uniqueIncidenceId', function ($http) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        function validate(value) {
          if(!value) {
            ngModel.$setValidity('nonexistent', true);
            return;
          }
          $http.get('/api/incidences/' + value).success(function (result) {
            ngModel.$setValidity('nonexistent', true);
          }).error(function (err){
            ngModel.$setValidity('nonexistent', false);
          });
        }

        scope.$watch( function() {
          return ngModel.$viewValue;
        }, validate);
      }
    };
  });