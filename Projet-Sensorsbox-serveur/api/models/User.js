/**
* User.js
*
* @description :: User model.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');

module.exports = {
	attributes: {
		email: {
			type: 'string',
			required: true,
			email: true,
			unique: true
		},
		firstname: {
			type: 'string',
			required: true
		},
		lastname: {
			type: 'string',
			required: true
		},
		password: {
			type: 'string',
			required: true
		},
		box: {
			collection: 'box',
			via: 'owner'
		},

		toJSON: function() {
			var obj = this.toObject();
			delete obj.password;
			return obj;
		}
	},

	beforeCreate: function(user, cb) {
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(user.password, salt, function(err, hash) {
				if (err) {
					console.log(err);
					cb(err);
				}
				else {
					user.password = hash;
					cb(null, user);
				}
			});
		});
	}

};
