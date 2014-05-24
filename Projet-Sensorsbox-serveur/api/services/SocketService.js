exports.message = function(model, action, instance) {

	var data = {};
	data[action] = instance;

	var rooms = [];
	if (model === 'box') {
		rooms.push('box_' + instance.id);
	}
	else if (model === 'sensor') {
		rooms.push('sensor_' + instance.id);
		rooms.push('box_' + instance.box);
	}
	else if (model === 'measure') {
		rooms.push('sensor_' + instance.sensor);
		rooms.push('box_' + instance.box);
	}

	rooms.forEach(function(room){
		sails.sockets.broadcast(room, model, data);
	})

};

exports.join = function(socket, model, instance) {

	sails.sockets.join(socket, model + '_' + instance.id);

};
