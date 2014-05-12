'use strict';

angular.module('sensorsboxclientApp')
  .factory('architecture', function () {
    return {
      home : {
        name : 'Home',
        url : '/#',
        children : {
          usersignin : {
            name : 'Sign in',
            url : '/#/user/signin'
          },
          usersignup : {
            name : 'Sign up',
            url : '/#/user/signup'
          },
          useredit : {
            name : 'User settings',
            url : '/#/user/edit'
          },
          box : {
            name : 'Boxes',
            url : '/#/box',
            children : {
              create : {
                name : 'Add box',
                url : '/#/box/create'
              },
              show : {
                name : 'Box',
                url : ''
              }
            }
          }
        }
      }
    };
  });
