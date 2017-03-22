/**
 * AuthController
 *
 * @description :: Server-side logic for managing authorizations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');

module.exports = {

	login: function(req,res) {
		passport.authenticate('local', function(err, user, info) {
			if ((err) || (!user)) {
				res.send(404, err);
				return;
			}
			req.logIn(user, function(err) {
				if (err) {
					res.send(404, err);
					return;
				}
				return res.send(user[0]);
			});
		})(req, res);
	},

	logout: function (req,res) {
		req.logout();
		res.send('logout successful');
	},

	_config: {}
};
