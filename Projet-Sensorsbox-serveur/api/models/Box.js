/**
* Box.js
*
* @description :: Box model.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		name: {
			type: 'string',
			required: true
		},
		description: {
			type: 'string',
			required: true
		},
		owner: {
			model:'user'
		},
		sensor: {
			collection: 'sensor',
			via: 'box'
		}
	}

};
