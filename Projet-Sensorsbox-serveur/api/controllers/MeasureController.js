/**
 * MeasureController
 *
 * @description :: Server-side logic for managing measures
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	createMeasure : function(req, res) {
		Measure.create(req.body).exec(function(err,created){
			Sensor.message(req.body.sensor, created, req);
			res.json(created);
		});
	}

};
