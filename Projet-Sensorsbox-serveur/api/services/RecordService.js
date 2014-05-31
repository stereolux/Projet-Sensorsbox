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
exports.recordTimeouts = recordTimeouts;

exports.recordSensor = function(sensor) {
	var _self = this;
	recordTimeouts[sensor.id] = setTimeout(function() {
		getValues(sensor, function(record){
			if (record) {
				Record.create(record).exec(function(err, record){
					if (err) {
						var subject = 'Record creation failure';
						EmailService.sendMail(subject, err);
						console.log(err);
					}
					else {
						console.log('Record saved');
						console.dir(record);

						Measure.destroy({sensor:sensor.id}).exec(function(err) {
							if (err) {
								var subject = 'Measures destruction failure';
								EmailService.sendError(subject, err);
								console.log(err);
							}
							console.log('Measures destroyed');
							_self.recordSensor(sensor);
						});
					}
				});
			}
		});
	}, sensor.recordFrequency);
};
