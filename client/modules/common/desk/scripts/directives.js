angular.module('desk').directive('menu', function() {
    return {
      restrict: 'E',
      templateUrl: '/modules/common/desk/views/menu.html'
    };
  })

angular.module('desk').directive('content', function() {
    return {
      restrict: 'E',
      templateUrl: '/modules/common/desk/views/content.html'
    };
  })

angular.module('desk').directive('desk', function() {
    return {
      restrict: 'E',
      templateUrl: '/modules/common/desk/views/desk.html'
    };
  })