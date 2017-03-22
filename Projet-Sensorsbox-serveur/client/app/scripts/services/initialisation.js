'use strict';

angular.module('sensorsboxclientApp')
  .factory('initialisation', [
    '$rootScope',
    '$route',
    function(
      $rootScope,
      $route
    ){

      var toReturn = {
        initIsMobileReloadOnWindowResize : function (){
          var isMobile = function(){
            return window.innerWidth < $rootScope.constants.DESKTOP_MIN_WIDTH;
          };
          var reloadOnIsMobile = function(){
            var isLastMobile = isMobile();
            if ($rootScope.state.isMobile !== isLastMobile) {
              $rootScope.state.isMobile = isLastMobile;
              $rootScope.$digest();
            }
          };
          $rootScope.state.isMobile = isMobile();
          window.onresize = reloadOnIsMobile;
        },
        initRedirectionListener : function(){
          $rootScope.$on('$routeChangeError', function (event, nextLocation, currentLocation, rejection) {
            var errorMessage;

            if (rejection.reason === 'notLoggedIn') {
              errorMessage = 'You need to sign in to access "' + nextLocation.$$route.originalPath + '"';
            }
            else if (rejection.reason === 'loggedIn') {
              errorMessage = 'You need to sign out to access "' + nextLocation.$$route.originalPath + '"';
            }
            else {
              errorMessage = 'You currently cannot access "' + nextLocation.$$route.originalPath + '"';
            }
            var alertData = { type: 'danger', msg: errorMessage};
            $rootScope.alerts.push(alertData);
          });
        }
      };
      return toReturn;
    }
  ]);
