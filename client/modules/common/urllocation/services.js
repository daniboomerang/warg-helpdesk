'use strict';

var urlLocationServices = angular.module('urlLocationServices', [])

urlLocationServices.factory('LocationService', function LocationService($location, $rootScope) {
   
  var SUBSCRIPTION = 'event:currentLocation-changed';
  var previousState;
  var currentLocation = {};
  var currentState; 
  var currentModule;

  return {

    init: function() {

      var INITIAL_STATE = 'helpdesk.incidences.open.list';

      var activeModule = function(state){
        function capitaliseFirstLetter(module){
            return module.charAt(0).toUpperCase() + module.slice(1);
        }
          var states = state.split(".");
          return capitaliseFirstLetter(states[1]);
      };

      // DEALING WITH A LOCATION SERVICE (Current Location)

      $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
        
        if (from.name == ''){previousState = INITIAL_STATE;}
        else if (previousState != currentState) {previousState = from.name;}
          currentState = to.name;
          currentModule = activeModule(currentState);
          currentState = currentState;
          currentModule = currentModule;
          previousState = previousState;
          currentLocation = {module: currentModule, state: currentState}
        $rootScope.$broadcast('event:currentLocation-changed', currentLocation);
      });
    },
    subscribe: function(){
      return SUBSCRIPTION;
    },
    getPreviousState: function(){
      return previousState;
    },
    getCurrentModule: function(){
      return currentModule;
    },
    getCurrentState: function(){
      return currentState;
    }
  }      
});


