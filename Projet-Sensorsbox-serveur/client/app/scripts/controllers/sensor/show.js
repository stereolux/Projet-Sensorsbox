'use strict';

angular.module('sensorsboxclientApp')
  .controller('SensorShowCtrl', [
    'Sensor',
    '$scope',
    '$rootScope',
    '$location',
    '$routeParams',
    function (
      Sensor,
      $scope,
      $rootScope,
      $location,
      $routeParams
    ){

      var sensorId = $routeParams.sensorId || "";
      $scope.sensorId = sensorId;
      $rootScope.navigationpath = ['home','sensor'];

      var querySensor = function(sensorId){
        $rootScope.spinner = 'Loading sensor';
        Sensor.get({sensorId:sensorId}, function(sensor){
          delete $rootScope.spinner;
          $scope.sensor = sensor;
          $rootScope.navigationpath = ['home','sensor',{
            ref : 'show',
            name : sensor.name,
            url: ''
          }];
        })
      }
      if (sensorId) {
        querySensor(sensorId);
      }

      $scope.deleteSensor = function(sensor){
        if (window.confirm('Delete sensor?')) {
          Sensor.delete({sensorId: sensor._id}, function(){
            $location.path('/sensor');
          });
        }
      }

  }]);
