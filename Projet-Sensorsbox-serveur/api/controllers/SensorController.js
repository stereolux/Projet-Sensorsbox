/**
 * SensorController
 *
 * @description :: Server-side logic for managing sensors
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	create : function(req, res) {
		Sensor.create(req.body).exec(function(err,sensor){
			if (err) { res.end(404, err); }
			else {
				SocketService.message('sensor', 'created', sensor);
				res.json(sensor);
			}
		});
	},
	update : function(req, res) {
		Sensor.update(req.params.sensorid, req.body).exec(function(err,sensors){
			if (err) { res.end(404, err); }
			else {
				SocketService.message('sensor', 'updated', sensors[0]);
				res.json(sensors[0]);
			}
		});
	},
	destroy : function(req, res) {
		Sensor.destroy(req.params.sensorid).exec(function(err,sensors){
			if (err) { res.end(404, err); }
			else {
				SocketService.message('sensor', 'destroyed', sensors[0]);
				res.json(sensors[0]);
			}
		});
	}

};
