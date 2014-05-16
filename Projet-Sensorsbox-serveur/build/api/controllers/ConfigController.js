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
        box[0].sensor.forEach(function(sensor){
          console.log(sensor.id);
          RecordService.recordSensor(sensor);
        })
      	return res.send(box);
      }
	  });
  }	
	
};