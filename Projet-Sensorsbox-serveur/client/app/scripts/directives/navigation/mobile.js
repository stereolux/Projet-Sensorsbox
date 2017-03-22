'use strict';

angular.module('sensorsboxclientApp')
  .directive('navigationmobile', [
    '$rootScope',
    '$http',
    '$window',
    '$location',
    function (
      $rootScope,
      $http,
      $window,
      $location
    ){
      return {
        templateUrl: 'views/navigation/mobile.html',
        restrict: 'E',
        link: function(scope, element, attrs) {

          var snapSettings = {
              element: document.getElementById('vkContainer'),
              dragger: null,
              disable: 'none',
              addBodyClasses: true,
              hyperextensible: true,
              resistance: 0.5,
              flickThreshold: 50,
              transitionSpeed: 0.3,
              easing: 'ease',
              maxPosition: 266,
              minPosition: -266,
              tapToClose: true,
              touchToDrag: true,
              slideIntent: 40,
              minDragDistance: 2
          }

          var snapper = new Snap(snapSettings);

          $rootScope.$on("$routeChangeSuccess", function (event, nextLocation, currentLocation, rejection) {
            snapper.close();
            scope.displaySubnav = true;
          });

          scope.vkSnapToggle = function(side){
            if( snapper.state().state.match(/left|right/)){
              snapper.close();
            } else {
              snapper.open(side);
            }
          };
          scope.logout = function () {
            $http.get($rootScope.constants.API_URL + '/logout')
              .success(function(data){
                delete $rootScope.user;
                $location.path('/user/signin')
              })
              .error(function(data){
                alert(data.message)
              })
          }
        }
      };
  }]);
