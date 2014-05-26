/**
 * RealtimeController
 *
 * @description :: Server-side logic for managing realtimes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	boxWatch: function(req, res) {
		Box.find({id:req.params.boxid}).populate('sensor').exec(function(err,boxes){
			if ((err) || (!boxes)) {
				return res.send(404, err);
			}
			else if (boxes[0]) {
				SocketService.join(req.socket, 'box', boxes[0]);
				SocketService.join(req.socket, 'watch_box', boxes[0]);
				SocketService.message('box', 'list', boxes[0]);
			}
		});
	},
	boxUnwatch: function(req, res) {
		Box.find({id:req.params.boxid}).populate('sensor').exec(function(err,boxes){
			if ((err) || (!boxes)) {
				return res.send(404, err);
			}
			else if (boxes[0]) {
				SocketService.leave(req.socket, 'box', boxes[0]);
				SocketService.leave(req.socket, 'watch_box', boxes[0]);
			}
		});
	},

	sensorWatch: function(req, res) {
		Sensor.find(req.params.sensorid).exec(function (err, sensors) {
			if ((err) || (!sensors)) {
				return res.send(404, err);
			}
			else if (sensors[0]) {
				SocketService.join(req.socket, 'sensor', sensors[0]);
				SocketService.join(req.socket, 'watch_sensor', sensors[0]);
				SocketService.message('sensor', 'list', sensors[0]);
			}
		});
	},
	sensorUnwatch: function(req, res) {
		Sensor.find(req.params.sensorid).exec(function (err, sensors) {
			if ((err) || (!sensors)) {
				return res.send(404, err);
			}
			else if (sensors[0]) {
				SocketService.leave(req.socket, 'sensor', sensors[0]);
				SocketService.leave(req.socket, 'watch_sensor', sensors[0]);
			}
		});
	}

};
