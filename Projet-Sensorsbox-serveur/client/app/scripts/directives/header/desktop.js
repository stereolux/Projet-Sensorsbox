'use strict';

angular.module('sensorsboxclientApp')
  .directive('headerdesktop', function () {
    return {
      templateUrl: 'views/header/desktop.html',
      restrict: 'E',
      controller : function($scope){},
      link: function(scope, element, attrs) {}
    };
  });
