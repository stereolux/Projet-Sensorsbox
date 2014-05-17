var device = {
	read: function(channel, callback) {
		var measure = Math.floor(Math.random() * 1024);
		callback(measure);
	}
};

module.exports = device;
