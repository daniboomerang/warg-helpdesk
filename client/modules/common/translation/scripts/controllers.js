'use strict';

var translationControllers = angular.module('translationControllers', [])

translationControllers.controller('TranslationCtrl', function ($scope, translationService) {
  
  init();

  $scope.changeLanguage = function(languageObject){
    translationService.changeLanguage(languageObject.lang.key);
    $scope.currentLanguageObject = createLanguageObject(translationService.currentLanguage());
  }
  function init(){  

    $scope.flagSrcPath = '/modules/common/translation/flags/ico/';
    $scope.availableObjectLanguages = [];
    for (var i=0; i<translationService.availableLanguages().length; i++){
      $scope.availableObjectLanguages.push(createLanguageObject(translationService.availableLanguages()[i]));  
    }
    
    $scope.currentLanguageObject = createLanguageObject(translationService.currentLanguage());
    
  }

  function createLanguageObject(language){
    var languageObject = {};
    languageObject.lang = language;
    languageObject.src = $scope.flagSrcPath + language.key + '.ico';
    return languageObject;
  }

});
