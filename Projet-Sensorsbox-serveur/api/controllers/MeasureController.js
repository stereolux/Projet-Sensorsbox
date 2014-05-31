/**
 * MeasureController
 *
 * @description :: Server-side logic for managing measures
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	create : function(req, res) {
		if (!RecordService.recordTimeouts[req.body.sensor]) {
			Sensor.find(req.body.sensor).exec(function(err, sensors) {
				if (err) {
					var subject = 'Measures creation - Failed to find sensor to create timeout';
					EmailService.sendError(subject, err);
				}
				else {
					RecordService.recordSensor(sensors[0]);
				}
			});
		}
		Measure.create(req.body).exec(function(err,measure){
			SocketService.message('measure', 'created', measure);
			res.json(measure);
		});
	}

};
