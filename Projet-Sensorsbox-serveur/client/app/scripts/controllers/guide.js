'use strict';

angular.module('sensorsboxclientApp')
  .controller('GuideCtrl', [
    '$rootScope',
    '$scope',
    function (
      $rootScope,
      $scope
    ){

      $rootScope.navigationpath = ['home', 'guide'];

    }
  ]);
