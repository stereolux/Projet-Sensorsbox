/**
 * adduser
 *
 * @module      :: Policy
 * @description :: Simple policy to add session user to the request body
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
	Sensor.findOne({id:req.params.id}).populate('box').exec(function(err, sensor) {
		if (sensor.box.owner === req.user[0].id){
			return next();
		}
		else {
			return res.send(403, { message: 'Not Authorized 2' });
		}
	});
};
