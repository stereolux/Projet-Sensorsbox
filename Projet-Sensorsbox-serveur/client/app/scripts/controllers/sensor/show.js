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
      $rootScope.navigationpath = ['home','sensor'];

      io.socket.get('/api/v1/realtime/sensor/' + $routeParams.sensorId, function (body, sailsResponseObject) {
        if(sailsResponseObject.statusCode === 200) {
          console.log('subscribed to updates to sensor and to measures by this sensor');
        }
      });

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
