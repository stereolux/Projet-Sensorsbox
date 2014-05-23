/**
 * RealtimeController
 *
 * @description :: Server-side logic for managing realtimes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	boxRealtime: function(req, res) {
		Box.find({id:req.params.boxid}).populate('sensor').exec(function(err,box){
			if ((err) || (!box)) {
				return res.send(404, err);
			}
			else {
				if (box[0] && box[0].sensor) {
					box[0].sensor.forEach(function(sensor){
						module.exports.sensorRealtime(req, res);
					});
				}
				res.send(box[0])
			}
		});
	},

	sensorRealtime: function(req, res) {
		Sensor.find(req.params.sensorid).exec(function (err, sensors) {
			if ((err) || (!sensors)) {
				return res.send(404, err);
			}
			else {
				Sensor.subscribe(req.socket, sensors);
				res.send(sensors[0])
			}
		});
	}

};
