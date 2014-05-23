/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	me: function(req,res) {
		if (req.isAuthenticated()) {
			return res.send(200, req.user[0]);
		}
		else {
			return res.send(403, { message: 'Not Authorized' });
		}
	}
};
