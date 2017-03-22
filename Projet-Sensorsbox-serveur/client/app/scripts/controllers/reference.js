'use strict';

angular.module('sensorsboxclientApp')
  .controller('ReferenceCtrl', [
    '$rootScope',
    '$scope',
    '$location',
    '$anchorScroll',
    function (
      $rootScope,
      $scope,
      $location,
      $anchorScroll
    ){

      $rootScope.navigationpath = ['home', 'reference'];
       $scope.scrollTo = function(id) {
          $location.hash(id);
          $anchorScroll();
          window.scrollBy(0, -80);
       }
    }
  ]);
