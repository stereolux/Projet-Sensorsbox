/**
* Box.js
*
* @description :: Measure model.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		value: {
			type: 'int',
			required: true
		},
		sensor: {
			model: 'sensor'
		}
	},
	connection: 'redis'

};
