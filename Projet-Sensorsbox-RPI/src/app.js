'use strict';
var fs = require('fs'),
	socketIOClient = require('socket.io-client'),
	sailsIOClient = require('sails.io.js'),
	Sensor = require('./sensors/sensor'),
	ConfigController = require('./controllers/configController'),
	MeasureController = require('./controllers/measureController'),
	MeasureService = require('./services/measureService'),
	device;

var config = require('./config');

var isRpi = fs.existsSync('/proc/cpuinfo') && (fs.readFileSync('/proc/cpuinfo', {encoding: 'UTF-8'}).indexOf('BCM2708') > -1);
if (isRpi) {
	var mcp3008 = require('mcp3008.js');
	device = new mcp3008();
}
else {
	device = require('./helpers/fakeDevice');
}

var sensorMap = {};

var io = sailsIOClient(socketIOClient);
io.sails.url = config.serverUrl;

io.socket.on('sensor', function(body) {
	if (body.action === 'destroy') {
		delete sensorMap[body.data.id];
		measureService.unwatchSensor(body.data.id);
	}
	else {
		measureService.unwatchSensor(body.data.id);
		var sensor = new Sensor(device, parseInt(body.data.pin));
		sensorMap[body.data.id] = sensor;
		watchSensor(sensor, body.data);
	}
});

io.socket.on('box', function(body) {
	if (body.action === 'destroy') {
		for (var sensor in body.data.sensor) {
			delete sensorMap[sensor.id];
			measureService.unwatchSensor(sensor.id);
		}
	}
	else {
		body.data.sensor.forEach(function(sensorConfig) {
			measureService.unwatchSensor(sensorConfig.id);
			var sensor = new Sensor(device, parseInt(sensorConfig.pin));
			sensorMap[sensorConfig.id] = sensor;
			watchSensor(sensor, sensorConfig);
		});
	}
});

var watchSensor = function (sensor, sensorConfig) {
	measureService.watchSensor(sensor, sensorConfig, function(value) {
		var measure = {
			box: sensorConfig.box,
			sensor: sensorConfig.id,
			value: value
		};
		console.dir(measure);
		measureController.sendMeasure(measure, function(err, sent) {
			console.dir(sent);
		});
	});
};

var configController = new ConfigController(io, '/api/v1/config/');
var measureController = new MeasureController(io, '/api/v1/measure');

var measureService = new MeasureService();

configController.getConfig(config.boxId);
