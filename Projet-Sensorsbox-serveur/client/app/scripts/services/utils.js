'use strict';

angular.module('sensorsboxclientApp')
  .factory('utils', [
    '$rootScope',
    '$location',
    '$window',
    function(
      $rootScope,
      $location,
      $window
    ){

      var toReturn = {
        onApiError : function(errors){
          for (var error in errors) {
            var alertData = { type: 'danger', msg: errors[error].message };
            $rootScope.alerts.push(alertData);
          }
        },
        locationPath : function(href){
          $location.path(href);
        },
        getLocationPath : function(){
          return $location.path();
        },
        externalHref : function(href, name){
          $rootScope.spinner = 'Redirecting you to ' + name;
          $window.location.replace(href);
        }
      };

      return toReturn;

    }
  ]);

angular.module('sensorsboxclientApp')
  .filter('filterByParamId', function() {
    return function(input, param, id) {
      var toReturn = [];
      var i=0, len=input.length;
      for (; i<len; i++) {
        if (input[i][param]._id === id) {
          toReturn.push(input[i]);
        }
      }
      return toReturn;
    };
  });

angular.module('sensorsboxclientApp')
  .filter('getById', function() {
    return function(input, id) {
      var i=0, len=input.length;
      for (; i<len; i++) {
        if (input[i]._id === id) {
          return input[i];
        }
      }
      return null;
    };
  });
