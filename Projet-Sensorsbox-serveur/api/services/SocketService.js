exports.message = function(model, action, instance) {

	var data = {
		action: action,
		data: instance
	};

	var rooms = [];
	if (model === 'box') {
		rooms.push('box_' + instance.id);
	}
	else if (model === 'sensor') {
		rooms.push('box_' + instance.box);
		rooms.push('sensor_' + instance.id);
	}
	else if (model === 'measure') {
		rooms.push('realtimebox_' + instance.box);
		rooms.push('realtimesensor_' + instance.sensor);
	}

	rooms.forEach(function(room){
		sails.sockets.broadcast(room, model, data);
	})

};

exports.join = function(socket, model, instance) {

	sails.sockets.join(socket, model + '_' + instance.id);

};

exports.leave = function(socket, model, instance) {

	sails.sockets.leave(socket, model + '_' + instance.id);

};
