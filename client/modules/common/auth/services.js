'use strict';

var authServices = angular.module('authServices', ['ngResource', 'ngCookies'])

authServices.factory('Auth', function Auth($location, $rootScope, Session, User, $cookieStore) {
    $rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');

    return {

      login: function(provider, user, callback) {
        var cb = callback || angular.noop;
        Session.save({
          provider: provider,
          email: user.email,
          password: user.password,
          rememberMe: user.rememberMe
        }, function(user) {
          $rootScope.currentUser = user;
          return cb();
        }, function(err) {
          return cb(err.data);
        });
      },

      logout: function(callback) {
        var cb = callback || angular.noop;
        Session.delete(function(res) {
            $rootScope.currentUser = null;
            return cb();
          },
          function(err) {
            return cb(err.data);
          });
      },

      createUser: function(userinfo, callback) {
        var cb = callback || angular.noop;
        User.save(userinfo,
          function(user) {
            $rootScope.currentUser = user;
            return cb();
          },
          function(err) {
            return cb(err.data);
          });
      },

      currentUser: function() {
        Session.get(function(user) {
          $rootScope.currentUser = user;
        });
      },

      changePassword: function(email, oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;
        User.update({
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
            console.log('password changed');
            return cb();
        }, function(err) {
            return cb(err.data);
        });
      },

      removeUser: function(email, password, callback) {
        var cb = callback || angular.noop;
        User.delete({
          email: email,
          password: password
        }, function(user) {
            console.log(user + 'removed');
            return cb();
        }, function(err) {
            return cb(err.data);
        });
      }
    };
  })


authServices.factory('Session', function ($resource) {
    return $resource('/auth/session/');
  });

authServices.factory('User', function ($resource) {
    return $resource('/auth/users/:id/', {},
      {
        'update': {
          method:'PUT'
        }
      });
  });

authServices.factory('UserRights', function ($http, $q){
  return {
    getModules : function() {
      var deferred = $q.defer(); 
      $http.get('/auth/modules').success(function(data) {
        var modules = data.modules;
        deferred.resolve(modules);
      }).error(function() {
        deferred.reject();
      });
      return deferred.promise;  
    },

    getRightsOnIncidences : function() {
      var deferred = $q.defer();
      $http.get('/auth/incidences').success(function(data) {
        var actions = data.actions
        deferred.resolve(data);
      }).error(function() {
        deferred.reject();
      });
      return deferred.promise;
    }
  };
});

/*
authServices.factory('Rights', function ($resource) {
    return $resource('/auth/modules/');
  });

authServices.factory('UserRights', function (Rights){
  return {
    modules : function(user, callback) {
      var cb = callback || angular.noop;
      Rights.get({user},
        {function(modules){
          return modules;
        },

         }

        );
    }
  };
  
        Session.save({
          provider: provider,
          email: user.email,
          password: user.password,
          rememberMe: user.rememberMe
        }, function(user) {
          $rootScope.currentUser = user;
          return cb();
        }, function(err) {
          return cb(err.data);
        });
      },
});


authServices.factory('Rights', function ($resource) {
    return $resource('/auth/modules/');
  });
*/


/*authServices.service('userRights', function ($http){
  return {
    getModules : function() {
      return $http.get('/auth/modules').success(function(data) {
        console.log("return cacaca");   
        return data;
      }).error(function() {
        console.error('Failed to load user modules');
      })  
    },

    getRightsOnIncidences : function() {
      return $http.get('/auth/incidences').success(function(data) {        
        return data;
      }).error(function() {
        console.error('Failed to load user rights on incidences');
      })
    }
  };
});  */


