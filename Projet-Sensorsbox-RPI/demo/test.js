var Mcp3008 = require('mcp3008.js'),
	Sensor = require('../src/sensors/sensor'),
	adc = new Mcp3008();


var sensor = new Sensor(adc, 0);
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
