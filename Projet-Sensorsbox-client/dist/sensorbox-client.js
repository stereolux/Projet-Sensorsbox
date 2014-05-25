;(function() {
	var EventEmitter = function() {};

	EventEmitter.prototype.on = function(event, callback) {
		this._events = this._events || {};
		this._events[event] = this._events[event] || [];
		this._events[event].push(callback);
	};

	EventEmitter.prototype.off = function(event, callback) {
		this._events = this._events || {};
		if(event in this._events === false) return;
		this._events[event].splice(this._events[event].indexOf(callback), 1);
	};

	EventEmitter.prototype.emit = function(event /* , args... */){
		this._events = this._events || {};
		if( event in this._events === false  )	return;
		for(var i = 0; i < this._events[event].length; i++){
			this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	};

	EventEmitter.inherits = function(object){
		var functions = ['on', 'off', 'emit'];
		for(var i = 0; i < functions.length; i ++){
			if(typeof object === 'function'){
				object.prototype[functions[i]] = EventEmitter.prototype[functions[i]];
			}
			else{
				object[functions[i]] = EventEmitter.prototype[functions[i]];
			}
		}
	};

	window.EventEmitter = EventEmitter;
})();

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
