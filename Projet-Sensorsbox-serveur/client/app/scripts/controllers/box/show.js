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

      io.socket.on('measure', function (data) {
        $scope.$apply(function(){
            if (myBoxMeasures[data.created.sensor].length > 29) {
              myBoxMeasures[data.created.sensor].shift();
            }
            myBoxMeasures[data.created.sensor].push(parseMeasure(data.created));
        })
      });

      io.socket.on('box', function (data) {
        data.list.sensor.forEach(function(sensor){
          myBoxMeasures[sensor.id] = [];
          $scope.boxMeasures.push({
              "key": sensor.name,
              "values": myBoxMeasures[sensor.id]
          })
        })
      });

      io.socket.get('/api/v1/realtime/box/' + $routeParams.boxId, function (body, response) {
        if(response.statusCode === 200) {
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
