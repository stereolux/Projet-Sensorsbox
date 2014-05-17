'use strict';
var ConfigController = function(socket, route) {
	this.route = route;
	this.io = socket;
};

ConfigController.prototype.getConfig = function(boxId, callback) {
	var _self = this;
	this.io.socket.get(this.route + boxId, function(body, response) {
		callback(null, body[0]);
	});
};

module.exports = ConfigController;

