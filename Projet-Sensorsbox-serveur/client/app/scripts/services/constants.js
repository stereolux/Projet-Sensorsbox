'use strict';

angular.module('sensorsboxclientApp')
  .factory('constants', function () {

    var toReturn = {};

    // Fixing IE
    if (!window.location.origin) {
      window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    }
    toReturn.ROOT_URL = window.location.origin;
    toReturn.API_URL = toReturn.ROOT_URL + '/api/v1';

    toReturn.snapOpts = {
      transitionSpeed: 0.3
    };

    toReturn.MIN_TIME_DISPLAY_SPINNER = 200;
    toReturn.DESKTOP_MIN_WIDTH = 768;

    return toReturn;

  });
