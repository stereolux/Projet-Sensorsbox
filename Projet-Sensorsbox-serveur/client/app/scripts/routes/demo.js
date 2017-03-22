'use strict';

angular.module('sensorsboxclientApp')
  .config([
    '$routeProvider',
    function (
      $routeProvider
    ){
      var isUserSignedinLocal = function($injector){
        return $injector.get('UserStatus').isUserSignedinLocal();
      };
      var isUserSignedoutLocal = function($injector){
        return $injector.get('UserStatus').isUserSignedoutLocal();
      };
      $routeProvider
        .when('/demo', {
          templateUrl: 'views/demo/all.html',
          controller: 'DemoListCtrl'
        })
        .when('/demo/create', {
          templateUrl: 'views/demo/create.html',
          controller: 'DemoCreateCtrl',
          resolve : {
            condition : isUserSignedinLocal
          }
        })
        .when('/demo/:demoId/edit', {
          templateUrl: 'views/demo/edit.html',
          controller: 'DemoEditCtrl',
          resolve : {
            condition : isUserSignedinLocal
          }
        });
    }
  ]);
