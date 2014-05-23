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

      $scope.boxMeasures = [
        {
          "key": "Measures",
          "values": []
        }
      ];

      var parseMeasure = function(measure){
        return [
          new Date(measure.createdAt),
          parseInt(measure.value || measure.mean)
        ];
      }
/*
      io.socket.get('/api/v1/record/', function (body, sailsResponseObject) {
        if(sailsResponseObject.statusCode === 200) {
        }
      });
*/
      io.socket.on('sensor', function (body) {
        $scope.$apply(function(){
            if ($scope.boxMeasures[0].values.length > 29) {
              $scope.boxMeasures[0].values.shift();
            }
            $scope.boxMeasures[0].values.push(parseMeasure(body.data));
        })
      });

      io.socket.get('/api/v1/realtime/box/' + $routeParams.boxId, function (body, sailsResponseObject) {
        if(sailsResponseObject.statusCode === 200) {
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
