'use strict';

angular.module('sensorsboxclientApp')
  .directive('headermobile', function () {
    return {
      templateUrl: 'views/header/mobile.html',
      restrict: 'E',
      controller : function($scope){},
      link: function(scope, element, attrs) {}
    };
  });
