'use strict';

angular.module('sensorsboxclientApp')
  .controller('BoxCreateCtrl', [
    'Box',
    '$scope',
    '$rootScope',
    '$location',
    'utils',
    function (
      Box,
      $scope,
      $rootScope,
      $location,
      utils
    ){

      $rootScope.navigationpath = ['home','box','create'];

      $scope.addBox = function(box){
        $rootScope.spinner = 'Creating box';
        var thisBox = new Box(box);
        thisBox.$save(
          function(data){
            delete $rootScope.spinner;
            var alertData = { type: 'success', msg: 'Box successfully created' };
            $rootScope.alerts.push(alertData);
            $scope.box = {};
          },
          function(response){
            var data = response.data;
            delete $rootScope.spinner;
            if (data.errors) {
              utils.onApiError(data.errors);
            }
            else {
              var alertData = { type: 'danger', msg: 'Cannot create' };
              $rootScope.alerts.push(alertData);
            }
          }
        );
      };
  }]);
