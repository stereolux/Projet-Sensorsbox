'use strict';
var ConfigController = function(socket, route) {
	if (!socket || typeof route !== 'string') throw new Error('You must define a socket and a route');
	this.io = socket;
	this.route = route;
};

ConfigController.prototype.getConfig = function(boxId, callback) {
	var _self = this;
	this.io.socket.get(this.route + boxId, function(body, response) {
		callback(null, body[0]);
	});
};

module.exports = ConfigController;

