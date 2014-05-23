'use strict';

angular.module('sensorsboxclientApp')
  .directive('nvd3LineChart', function () {
    return {
      restrict: 'E',
      priority: 100000000000000000,
      link: function (scope, element, attrs) {
        console.log(element);
      }
    };
  });
