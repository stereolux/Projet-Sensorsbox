'use strict';
var MeasureController = function(socket, route) {
	this.route = route;
	this.io = socket;
};

MeasureController.prototype.sendMeasure = function(measure, callback) {
	var _self = this;
	this.io.socket.post(this.route, measure, function(body, response) {
		callback(null, body);
	});
};

module.exports = MeasureController;

