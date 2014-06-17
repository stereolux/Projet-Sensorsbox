'use strict';

angular.module('sensorsboxclientApp')
  .directive('graph', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/graph.html',
      link: function (scope, element, attrs) {

        var id = attrs.sensor ? attrs.sensor : attrs.box;
        var graphtype = attrs.sensor ? 'sensor' : 'box';
        var watchMethod = attrs.sensor ? 'watchSensor' : 'watchBox';
        var unwatchMethod = attrs.sensor ? 'unwatchSensor' : 'unwatchBox';

        var measures = {};
        scope.nvd3Measures = [];

        var sensorsBox = new SensorsBox.Connection({
          host:window.location.origin
        });

        sensorsBox.on('measure', function (body) {
          scope.$apply(function() {
            console.log(measures);
            if (measures && measures[body.data.sensor].length > 29) {
              measures[body.data.sensor].shift();
            }
            measures[body.data.sensor].push([
              new Date(),
              body.data.value
            ]);
          });
        });

        sensorsBox.on('sensor', function (body) {
          console.log('yay');
          scope.nvd3Measures = [];
          initGraph([body.data]);
        })

        sensorsBox.on('box', function (body) {
          console.log('youy');
          scope.nvd3Measures = [];
          initGraph(body.data.sensor);
        })

        var initGraph = function(sensors){
          scope.nvd3Measures = [];
          sensors.forEach(function(sensor) {
            measures[sensor.id] = [];
            scope.nvd3Measures.push({
                "key": sensor.name,
                "values": measures[sensor.id]
            })
          })
        }

        if (sensorsBox.socket.socket.connected) {
          console.log('boom');
          sensorsBox[watchMethod](id, function(err, body) {
            var watchedSensors = (graphtype === 'sensor') ? [body] : body.sensor;
            initGraph(watchedSensors);
          });
        }
        else {
          sensorsBox.on('connect', function(){
            sensorsBox[watchMethod](id, function(err, body) {
              var watchedSensors = (graphtype === 'sensor') ? [body] : body.sensor;
              initGraph(watchedSensors);
            });
          });
        }


        scope.$on('$destroy', function() {
          sensorsBox[unwatchMethod](id, function(err, sensor) {
            console.log('Successfully unwatched sensor');
          })
        });

        var graphContainer = element.find('div')[0];
        var graphContainerWidth = parseInt(window.getComputedStyle(graphContainer).width);
        var graphContainerHeight = graphContainerWidth * 3 / 4;

        scope.graph = {
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
      }
    };
  });
