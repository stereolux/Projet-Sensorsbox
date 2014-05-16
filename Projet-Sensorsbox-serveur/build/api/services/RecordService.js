// EmailService.js - in api/services

var getValues = function(sensor, cb){
    Measure.find({sensor:sensor.id}).exec(function(err, measures){

//    	console.log(measures);

    	if (measures.length === 0) {
	    	cb({});
    	}
    	else {
	    	var measuresValues = [];
	    	var measuresTotal = 0;
	    	measures.forEach(function(measure){
	    		var value = parseInt(measure.value);    		
	    		measuresValues.push(value);
	    		measuresTotal += value;
	    	});
	    	var mean = measuresTotal / measuresValues.length;
/*
	    	console.log({
	    		mean: mean,
	    		min: Math.min.apply(null, measuresValues),
	    		max: Math.max.apply(null, measuresValues),
	    		timerange: sensor.recordFrequency,
	    		sensor: sensor.id
	    	});
*/
	    	cb({
	    		mean: mean,
	    		min: Math.min.apply(null, measuresValues),
	    		max: Math.max.apply(null, measuresValues),
	    		timerange: sensor.recordFrequency,
	    		sensor: sensor.id
	    	});

    	}
//    	console.dir(measures);
    })	
}

var recordTimeouts = {};

exports.recordSensor = function(sensor) {

	var batch = function() {
		if (typeof(recordTimeouts[sensor.id])!=='undefined'){
			clearTimeout(recordTimeouts[sensor.id]);
		}

		getValues(sensor, function(record){
			recordTimeouts[sensor.id] = setTimeout(function() {
				Record.create(record).exec(function(err, record){
					console.log(err);
					console.log(record);
					Measure.destroy({sensor:sensor.id});
				});
				batch();
			}, parseInt(sensor.recordFrequency));				
		});
	};
	batch();

};