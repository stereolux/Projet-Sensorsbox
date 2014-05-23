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
			type: 'float',
			required: true
		},
		recordFrequency: {
			type: 'float',
			required: true
		},
		measureFrequency: {
			type: 'float',
			required: true
		},
		box: {
			model:'box',
			required: true
		}
	}

};
