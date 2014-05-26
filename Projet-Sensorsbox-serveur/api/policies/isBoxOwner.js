/**
 * adduser
 *
 * @module      :: Policy
 * @description :: Simple policy to add session user to the request body
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
	Box.findOne({id:req.params.boxid}, function(err, box) {
		if (err) {
			return res.json(err);
		}
		else if (box.owner === req.user[0].id) {
			return next();
		}
		else {
			return res.send(403, { message: 'Not Authorized 1 ' });
		}
	});
};
