var getValues = function(sensor, callback){
	Measure.find({sensor:sensor.id}).exec(function(err, measures){
		if (measures.length === 0) {
			callback();
		}
		else {
			var measuresValues = [];
			var measuresTotal = 0;
			measures.forEach(function(measure){
				measuresValues.push(measure.value);
				measuresTotal += measure.value;
			});
			var mean = measuresTotal / measuresValues.length;
			callback({
				mean: mean,
				minimum: Math.min.apply(null, measuresValues),
				maximum: Math.max.apply(null, measuresValues),
				timerange: sensor.recordFrequency,
				sensor: sensor.id
			});
		}
	});
}

var recordTimeouts = {};

exports.recordSensor = function(sensor) {
	var batch = function() {
		if (typeof(recordTimeouts[sensor.id])!=='undefined'){
			clearTimeout(recordTimeouts[sensor.id]);
		}
		recordTimeouts[sensor.id] = setTimeout(function() {
			getValues(sensor, function(record){
				if (record) {
					Record.create(record).exec(function(err, record){
						if (err) {
							var msg = 'Record creation failure:\nerr:';
							msg += JSON.stringify(err) + '\nerr:';
							msg += JSON.stringify(record) + '\n\nThe SensorsBox Server';
							EmailService.sendMail(msg, 'Record creation failure', 'vkammerer@gmail.com, xavier.seignard@gmail.com', function(){
								console.log('email sent');
							});
							console.log(err);
						}
						else {
							console.log('Record saved');
							console.dir(record);

							Measure.destroy({sensor:sensor.id}).exec(function(err) {
								if (err) {
									var msg = 'Measures destruction failure:\nerr:';
									msg += JSON.stringify(err) + '\n\nThe SensorsBox Server';
									EmailService.sendMail(msg, 'Measures destruction failure', 'vkammerer@gmail.com, xavier.seignard@gmail.com', function(){
										console.log('email sent');
									});
									console.log(err);
								}
								console.log('Measures destroyed');
							});
						}
					});
				}
			});
			batch();
		}, sensor.recordFrequency);
	};
	batch();
};

exports.cancelRecordSensor = function(sensor) {
	console.log(sensor);
	if (typeof(recordTimeouts[sensor.id])!=='undefined'){
		clearTimeout(recordTimeouts[sensor.id]);
	}
};
