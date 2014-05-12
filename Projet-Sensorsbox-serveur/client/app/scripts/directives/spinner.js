'use strict';

angular.module('sensorsboxclientApp')
  .directive('spinner', function (){
    return {
      templateUrl: 'views/spinner.html',
      restrict: 'E',
      controller : function($scope){
        var vkbody = angular.element(document.querySelector('body'));
        $scope.$watch('spinner', function(){
          if ($scope.spinner) {
            vkbody.addClass('spinnerShown');
          }
          else {
            vkbody.removeClass('spinnerShown');
          }
        });
      },
      link: function(scope, element, attrs) {
      }
    };
  });
