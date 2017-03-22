'use strict';

angular.module('sensorsboxclientApp')
  .factory('Sensor', [
    '$resource',
    '$rootScope',
    function(
      $resource,
      $rootScope
    ){

      var sensorUrl = $rootScope.constants.API_URL + '/sensor/:sensorId';
      var sensorFactory = $resource(
        sensorUrl,
        {sensorId:'@id'},
        { 'update': {method:'PUT'}
      });
      return sensorFactory;
    }
  ]);
