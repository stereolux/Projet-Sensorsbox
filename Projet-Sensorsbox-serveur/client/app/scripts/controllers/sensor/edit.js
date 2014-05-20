'use strict';

angular.module('sensorsboxclientApp')
  .controller('SensorEditCtrl', [
    'Box',
    'Sensor',
    '$scope',
    '$rootScope',
    '$routeParams',
    'utils',
    function (
      Box,
      Sensor,
      $scope,
      $rootScope,
      $routeParams,
      utils
    ){

      var sensorId = $routeParams.sensorId || "";
      $rootScope.navigationpath = ['home','sensor'];

      Box.query(function(data){
        delete $rootScope.spinner;
        $scope.boxs = data;
      });

      if (sensorId) {
        $rootScope.spinner = 'Loading sensor';
        Sensor.get({sensorId:sensorId}, function(sensor){
          delete $rootScope.spinner;
          sensor.box = sensor.box.id;
          $scope.sensor = sensor;
          $rootScope.navigationpath = ['home','sensor',{
            ref : 'show',
            name : sensor.name,
            url: '/#/sensor/' + sensor.id + '/show'
          },'edit'];
        })
      }
      $scope.updateSensor = function(sensor){
        $rootScope.spinner = 'Updating sensor';

        var sensorCopy = {};
        angular.extend(sensorCopy, sensor);
        delete sensorCopy.owner;
        delete sensorCopy.updatedAt;
        delete sensorCopy.createdAt;
        delete sensorCopy.box;
        var thisSensor = new Sensor(sensorCopy);

        thisSensor.$update({sensorId:sensor.id}, function(data){
            delete $rootScope.spinner;
            var alertData = { type: 'success', msg: 'Update successfull' };
            $rootScope.alerts.push(alertData);
          },
          function(response){
            var data = response.data;
            delete $rootScope.spinner;
            if (data.errors) {
              utils.onApiError(data.errors);
            }
            else {
              var alertData = { type: 'danger', msg: 'Cannot update' };
              $rootScope.alerts.push(alertData);
            }
          }
        );
      };
  }]);
