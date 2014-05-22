/**
* Record.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
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
    sensor:{
        model: 'sensor'
    }
  }

};

