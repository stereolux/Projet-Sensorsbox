'use strict';

angular.module('sensorsboxclientApp')
  .controller('SensorCreateCtrl', [
    'Box',
    'Sensor',
    '$scope',
    '$rootScope',
    '$location',
    'utils',
    function (
      Box,
      Sensor,
      $scope,
      $rootScope,
      $location,
      utils
    ){

      $rootScope.navigationpath = ['home','sensor','create'];

      Box.query(function(data){
        delete $rootScope.spinner;
        $scope.boxs = data;
      });

      $scope.addSensor = function(sensor){
        $rootScope.spinner = 'Creating sensor';
        var thisSensor = new Sensor(sensor);
        thisSensor.$save(
          function(data){
            delete $rootScope.spinner;
            var alertData = { type: 'success', msg: 'Sensor successfully created' };
            $rootScope.alerts.push(alertData);
            $scope.sensor = {};
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
