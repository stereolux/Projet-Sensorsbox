var Sensor = require('../src/sensors/sensor');

var device = {
	read: function(channel, callback) {
		var measure = Math.floor(Math.random() * 1024);
		callback(measure);
	}
};

var sensor = new Sensor(device, 0);
sensor.poll();

sensor.on('change', function(measure) {
	console.log(measure);
});

sensor.on('close', function() {
	console.log('Closed');
});

setTimeout(function() {
	sensor.close();
}, 10000);
