'use strict';

angular.module('wargHelpdeskApp')
.config(function($translateProvider, translations_en, translations_es){
  $translateProvider.translations('en', translations_en);
  $translateProvider.translations('es', translations_es);
  $translateProvider.preferredLanguage('es');
});
