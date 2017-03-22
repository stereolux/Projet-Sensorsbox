'use strict';

angular.module('sensorsboxclientApp')
  .factory('Box', [
    '$resource',
    '$rootScope',
    function(
      $resource,
      $rootScope
    ){

      var boxUrl = $rootScope.constants.API_URL + '/box/:boxId';
      var boxFactory = $resource(
        boxUrl,
        {boxId:'@id'},
        { 'update': {method:'PUT'}
      });
      return boxFactory;
    }
  ]);
