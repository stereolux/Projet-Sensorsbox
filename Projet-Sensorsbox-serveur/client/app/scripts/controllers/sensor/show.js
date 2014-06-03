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

      var mySensorMeasures = {};
      $scope.sensorMeasures = [];

      var graphContainer = document.getElementById('graphContainer');
      var graphContainerWidth = parseInt(window.getComputedStyle(graphContainer).width);
      var graphContainerHeight = graphContainerWidth * 3 / 4;

      $scope.graph = {
        width : graphContainerWidth,
        height : graphContainerHeight,
        xAxisFormat : function(){
          return function(d){
            var thisDate = new Date(d);
            var thisDateDiff = parseInt((Date.now() - Date.parse(thisDate)) / 1000);
            return thisDateDiff + 's';
          }
        }

      };

      var sensorsBox = new SensorsBox.Connection({
        host:window.location.origin
      });

      sensorsBox.on('measure', function (body) {
        $scope.$apply(function() {
          if (mySensorMeasures[body.data.sensor].length > 29) {
            mySensorMeasures[body.data.sensor].shift();
          }
          mySensorMeasures[body.data.sensor].push([
            new Date(),
            body.data.value
          ]);
        });
      });

      sensorsBox.on('sensor', function (body) {
        var sensor = body.data;
        $scope.sensorMeasures = [];
        mySensorMeasures[sensor.id] = [];
        $scope.sensorMeasures.push({
            "key": sensor.name,
            "values": mySensorMeasures[sensor.id]
        })
      })

      if (sensorsBox.socket.socket.connected) {
        sensorsBox.watchSensor($routeParams.sensorId, function(err, sensor) {
          console.log('watching sensor');
        });
      }
      else {
        sensorsBox.on('connect', function(){
          sensorsBox.watchSensor($routeParams.sensorId, function(err, sensor) {
            console.log('watching sensor');
          });
        });
      }

      $scope.$on('$locationChangeStart', function(event) {
        sensorsBox.unwatchSensor($routeParams.sensorId, function(err, sensor) {
          console.log('Successfully unwatched sensor');
        })
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
