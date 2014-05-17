/**
* Sensor.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
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
    	type: 'string',
    	required: true
    },
    recordFrequency: {
      type: 'string',
      required: true
    },
    measureFrequency: {
      type: 'string',
      required: true
    },
    box:{
    	model:'box',
      required: true
    }
  }
};

