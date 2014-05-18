'use strict';
var socketIOClient = require('socket.io-client'),
	sailsIOClient = require('sails.io.js'),
	Sensor = require('./sensors/sensor'),
	fakeDevice = require('./helpers/fakeDevice'),
	ConfigController = require('./controllers/configController'),
	MeasureController = require('./controllers/measureController'),
	MeasureService = require('./services/measureService');

var config = {
	serverUrl: 'http://beta.sensorsbox.com',
	boxId:'5370b765ee9999020070ae8e'
};

var sensorMap = {};

var io = sailsIOClient(socketIOClient);
io.sails.url = config.serverUrl;
io.socket.on('sensor', function(response) {
	var sensor = sensorMap[response.id];
	watchSensor(sensor, response.data);
});

var watchSensor = function (sensor, sensorConfig) {
	measureService.watchSensor(sensor, sensorConfig, function(value) {
		var measure = {
			sensor: sensorConfig.id,
			value: value
		};
		console.dir(measure);
		measureController.sendMeasure(measure, function(err, sent) {
			console.log(sent);
		});
	});
};

var configController = new ConfigController(io, '/api/v1/config/');
var measureController = new MeasureController(io, '/api/v1/measure');

var measureService = new MeasureService();

configController.getConfig(config.boxId, function(err, boxConfig) {
	boxConfig.sensor.forEach(function(sensorConfig) {
		var sensor = new Sensor(fakeDevice, parseInt(sensorConfig.pin));
		sensorMap[sensorConfig.id] = sensor;
		watchSensor(sensor, sensorConfig);
	});
});
