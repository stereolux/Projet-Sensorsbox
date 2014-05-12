'use strict';

angular.module('sensorsboxclientApp')
  .controller('BoxListCtrl', [
    'Box',
    '$scope',
    '$rootScope',
    '$injector',
    function (
      Box,
      $scope,
      $rootScope,
      $injector
    ){

      $rootScope.navigationpath = ['home','box'];

      var queryBoxs = function(){
        $rootScope.spinner = 'Loading boxes';
        Box.query(function(data){
          $scope.boxs = data;
          delete $rootScope.spinner;
        });
      }
      $scope.deleteBox = function(box){
        if (window.confirm('Delete box?')) {
          Box.delete({boxId: box._id}, function(){
            queryBoxs();
          });
        }
      }
      queryBoxs();

  }]);
