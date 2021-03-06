;(function(root) {

	root.io.sails.autoConnect = false;

	/*
	============================
	CONNECTION INITIALIZATION
	============================
	*/

	var Connection = function(opts) {

		opts = opts || {};

		this.verbose = opts.verbose || false;

		this.host = opts.host || 'http://beta.sensorsbox.com';
		this.port = opts.port || 80;
		this.socket = root.io.connect(this.host + ':' + this.port);

		this.boxes = {};
		this.sensors = {};

		SensorsBox.EventEmitter.inherits(this);
		initSocketEvents(this);
	};

	/*
	============================
	EVENT PROPAGATION
	============================
	*/

	var initSocketEvents = function(connection) {
		connection.socket.on('connect', function(){
			if (connection.verbose) console.log('connection success');
			connection.emit('connect');
		});
		connection.socket.on('measure', function (measure) {
			if (connection.verbose) console.log(measure);
			connection.emit('measure', measure);
		});
		connection.socket.on('box', function (body) {
			if (connection.verbose) console.log(body);
			connection.boxes[body.data.id] = body.data;
			body.data.sensor.forEach(function(sensor){
				connection.sensors[sensor.id] = sensor;
			});
			connection.emit('box', body);
		});
		connection.socket.on('sensor', function (body) {
			if (connection.verbose) console.log(body);
			connection.sensors[body.data.id] = body.data;
			connection.emit('sensor', body);
		});
	};

	/*
	============================
	BOX SUBSCRIPTION
	============================
	*/

	Connection.prototype.watchBox = function(boxId, callback) {
		var _self = this;
		var route = '/api/v1/watch/box/';

		if (this.boxes[boxId]) {
			if (callback) {
				callback(new Error('You are already watching this box!'));
			}
		}
		else {
			this.socket.get(this.host + route + boxId, function(boxConfig, response){
				_self.boxes[boxId] = boxConfig;
				boxConfig.sensor.forEach(function(sensor){
					_self.sensors[sensor.id] = sensor;
				});
				if (callback) {
					callback(null, boxConfig);
				}
			});
		}
	};

	Connection.prototype.unwatchBox = function(boxId, callback) {
		var _self = this;
		var route = '/api/v1/unwatch/box/';

		if (this.boxes[boxId]) {
			this.socket.get(this.host + route + boxId, function(boxConfig, response) {
				if (_self.verbose) console.log('Unwatching all the sensors attached to the box...');
				delete _self.boxes[boxId];
				boxConfig.sensor.forEach(function(sensor){
					delete _self.sensors[sensor.id];
				});
				if (callback) {
					callback(null, boxConfig);
				}
			});
		}
		else {
			if (callback) {
				callback(new Error('You are not watching this box!'));
			}
		}
	};

	/*
	============================
	SENSOR SUBSCRIPTION
	============================
	*/

	Connection.prototype.watchSensor = function(sensorId, callback) {
		var _self = this;
		var route = '/api/v1/watch/sensor/';

		if (this.sensors[sensorId]) {
			callback(new Error('You are already watching this sensor!'));
		}
		else {
			this.socket.get(this.host + route + sensorId, function(sensorConfig, response){
				_self.sensors[sensorId] = sensorConfig;
				if (callback) {
					callback(null, sensorConfig);
				}
			});
		}
	};

	Connection.prototype.unwatchSensor = function(sensorId, callback) {
		var _self = this;
		var route = '/api/v1/unwatch/sensor/';

		if (this.sensors[sensorId]) {
			this.socket.get(this.host + route + sensorId, function(sensorConfig, response) {
				if (_self.verbose) console.log('Sensor unwatched...');
				delete _self.sensors[sensorId];
				if (callback) {
					callback(null, sensorConfig);
				}
			});
		}
		else {
			callback(new Error('You are not watching this sensor!'));
		}
	};

	root.SensorsBox = root.SensorsBox || {};
	root.SensorsBox.Connection = Connection;

})(window);
