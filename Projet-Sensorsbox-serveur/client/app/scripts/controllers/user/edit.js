'use strict';

angular.module('sensorsboxclientApp')
  .controller('UserEditCtrl', [
    'User',
    '$scope',
    '$rootScope',
    '$routeParams',
    'utils',
    function (
      User,
      $scope,
      $rootScope,
      $routeParams,
      utils
    ){

      $rootScope.navigationpath = ['home','useredit'];

      $scope.signer = angular.copy($scope.user);

      $scope.updateUser = function(user){
        var thisUser = new User(user);
        $rootScope.spinner = 'Updating user';
        thisUser.$update({userId:user.id}, function(data){
            delete $rootScope.spinner;
            $rootScope.user = thisUser;
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
