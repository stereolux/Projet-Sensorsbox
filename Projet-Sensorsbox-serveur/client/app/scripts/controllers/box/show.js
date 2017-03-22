'use strict';

angular.module('sensorsboxclientApp')
  .controller('BoxShowCtrl', [
    'Box',
    '$scope',
    '$rootScope',
    '$location',
    '$routeParams',
    function (
      Box,
      $scope,
      $rootScope,
      $location,
      $routeParams
    ){

      var boxId = $routeParams.boxId || "";
      $scope.boxId = boxId;
      $rootScope.navigationpath = ['home','box'];

      var queryBox = function(boxId){
        $rootScope.spinner = 'Loading box';
        Box.get({boxId:boxId}, function(box){
          delete $rootScope.spinner;
          $scope.box = box;
          $rootScope.navigationpath = ['home','box',{
            ref : 'show',
            name : box.name,
            url: ''
          }];
        })
      }
      if (boxId) {
        queryBox(boxId);
      }

      $scope.deleteBox = function(box){
        if (window.confirm('Delete box?')) {
          Box.delete({boxId: box._id}, function(){
            $location.path('/box');
          });
        }
      }
  }]);
