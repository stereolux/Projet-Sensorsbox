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

    }
  ]);
