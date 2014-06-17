'use strict';

angular.module('sensorsboxclientApp')
  .controller('DemoListCtrl', [
    'Demo',
    '$scope',
    '$rootScope',
    '$injector',
    function (
      Demo,
      $scope,
      $rootScope,
      $injector
    ){

      $rootScope.navigationpath = ['home','demo'];

      var queryDemos = function(){
        $rootScope.spinner = 'Loading demoes';
        Demo.query(function(data){
          $scope.demos = data;
          delete $rootScope.spinner;
        });
      }
      $scope.deleteDemo = function(demo){
        if (window.confirm('Delete demo?')) {
          Demo.delete({demoId: demo.id}, function(){
            queryDemos();
          });
        }
      }
      queryDemos();

  }]);
