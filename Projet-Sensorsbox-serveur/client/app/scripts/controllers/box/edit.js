'use strict';

angular.module('sensorsboxclientApp')
  .controller('BoxEditCtrl', [
    'Box',
    '$scope',
    '$rootScope',
    '$routeParams',
    'utils',
    function (
      Box,
      $scope,
      $rootScope,
      $routeParams,
      utils
    ){

      var boxId = $routeParams.boxId || "";
      $rootScope.navigationpath = ['home','box'];

      if (boxId) {
        $rootScope.spinner = 'Loading box';
        Box.get({boxId:boxId}, function(box){
          delete $rootScope.spinner;
          $scope.box = box;
          $rootScope.navigationpath = ['home','box',{
            ref : 'show',
            name : box.name,
            url: '/#/box/' + box._id + '/show'
          },'edit'];
        })
      }
      $scope.updateBox = function(box){
        $rootScope.spinner = 'Updating box';
        var thisBox = new Box(box);
        thisBox.$update({boxId:box.id}, function(data){
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
