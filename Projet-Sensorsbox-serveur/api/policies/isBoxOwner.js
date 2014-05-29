/**
 * adduser
 *
 * @module      :: Policy
 * @description :: Simple policy to add session user to the request body
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

	var boxid = req.params.boxid ? req.params.boxid : req.body.box;

	Box.findOne({id:boxid}, function(err, box) {
		if (err) {
			return res.json(err);
		}
		else if (box && (box.owner === req.user[0].id)) {
			return next();
		}
		else {
			return res.send(403, { message: 'Not Authorized 1 ' });
		}
	});
};
