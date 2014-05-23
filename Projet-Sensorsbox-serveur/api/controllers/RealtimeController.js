/**
 * RealtimeController
 *
 * @description :: Server-side logic for managing realtimes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	measure: function(req, res) {
		Measure.watch(req.socket);
	}
};
