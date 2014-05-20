'use strict';

angular.module('sensorsboxclientApp')
  .config([
    '$routeProvider',
    function (
      $routeProvider
    ){
      var isUserSignedinLocal = function($injector){
        return $injector.get('UserStatus').isUserSignedinLocal();
      };
      var isUserSignedoutLocal = function($injector){
        return $injector.get('UserStatus').isUserSignedoutLocal();
      };
      $routeProvider
        .when('/sensor', {
          templateUrl: 'views/sensor/all.html',
          controller: 'SensorListCtrl'
        })
        .when('/sensor/create', {
          templateUrl: 'views/sensor/create.html',
          controller: 'SensorCreateCtrl',
          resolve : {
            condition : isUserSignedinLocal
          }
        })
        .when('/sensor/:sensorId/show', {
          templateUrl: 'views/sensor/show.html',
          controller: 'SensorShowCtrl'
        })
        .when('/sensor/:sensorId/edit', {
          templateUrl: 'views/sensor/edit.html',
          controller: 'SensorEditCtrl',
          resolve : {
            condition : isUserSignedinLocal
          }
        });
    }
  ]);
