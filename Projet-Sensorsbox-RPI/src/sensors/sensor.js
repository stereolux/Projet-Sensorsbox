'use strict';
var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	sensorEventNames = {
		change: 'change',
		close: 'close'
	};

/**
 * Sensor class, that represents a generic instance of a sensor.
 *
 * Below is a code snippet that shows the configuration possibilities.
 *
 * The opts object is optional. And each key inside it too.
 *
 * The values shown there are the defaults.
 *
 *   var Sensor = require('./sensor'),
 *     opts = {
 *       tolerance : 3,
 *       interval : 300
 *     },
 *     conversion = function(value) { return value; }
 *   var sensor = new Sensor(device, channel, conversion, opts);
 *
 * @constructor
 * @param {Object} device - the device on which the sensor is plugged
 * @param {Number} channel - the channel of the device on which the sensor is plugged
 * @param {function()} conversion - the function that converts the analog read to a meaningful measure
 * @param {Object} opts - the configuration object (to configure tolerance and interval between 2 reads)
 */
var Sensor = function(device, channel, conversion, opts) {
	// check for mandatory args
	if (!device || typeof channel !== 'number') throw new Error('You must define a device and a channel');

	EventEmitter.call(this);

	// configure the sensor
	this.device = device;
	this.channel = channel;
	this.conversion = conversion || function(value) { return value; };
	this.oldMeasure = -1;
	opts = opts || {};
	opts.interval = opts.interval || 300;
	opts.tolerance = opts.tolerance || 3;
	this.opts = opts;

	// start polling the sensor
	this._poll();
};
util.inherits(Sensor, EventEmitter);

/**
 * Trigger the polling of the sensor.
 */
Sensor.prototype._poll = function() {
	var _self = this;
	this.poller = setInterval(function() {
		_self.device.read(_self.channel, function(value) {
			var measure = _self.conversion(value);
			if (_self.oldMeasure === -1 || Math.abs(_self.oldMeasure - measure) >= _self.opts.tolerance) {
				_self.emit(sensorEventNames.change, measure);
			}
			_self.oldMeasure = measure;
		});
	}, this.opts.interval);
};

/**
 * Stop the polling of the sensor
 */
Sensor.prototype.close = function() {
	if (this.poller) {
		clearInterval(this.poller);
		this.emit(sensorEventNames.close);
	}
};

module.exports = Sensor;
