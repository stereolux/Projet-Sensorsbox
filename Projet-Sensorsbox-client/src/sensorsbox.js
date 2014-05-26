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
			if (sensorsbox.watchedSensors.indexOf(measure.data.sensor) > -1) {
				sensorsbox.emit('measure', measure);
			}
		});
	};

	var initBox = function(sensorsbox) {
		io.socket.on('box', function (body) {
			if (sensorsbox.verbose) console.log(body);
			if (sensorsbox.watchedBoxes.indexOf(body.data.id) === -1) {
				if (sensorsbox.verbose) console.log('Watching all the sensors attached to the box...');
				handleMeasure(sensorsbox);
				sensorsbox.watchedBoxes.push(body.data.id);
				body.data.sensor.forEach(function(sensor) {
					sensorsbox.watchedSensors.push(sensor.id);
				});
				sensorsbox.emit('box', body);
			}
		});
	};

	var initSensor = function(sensorsbox) {
		io.socket.on('sensor', function (body) {
			if (sensorsbox.verbose) console.log(body);
			if (sensorsbox.watchedSensors.indexOf(body.data.id) === -1) {
				if (sensorsbox.verbose) console.log('Watching sensors...');
				handleMeasure(sensorsbox);
				sensorsbox.watchedSensors.push(body.data.id);
				sensorsbox.emit('sensor', body);
			}
		});
	};

	SensorsBox.prototype.watchBox = function(boxId, callback) {
		var route = '/api/v1/watch/box/';

		if (this.watchedBoxes.indexOf(boxId) > -1) {
			callback(new Error('You are already watching this box!'));
		}
		else {
			io.socket.get(this.host + route + boxId);
			initBox(this);
		}
	};

	SensorsBox.prototype.unwatchBox = function(boxId, callback) {
		var route = '/api/v1/unwatch/box/';

		if (this.watchedBoxes.indexOf(boxId) === -1) {
			callback(new Error('You are not watching this box!'));
		}
		else {
			io.socket.get(this.host + route + boxId, function(boxConfig, response) {
				if (_self.verbose) console.log('Unwatching all the sensors attached to the box...');
				_self.watchedBoxes.splice(_self.watchedBoxes.indexOf(boxConfig.id),1);
				boxConfig.sensor.forEach(function(sensor) {
					_self.watchedSensors.splice(_self.watchedSensors.indexOf(sensor.id),1);
				});
				callback(null, boxConfig);
			});
		}
	};

	SensorsBox.prototype.watchSensor = function(sensorId, callback) {
		var route = '/api/v1/watch/sensor/';

		if (this.watchedSensors.indexOf(sensorId) > -1) {
			callback(new Error('You are already watching this sensor!'));
		}
		else {
			io.socket.get(this.host + route + sensorId);
			initSensor(this);
		}
	};

	SensorsBox.prototype.unwatchSensor = function(sensorId, callback) {
		var _self = this;
		var route = '/api/v1/unwatch/sensor/';

		if (this.watchedSensors.indexOf(sensorId) === -1) {
			callback(new Error('You are not watching this sensor!'));
		}
		else {
			io.socket.get(this.host + route + sensorId, function(sensorConfig, response) {
				if (_self.verbose) console.log('Sensor unwatched...');
				_self.watchedSensors.splice(_self.watchedSensors.indexOf(sensorConfig.id),1);
				callback(null, sensorConfig);
			});
		}
	};

	window.SensorsBox = SensorsBox;
})();
