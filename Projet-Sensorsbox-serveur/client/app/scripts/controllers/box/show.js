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

      var myBoxMeasures = {};
      $scope.boxMeasures = [];

      var serverUrl = window.location.origin;

      var sensorsBox = new SensorsBox({
        host:serverUrl
      });

      sensorsBox.on('measure', function (body) {
        $scope.$apply(function() {
          if (myBoxMeasures[body.data.sensor].length > 29) {
            myBoxMeasures[body.data.sensor].shift();
          }
          myBoxMeasures[body.data.sensor].push([
            new Date(body.data.createdAt),
            parseInt(body.data.value)
          ]);
        });
      });

      sensorsBox.on('box', function (body) {
        body.data.sensor.forEach(function(sensor) {
          myBoxMeasures[sensor.id] = [];
          $scope.boxMeasures.push({
              "key": sensor.name,
              "values": myBoxMeasures[sensor.id]
          })
        })
      })

      sensorsBox.watchBox($routeParams.boxId, function(err, box) {
        console.log('watching box');
      });

      $scope.$on('$locationChangeStart', function(event) {
        sensorsBox.unwatchBox($routeParams.boxId, function(err, box) {
          console.log('Successfully unwatched box');
        })
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
