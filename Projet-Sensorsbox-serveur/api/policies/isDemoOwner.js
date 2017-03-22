/**
 * adduser
 *
 * @module      :: Policy
 * @description :: Simple policy to add session user to the request body
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

	var demoid = req.params.id ? req.params.id : req.body.demo;

	Demo.findOne({id:demoid}, function(err, demo) {
		console.log(demo);
		console.log(demo.owner);
		console.log(req.user[0].id);
		if (err) {
			return res.json(err);
		}
		else if (demo && (demo.owner === req.user[0].id)) {
			return next();
		}
		else {
			return res.send(403, { message: 'Not Authorized 5' });
		}
	});
};
