/**
* Record.js
*
* @description :: Record model.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		mean: {
			type: 'float'
		},
		maximum: {
			type: 'float'
		},
		minimum: {
			type: 'float'
		},
		timerange: {
			type: 'int'
		},
		sensor: {
			model: 'sensor'
		}
	}

};
