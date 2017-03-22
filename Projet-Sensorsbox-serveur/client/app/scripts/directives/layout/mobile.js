'use strict';

angular.module('sensorsboxclientApp')
  .directive('layoutmobile', function () {
    return {
      templateUrl: 'views/layout/mobile.html',
      restrict: 'E',
      controller : function($scope){},
      link: function(scope, element, attrs) {}
    };
  });
