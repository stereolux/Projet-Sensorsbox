'use strict';
var recordTimeouts = {};

var MeasureService = function() {};

MeasureService.prototype.watchSensor = function(sensor, sensorConfig, callback) {
	var batch = function() {
		if (typeof(recordTimeouts[sensorConfig.id]) !== 'undefined') {
			clearTimeout(recordTimeouts[sensorConfig.id]);
		}
		recordTimeouts[sensorConfig.id] = setTimeout(function() {
			sensor.read(function(measure) {
				batch();
				callback(measure);
			});
		}, parseInt(sensorConfig.measureFrequency));
	};
	batch();
};

MeasureService.prototype.unwatchSensor = function(sensorId) {
	if (typeof(recordTimeouts[sensorConfig.id]) !== 'undefined') {
		clearTimeout(recordTimeouts[sensorConfig.id]);
	}
};

module.exports = MeasureService;
