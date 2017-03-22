'use strict';

angular.module('sensorsboxclientApp')
  .directive('alerts', [
    '$rootScope',
    '$timeout',
    function (
      $rootScope,
      $timeout
    ){
      return {
        templateUrl: 'views/alerts.html',
        restrict: 'E',
        controller : function($scope){},
        link: function(scope, element, attrs) {
          scope.alertLength = 0;

          var updateAlerts = function(){
            var isAlertsNotEmpty = ($rootScope.alerts.length === 0) ? false : true;
            var difference = $rootScope.alerts.length - scope.alertLength;

            if (isAlertsNotEmpty) {
              window.scrollTo(0,0);
              if (document.querySelector('.snap-content > div')) {
                document.querySelector('.snap-content > div').scrollTop = 0;
              }
              $timeout(function(){
                $rootScope.alerts.splice(0,difference);
              }, 3000);
            }
            scope.alertLength = $rootScope.alerts.length;
          };

          var thisWatch = $rootScope.$watch('alerts', function() {
            updateAlerts();
          }, true);
          updateAlerts();

          scope.$on('$destroy', function() {
            thisWatch();
          });

        }
      };
    }
  ]);
