;(function(root) {

	root.io.sails.autoConnect = false;

	var SensorsBox = root.SensorsBox || {};

	/*
	============================
	CONNECTION INITIALIZATION
	============================
	*/

	SensorsBox.connection = function(opts) {

		this.verbose = opts.verbose || false;

		this.watchedBoxes = [];
		this.watchedSensors = [];

		this.host = opts.host || 'http://beta.sensorsbox.com:80';
		this.socket = root.io.connect(this.host);

		SensorsBox.EventEmitter.inherits(this);
		initSocketEvents(this);
	};

	var initSocketEvents = function(connection) {
		connection.socket.on('connect', function(){
			connection.emit('connect');
		});
		connection.socket.on('measure', function (measure) {
			if (connection.verbose) console.log(measure);
			if (connection.watchedSensors.indexOf(measure.data.sensor) > -1) {
				connection.emit('measure', measure);
			}
		});
	};

	/*
	============================
	BOX SUBSCRIPTION
	============================
	*/

	var initBox = function(connection) {
		connection.socket.on('box', function (body) {
			if (connection.verbose) console.log(body);
			if (connection.watchedBoxes.indexOf(body.data.id) === -1) {
				if (connection.verbose) console.log('Watching all the sensors attached to the box...');
				connection.watchedBoxes.push(body.data.id);
				body.data.sensor.forEach(function(sensor) {
					connection.watchedSensors.push(sensor.id);
				});
				connection.emit('box', body);
			}
		});
	};

	SensorsBox.connection.prototype.watchBox = function(boxId, callback) {
		var route = '/api/v1/watch/box/';

		if (this.watchedBoxes.indexOf(boxId) > -1) {
			callback(new Error('You are already watching this box!'));
		}
		else {
			this.socket.get(this.host + route + boxId);
			initBox(this);
		}
	};

	SensorsBox.connection.prototype.unwatchBox = function(boxId, callback) {
		var _self = this;
		var route = '/api/v1/unwatch/box/';

		if (this.watchedBoxes.indexOf(boxId) === -1) {
			callback(new Error('You are not watching this box!'));
		}
		else {
			this.socket.get(this.host + route + boxId, function(boxConfig, response) {
				if (_self.verbose) console.log('Unwatching all the sensors attached to the box...');
				_self.watchedBoxes.splice(_self.watchedBoxes.indexOf(boxConfig.id),1);
				boxConfig.sensor.forEach(function(sensor) {
					_self.watchedSensors.splice(_self.watchedSensors.indexOf(sensor.id),1);
				});
				callback(null, boxConfig);
			});
		}
	};

	/*
	============================
	SENSOR SUBSCRIPTION
	============================
	*/

	var initSensor = function(connection) {
		connection.socket.on('sensor', function (body) {
			if (connection.verbose) console.log(body);
			if (connection.watchedSensors.indexOf(body.data.id) === -1) {
				if (connection.verbose) console.log('Watching sensors...');
				connection.watchedSensors.push(body.data.id);
				connection.emit('sensor', body);
			}
		});
	};

	SensorsBox.connection.prototype.watchSensor = function(sensorId, callback) {
		var route = '/api/v1/watch/sensor/';

		if (this.watchedSensors.indexOf(sensorId) > -1) {
			callback(new Error('You are already watching this sensor!'));
		}
		else {
			this.socket.get(this.host + route + sensorId);
			initSensor(this);
		}
	};

	SensorsBox.connection.prototype.unwatchSensor = function(sensorId, callback) {
		var _self = this;
		var route = '/api/v1/unwatch/sensor/';

		if (this.watchedSensors.indexOf(sensorId) === -1) {
			callback(new Error('You are not watching this sensor!'));
		}
		else {
			this.socket.get(this.host + route + sensorId, function(sensorConfig, response) {
				if (_self.verbose) console.log('Sensor unwatched...');
				_self.watchedSensors.splice(_self.watchedSensors.indexOf(sensorConfig.id),1);
				callback(null, sensorConfig);
			});
		}
	};

	root.SensorsBox = SensorsBox;
})(this);
