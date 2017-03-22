'use strict';

angular.module('sensorsboxclientApp')
  .directive('rickshaw', function () {
    return {
      restrict: 'E',
      templateUrl: 'views/rickshaw.html',
      link: function (scope, element, attrs) {

        var id = attrs.sensor ? attrs.sensor : attrs.box;
        var graphtype = attrs.sensor ? 'sensor' : 'box';
        var watchMethod = attrs.sensor ? 'watchSensor' : 'watchBox';
        var unwatchMethod = attrs.sensor ? 'unwatchSensor' : 'unwatchBox';

        var graph;
        var xAxis;
        var yAxis;

        var myConnection = new SensorsBox.Connection({
          host:window.location.origin
        });

        var graphContainer = element.find('div')[0];
        var graphContainerWidth = parseInt(window.getComputedStyle(graphContainer).width);
        var graphContainerHeight = graphContainerWidth * 3 / 4;


        var initGraph = function(sensors){
          var dataArray = [];
          sensors.forEach(function(sensor){
            dataArray.push({
              name: sensor.name,
              data: [],
              renderer : 'line'
            })
          })
          var theseSeries = new Rickshaw.Series(
            dataArray,
            undefined,
            {
              timeInterval: 500,
              maxDataPoints: 50,
              timeBase: new Date().getTime() / 1000
            }
          );

          graph = new Rickshaw.Graph( {
            element: graphContainer,
            width: graphContainerWidth,
            height: graphContainerHeight,
            renderer: 'line',
            series:theseSeries
          });

          console.log(graph);

          xAxis = new Rickshaw.Graph.Axis.Time({
              graph: graph
          });

          yAxis = new Rickshaw.Graph.Axis.Y({
              graph: graph
          });

          var legend = new Rickshaw.Graph.Legend( {
            graph: graph,
            element: document.getElementById('legend')
          });
        }

        myConnection.on('box', function (body) {
          console.log(body);
          initGraph(body.data.sensor);
        })

        myConnection.on('sensor', function (body) {
          initGraph([body.data]);
        })

        myConnection.on('measure', function (body) {

          console.log(myConnection);

          var index = graph.series.getIndex();
          var thisSeries = graph.series.itemByName(myConnection.sensors[body.data.sensor].name);

          thisSeries.data.push({
            x: (index * graph.series.timeInterval || 1) + graph.series.timeBase,
            y: body.data.value
          });
          graph.render();
          xAxis.render();
          yAxis.render();

        });

        if (myConnection.socket.socket.connected) {
          myConnection[watchMethod](id, function(err, body) {
            var watchedSensors = (graphtype === 'sensor') ? [body] : body.sensor;
            initGraph(watchedSensors);
            console.log('watching sensor');
          });
        }

        else {
          myConnection.on('connect', function(){
            myConnection[watchMethod](id, function(err, body) {
              var watchedSensors = (graphtype === 'sensor') ? [body] : body.sensor;
              initGraph(watchedSensors);
              console.log('watching sensor');
            });
          });
        }

        scope.$on('$destroy', function() {
          myConnection.socket.removeAllListeners("box");
          myConnection.socket.removeAllListeners("sensor");
          myConnection.socket.removeAllListeners("measure");
          myConnection[unwatchMethod](id, function(err, sensor) {
            console.log('Successfully unwatched sensor');
          })
        });


      }
    };
  });
