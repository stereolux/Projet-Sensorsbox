/**
* Sensor.js
*
* @description :: Sensor model.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		name: {
			type: 'string',
			required: true
		},
		description: {
			type: 'string'
		},
		pin: {
			type: 'int',
			required: true
		},
		recordFrequency: {
			type: 'int',
			required: true
		},
		measureFrequency: {
			type: 'int',
			required: true
		},
		box: {
			model:'box',
			required: true
		}
	}

};
