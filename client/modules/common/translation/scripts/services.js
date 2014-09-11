'use strict';

var translationServices = angular.module('translationServices', ['pascalprecht.translate'])

translationServices.factory('translationService', function ($translate) {
  
  var lang = [
    {key:'en', language: 'English'},
    {key:'es', language: 'Spanish'}
  ];
  
  function searchLanguage(key){
    for (var i=0; i<lang.length; i++){
      if (lang[i].key == key){
        return lang[i];
      }
    }
  }

  var currentLanguage = searchLanguage($translate.preferredLanguage());

  return {
    changeLanguage : function(key) {
      $translate.use(key);
      currentLanguage = searchLanguage(key);
    },
    availableLanguages : function(){
      return lang;
    },
    preferredLanguage : function(){
      return searchLanguage($translate.preferredLanguage());
    },
    currentLanguage : function(){
      return currentLanguage;
    }
  };

});


