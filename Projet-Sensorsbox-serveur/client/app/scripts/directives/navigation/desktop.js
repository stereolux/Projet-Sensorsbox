'use strict';

angular.module('sensorsboxclientApp')
  .directive('navigationdesktop', [
    '$rootScope',
    '$http',
    '$location',
    function (
      $rootScope,
      $http,
      $location
    ){
      return {
        templateUrl: 'views/navigation/desktop.html',
        restrict: 'E',
        controller : function($scope){
        },
        link: function(scope, element, attrs) {
          scope.logout = function () {
            $http.get($rootScope.constants.API_URL + '/logout')
              .success(function(data){
                delete $rootScope.user;
                $location.path('/user/signin')
              })
              .error(function(data){
                alert(data.message)
              })
          }
        }
      };
  }]);
