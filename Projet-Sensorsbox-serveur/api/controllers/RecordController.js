/**
 * RecordController
 *
 * @description :: Server-side logic for managing records
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	create : function(req, res) {
		Box.create(req.body).exec(function(err,box){
			if (err) { res.end(404, err); }
			else {
				res.json(box);
			}
		});
	},
	update : function(req, res) {
		Box.update(req.params.sensorid, req.body).exec(function(err,boxes){
			if (err) { res.end(404, err); }
			else {
				SocketService.message('box', 'updated', boxes[0]);
				res.json(boxes[0]);
			}
		});
	},
	destroy : function(req, res) {
		Box.destroy(req.params.sensorid).exec(function(err,boxes){
			if (err) { res.end(404, err); }
			else {
				SocketService.message('box', 'destroyed', boxes[0]);
				res.json(boxes[0]);
			}
		});
	}

};
