'use strict';

angular.module('sensorsboxclientApp')
  .service('ClientSpeedInterceptor', [
    '$q',
    '$rootScope',
    function(
      $q,
      $rootScope
    ){

      $rootScope.apicalls = $rootScope.apicalls || {
        GET: {},
        POST: {},
        PUT: {},
        DELETE: {}
      };

      var toReturn =  {
        request: function(config) {
          if (config.url.match(/api\//)) {
            $rootScope.apicalls[config.method][config.url] = new Date().getTime();
          }
          return config || $q.when(config);
        },
        response : function(response) {
          checkResponse(response);
          return response || $q.when(response);
        },
        responseError : function(response) {
          checkResponse(response);
          return $q.reject(response);
        }
      };

      var vkbody = angular.element(document.querySelector('body'));

      var checkResponse = function(response) {
        if (response.config.url.match(/api\//)) {
          var responseTime = new Date().getTime() - $rootScope.apicalls[response.config.method][response.config.url];
          if (responseTime < $rootScope.constants.MIN_TIME_DISPLAY_SPINNER) {
            vkbody.removeClass('vkslow').addClass('vkfast');
          }
          else {
            vkbody.removeClass('vkfast').addClass('vkslow');
          }
        }
      };

      return toReturn;

    }
  ]);
