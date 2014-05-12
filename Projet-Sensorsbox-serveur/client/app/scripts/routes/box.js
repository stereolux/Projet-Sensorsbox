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
        .when('/box', {
          templateUrl: 'views/box/all.html',
          controller: 'BoxListCtrl',
          resolve : {
            condition : isUserSignedinLocal
          }
        })
        .when('/box/create', {
          templateUrl: 'views/box/create.html',
          controller: 'BoxCreateCtrl',
          resolve : {
            condition : isUserSignedinLocal
          }
        })
        .when('/box/:boxId/show', {
          templateUrl: 'views/box/show.html',
          controller: 'BoxShowCtrl',
          resolve : {
            condition : isUserSignedinLocal
          }
        })
        .when('/box/:boxId/edit', {
          templateUrl: 'views/box/edit.html',
          controller: 'BoxEditCtrl',
          resolve : {
            condition : isUserSignedinLocal
          }
        });
    }
  ]);
