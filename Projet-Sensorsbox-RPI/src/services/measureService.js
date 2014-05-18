'use strict';
var recordTimeouts = {};

var MeasureService = function() {};

MeasureService.prototype.watchSensor = function(sensor, sensorConfig, callback) {
	var batch = function() {
		if (typeof(recordTimeouts[sensor.id])!=='undefined'){
			clearTimeout(recordTimeouts[sensor.id]);
		}
		recordTimeouts[sensor.id] = setTimeout(function() {
			sensor.read(function(measure) {
				batch();
				callback(measure);
			});
		}, parseInt(sensorConfig.measureFrequency));
	};
	batch();
};


module.exports = MeasureService;
