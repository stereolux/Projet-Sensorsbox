'use strict';
var MeasureController = function(socket, route) {
	if (!socket || typeof route !== 'string') throw new Error('You must define a socket and a route');
	this.io = socket;
	this.route = route;
};

MeasureController.prototype.sendMeasure = function(measure, callback) {
	var _self = this;
	this.io.socket.post(this.route, measure, function(body, response) {
		callback(null, body);
	});
};

module.exports = MeasureController;

