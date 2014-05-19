'use strict';
var should = require('chai').should(),
	MeasureController = require('../../src/controllers/measureController'),
	controller;

var fakeSocket = {
	socket: {
		post: function(route, data, callback) {
			callback('ok', {});
		}
	}
};

describe('MeasureController', function() {

	describe('new MeasureController()', function() {

		it('should throw an error if no args', function() {
			(function() {
				new MeasureController();
			}).should.throw(Error);
		});

		it('should throw an error if no route', function() {
			(function() {
				new MeasureController(fakeSocket);
			}).should.throw(Error);
		});

		it('should be correctly instanciated', function() {
			controller = new MeasureController(fakeSocket, '/dummyRoute');
			controller.io.should.equal(fakeSocket);
			controller.route.should.equal('/dummyRoute');
		});
	});

	describe('MeasureController.sendMeasure()', function() {

		it('should get the route and return the box Measure', function() {
			controller = new MeasureController(fakeSocket, '/dummyRoute');
			controller.sendMeasure('dummyMeasure', function(err, sent) {
				should.not.exist(err);
				sent.should.equal('ok');
			});
		});

	});
});
