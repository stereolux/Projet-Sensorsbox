/**
* Box.js
*
* @description :: Demo model.
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
		link: {
			type: 'string',
			required: true
		},
		owner: {
			model:'user'
		}
	}

};
