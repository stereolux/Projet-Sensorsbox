/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!documentation/
 */


module.exports.policies = {

	/* Default */

	'*': 'passportAuthenticated',

	/* Box */

	ConfigController: {
		'*': true
	},
	MeasureController: {
		'*': true
	},

	/* Authentication and User Management */

	UserController: {
		'create': true,
	},
	AuthController: {
		'login': true
	},

	/* Admin */

	BoxController: {
		'find': true,
		'findOne': true,
		'create': ['passportAuthenticated', 'addUser'],
		'update': ['passportAuthenticated', 'isBoxOwner'],
		'destroy': ['passportAuthenticated', 'isBoxOwner']
	},
	SensorController: {
		'find': true,
		'findOne': true,
		'create': ['passportAuthenticated', 'isBoxOwner'],
		'update': ['passportAuthenticated', 'isSensorOwner'],
		'delete': ['passportAuthenticated', 'isSensorOwner']
	},

	/* API Users */

	WatchController: {
		'*': true
	},
	RecordController: {
		'*': true
	}

};
