'use strict';

angular.module('sensorsboxclientApp')
  .factory('User', [
    '$resource',
    '$rootScope',
    function(
      $resource,
      $rootScope
    ){
      var userUrl = $rootScope.constants.API_URL + '/user/:userId';
      var userFactory = $resource(
        userUrl,
        {userId:'@id'},
        { 'update': {method:'PUT'}
      });
      return userFactory;
    }
  ]);

angular.module('sensorsboxclientApp')
  .factory('UserStatus', [
    '$q',
    '$rootScope',
    '$http',
    function(
      $q,
      $rootScope,
      $http
    ){
      var isUserSignedinServer = function(){
        var defer = $q.defer();
        $http.get($rootScope.constants.API_URL + '/user/me')
          .success(function(user){
            $rootScope.user = user;
            $rootScope.state.isUserSignedinServer = true;
            defer.resolve({reason:'loggedIn'});
          })
          .error(function(){
            delete $rootScope.user;
            $rootScope.state.isUserSignedinServer = false;
            defer.reject({reason:'notLoggedIn'});
          });
        return defer.promise;
      };
      var isUserSignedoutServer = function(){
        var defer = $q.defer();
        isUserSignedinServer().then(
          function(success){
            defer.reject(success);
          },function(rejection){
            defer.resolve(rejection);
          }
        );
        return defer.promise;
      };
      var isUserSignedinLocal = function(){
        if ($rootScope.state.isUserSignedinServer === null) {
          return isUserSignedinServer();
        }
        else {
          var defer = $q.defer();
          if ($rootScope.user && $rootScope.user !== 'null') {
            defer.resolve({reason:'loggedIn'});
          }
          else {
            defer.reject({reason:'notLoggedIn'});
          }
          return defer.promise;
        }
      };
      var isUserSignedoutLocal = function(){
        var defer = $q.defer();
        isUserSignedinLocal().then(
          function(success){
            defer.reject(success);
          },function(){
            defer.resolve();
          }
        );
        return defer.promise;
      };
      return {
        isUserSignedinServer : isUserSignedinServer,
        isUserSignedoutServer : isUserSignedoutServer,
        isUserSignedinLocal : isUserSignedinLocal,
        isUserSignedoutLocal : isUserSignedoutLocal
      };
    }
  ]);

angular.module('sensorsboxclientApp')
  .service('UserStatusInterceptor', [
    '$q',
    '$rootScope',
    '$injector',
    function(
      $q,
      $rootScope,
      $injector
    ){
      return {
        responseError: function(rejection) {
          if (
            rejection.config.url !== $rootScope.constants.API_URL + '/login' &&
            rejection.config.url !== $rootScope.constants.API_URL + '/user' &&
            rejection.config.url !== $rootScope.constants.API_URL + '/user/me' &&
            rejection.config.url !== $rootScope.constants.API_URL + '/box'
          ){
            $injector.get('UserStatus').isUserSignedinServer().then(
              function(user){
                var alertData = { type: 'danger', msg: 'Your are not allowed to access this page'};
                $rootScope.alerts.push(alertData);
              },function(){
                var alertData = { type: 'danger', msg: 'You need to sign in to access this page'};
                $rootScope.alerts.push(alertData);
              }
            );
          }
          return $q.reject(rejection);
        }
      };
    }
  ]);
