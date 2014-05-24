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
io.socket.on('sensor', function(response) {
	var sensor = sensorMap[response.id];
	watchSensor(sensor, response.data);
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

configController.getConfig(config.boxId, function(err, boxConfig) {
	boxConfig.sensor.forEach(function(sensorConfig) {
		var sensor = new Sensor(device, parseInt(sensorConfig.pin));
		sensorMap[sensorConfig.id] = sensor;
		watchSensor(sensor, sensorConfig);
	});
});
