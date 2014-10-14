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
          $http.get('/api/users/username/' + value).success(function(user) {
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
          $http.get('/api/schools/code/' + value).success(function (school) {
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

wargHelpdeskDirectives.directive('validIncidenceId', function ($http) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        var currentIncidenceId = scope.$parent.close.incidence.id;
        function validate(value) {
          if(!value) {
            ngModel.$setValidity('nonexistent', true);
            ngModel.$setValidity('nonitself', true);
            return;
          }
          if (currentIncidenceId == value){
            ngModel.$setValidity('nonexistent', true);
            ngModel.$setValidity('nonitself', false);
            return;
          }
          $http.get('/api/incidences/' + value).success(function (result) {
            ngModel.$setValidity('nonexistent', true);
            ngModel.$setValidity('nonitself', true);
          }).error(function (err){
            ngModel.$setValidity('nonexistent', false);
            ngModel.$setValidity('nonitself', true);
          });
        }

        scope.$watch( function() {
          return ngModel.$viewValue;
        }, validate);
      }
    };
  });


wargHelpdeskDirectives.directive('incidenceExists', function ($http) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModel) {
        var currentIncidenceId = scope.$parent.close.incidence.id;
        function validate(value) {
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