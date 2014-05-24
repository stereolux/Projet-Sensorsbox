/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://links.sailsjs.org/docs/config/routes
 */

module.exports.routes = {

	/*
	=======================
		BOX ROUTES
	=======================
	*/

	/* Config */

	'get /api/v1/config/:boxid': {
		controller: 'config',
		action: 'getConfig',
		cors: true
	},

	/* Measures */

	'post /api/v1/measure': {
		controller: 'measure',
		action: 'create'
	},

	/*
	=======================
		ADMIN ROUTES
	=======================
	*/

	/* Authentication */

	'post /api/v1/login': {
		controller: 'auth',
		action: 'login'
	},
	'get /api/v1/logout': {
		controller: 'auth',
		action: 'logout'
	},

	/* Users */

	'get /api/v1/user/me': {
		controller: 'user',
		action: 'me'
	},

	/* Sensors */

	'post /api/v1/sensor': {
		controller: 'sensor',
		action: 'create'
	},
	'put /api/v1/sensor/:sensorid': {
		controller: 'sensor',
		action: 'update'
	},
	'delete /api/v1/sensor/:sensorid': {
		controller: 'sensor',
		action: 'destroy'
	},

	/*
	=======================
		API USER ROUTES
	=======================
	*/

	/* Realtime */

	'get /api/v1/realtime/box/:boxid': {
		controller: 'realtime',
		action: 'boxRealtime',
		cors: true
	},
	'get /api/v1/realtime/sensor/:sensorid': {
		controller: 'realtime',
		action: 'sensorRealtime',
		cors: true
	}

};
