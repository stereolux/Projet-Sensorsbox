/**
 * ConfigController
 *
 * @description :: Server-side logic for managing configs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	getConfig: function(req,res){
		Box.find({id:req.params.boxid}).populate('owner').populate('sensor').exec(function(err,box){
			if ((err) || (!box)) {
				return res.send(404, err);
			}
			else {
				if (box[0] && box[0].sensor) {
					box[0].sensor.forEach(function(sensor){
						console.log(sensor.id);
						RecordService.recordSensor(sensor);
					});
					Sensor.find({box:box[0].id}).exec(function(e,sensors){
						Sensor.subscribe(req.socket, sensors);
					});
					return res.send(box[0]);					
				}
			}
		});
	}
};