'use strict';

angular.module('sensorsboxclientApp')
  .factory('Demo', [
    '$resource',
    '$rootScope',
    function(
      $resource,
      $rootScope
    ){

      var demoUrl = $rootScope.constants.API_URL + '/demo/:demoId';
      var demoFactory = $resource(
        demoUrl,
        {demoId:'@id'},
        { 'update': {method:'PUT'}
      });
      return demoFactory;
    }
  ]);
