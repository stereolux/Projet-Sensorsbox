;(function(root) {

	root.io.sails.autoConnect = false;

	/*
	============================
	CONNECTION INITIALIZATION
	============================
	*/

	var connect = function(opts) {

		this.verbose = opts.verbose || false;

		this.host = opts.host || 'http://beta.sensorsbox.com:80';
		this.socket = root.io.connect(this.host);

		this.boxes = {};
		this.sensors = {};

//		SensorsBox.WatchStore.inherits(this);
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

	connect.prototype.watchBox = function(boxId, callback) {
		var route = '/api/v1/watch/box/';

		if (this.boxes[boxId]) {
			callback(new Error('You are already watching this box!'));
		}
		else {
			this.socket.get(this.host + route + boxId);
		}
	};

	connect.prototype.unwatchBox = function(boxId, callback) {
		var _self = this;
		var route = '/api/v1/unwatch/box/';

		if (this.boxes[boxId]) {
			this.socket.get(this.host + route + boxId, function(boxConfig, response) {
				if (_self.verbose) console.log('Unwatching all the sensors attached to the box...');
				delete _self.boxes[boxId];
				callback(null, boxConfig);
			});
		}
		else {
			callback(new Error('You are not watching this box!'));
		}
	};

	/*
	============================
	SENSOR SUBSCRIPTION
	============================
	*/

	connect.prototype.watchSensor = function(sensorId, callback) {
		var route = '/api/v1/watch/sensor/';

		if (this.sensors[sensorId]) {
			callback(new Error('You are already watching this sensor!'));
		}
		else {
			this.socket.get(this.host + route + sensorId);
		}
	};

	connect.prototype.unwatchSensor = function(sensorId, callback) {
		var _self = this;
		var route = '/api/v1/unwatch/sensor/';

		if (this.sensors[sensorId]) {
			this.socket.get(this.host + route + sensorId, function(sensorConfig, response) {
				if (_self.verbose) console.log('Sensor unwatched...');
				delete _self.sensors[sensorId];
				callback(null, sensorConfig);
			});
		}
		else {
			callback(new Error('You are not watching this sensor!'));
		}
	};

	root.SensorsBox = root.SensorsBox || {};
	root.SensorsBox.connect = connect;

})(this);
