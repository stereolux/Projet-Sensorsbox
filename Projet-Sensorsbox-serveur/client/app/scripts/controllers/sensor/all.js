'use strict';

angular.module('sensorsboxclientApp')
  .controller('SensorListCtrl', [
    'Sensor',
    '$scope',
    '$rootScope',
    '$injector',
    function (
      Sensor,
      $scope,
      $rootScope,
      $injector
    ){

      $rootScope.navigationpath = ['home','sensor'];

      var querySensors = function(){
        $rootScope.spinner = 'Loading sensors';
        Sensor.query(function(data){
          $scope.sensors = data;
          delete $rootScope.spinner;
        });
      }
      $scope.deleteSensor = function(sensor){
        if (window.confirm('Delete sensor?')) {
          Sensor.delete({sensorId: sensor.id}, function(){
            querySensors();
          });
        }
      }
      querySensors();

  }]);
