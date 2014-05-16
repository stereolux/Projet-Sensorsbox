/**
* Record.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    mean: {
      type: 'string'
    },
    max: {
      type: 'string'
    },
    min: {
      type: 'string'
    },
    timerange: {
      type: 'string'
    },
    sensor:{
        model: 'sensor'
    }
  }

};

