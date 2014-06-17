/**
 * ConfigController
 *
 * @description :: Server-side logic for managing configs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	getConfig: function(req,res) {
		Box.find({id:req.params.boxid}).populate('owner').populate('sensor').exec(function(err,boxes) {
			if ((err) || (!boxes)) {
				return res.send(404, err);
			}
			else {
				if (boxes[0] && boxes[0].sensor) {
					SocketService.join(req.socket, 'box', boxes[0]);
					return res.send(boxes[0]);
				}
			}
		});
	}
};
