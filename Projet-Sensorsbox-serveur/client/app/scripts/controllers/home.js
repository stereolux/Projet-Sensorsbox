'use strict';

angular.module('sensorsboxclientApp')
  .controller('HomeCtrl', [
    '$rootScope',
    '$scope',
    function (
      $rootScope,
      $scope
    ){

      $rootScope.navigationpath = ['home'];

      io.socket.get('/api/v1/realtime', function (body, sailsResponseObject) {
        if(sailsResponseObject.statusCode === 200) {
          $scope.config = body[0];
          $scope.$apply();
        }
      });
    }
  ]);
