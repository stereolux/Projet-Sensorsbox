'use strict';
var should = require('chai').should(),
	fakeDevice = require('../../src/helpers/fakeDevice'),
	device;

describe('fakeDevice', function() {

	describe('fakeDevice.read()', function() {

		it('should pass a measure between 0 and 1023 in the callback', function() {
			fakeDevice.read(0, function (measure) {
				measure.should.be.at.least(0);
				measure.should.be.at.most(1024);
			});
		});

	});

});
