/**
 * BoxController
 *
 * @description :: Server-side logic for managing boxes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	update : function(req, res) {
		Box.update(req.params.boxid, req.body).exec(function(err,boxes){
			if (err) { res.end(404, err); }
			else {
				SocketService.message('box', 'updated', boxes[0]);
				res.json(boxes[0]);
			}
		});
	},
	destroy : function(req, res) {
		Box.destroy(req.params.boxid).exec(function(err,boxes){
			if (err) { res.end(404, err); }
			else {
				SocketService.message('box', 'destroyed', boxes[0]);
				res.json(boxes[0]);
			}
		});
	}

};
