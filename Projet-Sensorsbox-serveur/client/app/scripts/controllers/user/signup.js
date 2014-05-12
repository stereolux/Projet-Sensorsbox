'use strict';

angular.module('sensorsboxclientApp')
  .controller('UserSignupCtrl',[
    '$scope',
    '$rootScope',
    '$http',
    '$location',
    'utils',
    function (
      $scope,
      $rootScope,
      $http,
      $location,
      utils
    ){

      $rootScope.navigationpath = ['home','usersignup'];

      $scope.signUp = function(user){

        $rootScope.spinner = 'Signin up';

        $http.post($rootScope.constants.API_URL + '/user', user)
          .success(function(data){
            delete $rootScope.spinner;
            var alertData = { type: 'success', msg: 'User successfully created. You can now sign in' };
            $rootScope.alerts.push(alertData);
            $location.path('/user/signin')
          })
          .error(function(data){
            delete $rootScope.spinner;
            if (data.errors) {
              utils.onApiError(data.errors);
            }
            else {
              var alertData = { type: 'danger', msg: 'Signup failure' };
              $rootScope.alerts.push(alertData);
            }
          })
      }
  }]);
