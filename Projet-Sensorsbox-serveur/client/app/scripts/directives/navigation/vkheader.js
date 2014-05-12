'use strict';

angular.module('sensorsboxclientApp')
  .directive('vkheader', function () {
    return {
      templateUrl: 'views/navigation/vkheader.html',
      restrict: 'E',
      controller : function($scope){},
      link: function(scope, element, attrs) {}
    };
  });
