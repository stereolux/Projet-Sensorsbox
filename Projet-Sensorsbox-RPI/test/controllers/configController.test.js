'use strict';
var should = require('chai').should(),
	ConfigController = require('../../src/controllers/configController'),
	controller;

var fakeSocket = {
	socket: {
		get: function(route, callback) {
			callback(['ok'], {});
		}
	}
};

describe('ConfigController', function() {

	describe('new ConfigController()', function() {

		it('should throw an error if no args', function() {
			(function() {
				new ConfigController();
			}).should.throw(Error);
		});

		it('should throw an error if no route', function() {
			(function() {
				new ConfigController(fakeSocket);
			}).should.throw(Error);
		});

		it('should be correctly instanciated', function() {
			controller = new ConfigController(fakeSocket, '/dummyRoute');
			controller.io.should.equal(fakeSocket);
			controller.route.should.equal('/dummyRoute');
		});
	});

	describe('ConfigController.getConfig()', function() {

		it('should get the route and return the box config', function() {
			controller = new ConfigController(fakeSocket, '/dummyRoute');
			controller.getConfig('dummBoxId', function(err, config) {
				should.not.exist(err);
				config.should.equal('ok');
			});
		});

	});
});
