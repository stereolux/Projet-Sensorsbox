'use strict';

angular.module('sensorsboxclientApp')
  .factory('state', function () {

    var toReturn = {
      isMobile : null,
      isUserSignedinServer : null
    };

    return toReturn;

  });
