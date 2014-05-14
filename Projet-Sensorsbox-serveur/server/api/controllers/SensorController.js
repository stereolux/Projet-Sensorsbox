/**
 * SensorController
 *
 * @description :: Server-side logic for managing sensors
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	findAll: function(req,res){

		Box.find({owner:req.user[0].id}).exec(function(err, box){
      if ((err) || (!box)) {
        return res.send(404, err);
      }
			else {
				var boxids = [];
				box.forEach(function(thisbox){
					boxids.push(thisbox.id)
				});
				Sensor.find().where({box:boxids}).populate('box').exec(function(err, sensor){
		      if ((err) || (!sensor)) {
		        return res.send(404, err);
		      }
					else {
						return res.send(sensor);
					}
			  });
			}
	  });
  }
};