'use strict';

angular.module('sensorsboxclientApp')
  .controller('DemoCreateCtrl', [
    'Demo',
    '$scope',
    '$rootScope',
    '$location',
    'utils',
    function (
      Demo,
      $scope,
      $rootScope,
      $location,
      utils
    ){

      $rootScope.navigationpath = ['home','demo','create'];

      $scope.addDemo = function(demo){
        $rootScope.spinner = 'Creating demo';
        var thisDemo = new Demo(demo);
        thisDemo.$save(
          function(data){
            delete $rootScope.spinner;
            var alertData = { type: 'success', msg: 'Demo successfully created' };
            $rootScope.alerts.push(alertData);
            $scope.demo = {};
          },
          function(response){
            var data = response.data;
            delete $rootScope.spinner;
            if (data.errors) {
              utils.onApiError(data.errors);
            }
            else {
              var alertData = { type: 'danger', msg: 'Cannot create' };
              $rootScope.alerts.push(alertData);
            }
          }
        );
      };
  }]);
