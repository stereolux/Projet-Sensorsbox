'use strict';
var should = require('chai').should(),
	Sensor = require('../../src/sensors/sensor'),
	sensor;

var device = {
	read : function(channel, callback) {
		callback(42);
	}
};

describe('Sensor', function() {

	describe('new Sensor()', function() {

		it('should throw an error if no args', function() {
			(function() {
				new Sensor();
			}).should.throw(Error);
		});

		it('should throw an error if no channel', function() {
			(function() {
				new Sensor({});
			}).should.throw(Error);
		});

		it('should be instanciated with default values if no conversion and opts', function(done) {
			sensor = new Sensor(device, 0);
			sensor.opts.interval.should.equal(300);
			sensor.opts.tolerance.should.equal(3);
			sensor.on('change', function(measure) {
				measure.should.equal(42);
				done();
			});
		});

		it('should be instanciated with custom conversion and opts', function(done) {
			var conversion = function(value) { return value*2; },
				opts = {interval: 200, tolerance: 2};

			sensor = new Sensor(device, 0, conversion, opts);
			sensor.opts.interval.should.equal(200);
			sensor.opts.tolerance.should.equal(2);
			sensor.on('change', function(measure) {
				measure.should.equal(84);
				done();
			});
		});

		it('should be properly closed', function(done) {
			sensor = new Sensor(device, 0);
			sensor.on('change', function(measure) {
				sensor.poller._idleTimeout.should.equal(sensor.opts.interval);
				sensor.close();
			});
			sensor.on('close', function(measure) {
				sensor.poller._idleTimeout.should.equal(-1);
				done();
			});
		});

	});
});
