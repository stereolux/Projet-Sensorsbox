/**
 * SensorController
 *
 * @description :: Server-side logic for managing sensors
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	createSensor : function(req, res) {
		Sensor.create(req.body).exec(function(err,created){
			Box.message(req.body.box, created, req);
			res.json(created);
		});
	}

};
