;(function() {
	var SensorsBox = function(opts) {
		opts = opts || {};
		window.io.sails.url = this.host = opts.host || 'http://beta.sensorsbox.com:80';
		this.verbose = opts.verbose || false;
		EventEmitter.inherits(this);
		this.watchedBoxes = [];
		this.watchedSensors = [];
	};


	var handleMeasure = function(sensorsbox) {
		io.socket.on('measure', function (measure) {
			if (sensorsbox.verbose) console.log(measure);
			if (sensorsbox.watchedSensors.indexOf(measure.created.sensor) > -1) {
				sensorsbox.emit('measure', measure);
			}
		});
	};

	SensorsBox.prototype.watchBox = function(boxId, callback) {
		var _self = this;
		var route = '/api/v1/realtime/box/';

		if (this.watchedBoxes.indexOf(boxId) > -1) {
			callback(new Error('You are already watching this box!'));
		}
		else {
			io.socket.get(this.host + route + boxId, function(boxConfig, response) {
				if (_self.verbose) console.log('Watching all the sensors attached to the box...');
				handleMeasure(_self);
				_self.watchedBoxes.push(boxConfig.id);
				boxConfig.sensor.forEach(function(sensor) {
					_self.watchedSensors.push(sensor.id);
				});
				callback(null, boxConfig);
			});
		}
	};

	SensorsBox.prototype.watchSensor = function(sensorId, callback) {
		var _self = this;
		var route = '/api/v1/realtime/sensor/';

		if (this.watchedSensors.indexOf(sensorId) > -1) {
			callback(new Error('You are already watching this sensor!'));
		}
		else {
			io.socket.get(this.host + route + sensorId, function(sensorConfig, response) {
				if (_self.verbose) console.log('Watching the sensor...');
				handleMeasure(_self);
				_self.watchedSensors.push(sensorConfig.id);
				callback(null, sensorConfig);
			});
		}
	};

	window.SensorsBox = SensorsBox;
})();
