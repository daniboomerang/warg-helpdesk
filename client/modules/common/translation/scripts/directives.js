var translationDirectives = angular.module('translationDirectives', []);
translationDirectives.directive('languageSelector', function() {
  return {
    restrict: 'E',
    templateUrl: '/modules/common/translation/views/lang-selector.html'
  };
});