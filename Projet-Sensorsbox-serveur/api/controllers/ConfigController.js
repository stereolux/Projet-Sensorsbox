/**
 * ConfigController
 *
 * @description :: Server-side logic for managing configs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	getConfig: function(req,res) {
		Box.find({id:req.params.boxid}).populate('owner').populate('sensor').exec(function(err,box) {
			if ((err) || (!box)) {
				return res.send(404, err);
			}
			else {
				if (box[0] && box[0].sensor) {

					/* Subscribe to any configuration change to this box and to new Sensors added to it */

					Box.subscribe(req.socket, box);

					/* Subscribe to any configuration change to the sensors of this box */

					Sensor.find({box:box[0].id}).exec(function(e,sensors){
						Sensor.subscribe(req.socket, sensors);
					});

					/* Initiate Record service for this box and cancel it when necessary */

					box[0].sensor.forEach(function(sensor){
						RecordService.recordSensor(sensor);
					});
					req.socket.on('disconnect', function () {
						box[0].sensor.forEach(function(sensor){
							RecordService.cancelRecordSensor(sensor);
						});
					});

					return res.send(box[0]);

				}
			}
		});
	}
};
