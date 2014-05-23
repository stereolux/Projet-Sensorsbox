'use strict';

angular.module('sensorsboxclientApp')
  .controller('BoxShowCtrl', [
    'Box',
    '$scope',
    '$rootScope',
    '$location',
    '$routeParams',
    function (
      Box,
      $scope,
      $rootScope,
      $location,
      $routeParams
    ){

      var boxId = $routeParams.boxId || "";
      $rootScope.navigationpath = ['home','box'];

      var parseMeasure = function(measure){
        return [
          new Date(measure.createdAt),
          parseInt(measure.value || measure.mean)
        ];
      }

      var myBoxMeasures = {};
      $scope.boxMeasures = [];

      io.socket.on('sensor', function (body) {
        $scope.$apply(function(){
          console.log(body);
            if (myBoxMeasures[body.data.sensor].length > 29) {
              myBoxMeasures[body.data.sensor].shift();
            }
            myBoxMeasures[body.data.sensor].push(parseMeasure(body.data));
        })
      });

      $scope.toolTipContentFunction = function(){
        return function(key, x, y, e, graph) {
          return '<h1>' + key + '</h1>' +
          '<p>' +  y + ' at ' + x + '</p>'
        }
      }


      io.socket.get('/api/v1/realtime/box/' + $routeParams.boxId, function (body, sailsResponseObject) {
        if(sailsResponseObject.statusCode === 200) {
          body.sensor.forEach(function(sensor){
            myBoxMeasures[sensor.id] = [];
            console.log(sensor.name);
            $scope.boxMeasures.push({
                "key": sensor.name,
                "values": myBoxMeasures[sensor.id]
            })
          })
          console.log(myBoxMeasures);
          console.log('subscribed to updates to sensors of this box and to measures by these sensors');
        }
      });

      var queryBox = function(boxId){
        $rootScope.spinner = 'Loading box';
        Box.get({boxId:boxId}, function(box){
          delete $rootScope.spinner;
          $scope.box = box;
          $rootScope.navigationpath = ['home','box',{
            ref : 'show',
            name : box.name,
            url: ''
          }];
        })
      }
      if (boxId) {
        queryBox(boxId);
      }

      $scope.deleteBox = function(box){
        if (window.confirm('Delete box?')) {
          Box.delete({boxId: box._id}, function(){
            $location.path('/box');
          });
        }
      }
  }]);
