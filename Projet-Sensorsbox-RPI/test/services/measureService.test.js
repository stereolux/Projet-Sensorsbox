'use strict';
var should = require('chai').should(),
	MeasureService = require('../../src/services/measureService'),
	Sensor = require('../../src/sensors/sensor'),
	fakeDevice = require('../../src/helpers/fakeDevice'),
	service;

var sensor = new Sensor(fakeDevice, 0),
	sensorConfig = {id: 'dummyId', measureFrequency: 100};

describe('MeasureService', function() {

	describe('new MeasureService()', function() {

		it('should be correctly instanciated', function() {
			var service = new MeasureService();
			should.exist(service);
		});

	});

	describe('MeasureService.watchSensor()', function() {

		it('should return measure periodicaly', function(done) {
			var counter = 0,
				times = 10;
			service = new MeasureService();
			setTimeout(function() {
				counter.should.equal(times);
				done();
			}, sensorConfig.measureFrequency * times + 50);
			service.watchSensor(sensor, sensorConfig, function(measure) {
				counter++;
				should.exist(measure);
			});
		});

	});
});
