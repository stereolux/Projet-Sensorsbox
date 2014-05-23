'use strict';

describe('Directive: sensorsbox', function () {

  // load the directive's module
  beforeEach(module('sensorsboxclientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sensorsbox></sensorsbox>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the sensorsbox directive');
  }));
});
