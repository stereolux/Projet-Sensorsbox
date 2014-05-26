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

/*

      var parseMeasure = function(measure){
        return [
          new Date(measure.createdAt),
          parseInt(measure.value || measure.mean)
        ];
      }
      io.socket.on('sensor', function (body) {
        $scope.$apply(function(){
            if ($scope.sensorMeasures[0].values.length > 29) {
              $scope.sensorMeasures[0].values.shift();
            }
            $scope.sensorMeasures[0].values.push(parseMeasure(body.data));
        })
      });

      $scope.sensorMeasures = [];

*/
      io.socket.get('/api/v1/watch/sensor/' + $routeParams.sensorId, function (body, sailsResponseObject) {
        if(sailsResponseObject.statusCode === 200) {
/*
          $scope.sensorMeasures.push({
              "key": body.name,
              "values": []
          })
*/
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
