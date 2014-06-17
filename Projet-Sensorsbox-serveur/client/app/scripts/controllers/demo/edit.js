'use strict';

angular.module('sensorsboxclientApp')
  .controller('DemoEditCtrl', [
    'Demo',
    '$scope',
    '$rootScope',
    '$routeParams',
    'utils',
    function (
      Demo,
      $scope,
      $rootScope,
      $routeParams,
      utils
    ){

      var demoId = $routeParams.demoId || "";
      $rootScope.navigationpath = ['home','demo'];

      if (demoId) {
        $rootScope.spinner = 'Loading demo';
        Demo.get({demoId:demoId}, function(demo){
          delete $rootScope.spinner;
          $scope.demo = demo;
          $rootScope.navigationpath = ['home','demo',{
            ref : 'edit',
            name : demo.name
          }];
        })
      }
      $scope.updateDemo = function(demo){
        $rootScope.spinner = 'Updating demo';

        var demoCopy = {};
        angular.extend(demoCopy, demo);
        delete demoCopy.owner;
        delete demoCopy.updatedAt;
        delete demoCopy.createdAt;
        var thisDemo = new Demo(demoCopy);

        thisDemo.$update({demoId:demo.id}, function(data){
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
