/*  helpdesk Services */

var helpdeskServices = angular.module('helpdeskServices', [])

helpdeskServices.service('helpdeskContentLoader', function ($rootScope) {

  return {

    loadContentUrl : function(contentUrl) {
      $rootScope.$broadcast('contentUrlChanged', contentUrl);
    }
  }; 

});  