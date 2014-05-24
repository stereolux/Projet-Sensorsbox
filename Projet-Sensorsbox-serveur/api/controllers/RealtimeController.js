/**
 * RealtimeController
 *
 * @description :: Server-side logic for managing realtimes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	boxRealtime: function(req, res) {
		Box.find({id:req.params.boxid}).populate('sensor').exec(function(err,boxes){
			if ((err) || (!boxes)) {
				return res.send(404, err);
			}
			else if (boxes[0]) {
				SocketService.join(req.socket, 'box', boxes[0]);
				SocketService.message('box', 'list', boxes[0]);
				return res.send(boxes[0]);
			}
		});
	},

	sensorRealtime: function(req, res) {
		Sensor.find(req.params.sensorid).exec(function (err, sensors) {
			if ((err) || (!sensors)) {
				return res.send(404, err);
			}
			else if (sensors[0]) {
				SocketService.join(req.socket, 'sensor', sensors[0]);
				console.log('sensor_' + sensors[0].id);
				return res.send(sensors[0]);
			}
		});
	}

};
