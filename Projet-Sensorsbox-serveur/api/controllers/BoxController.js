/**
 * BoxController
 *
 * @description :: Server-side logic for managing boxes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	create : function(req, res) {
		Box.create(req.body).exec(function(err,box){
			if (err) { res.end(404, err); }
			else {
				var msg = 'New box created:\n';
				msg += JSON.stringify(box);
				EmailService.sendMail(msg, 'New box created', 'vkammerer@gmail.com, xavier.seignard@gmail.com', function(){
					console.log('email sent');
				});
				res.json(box);
			}
		});
	},
	update : function(req, res) {
		Box.update(req.params.boxid, req.body).populate('sensor').exec(function(err){
			if (err) { res.end(404, err); }
			Box.find(req.params.boxid).populate('sensor').exec(function(err,boxes){
				if (err) { res.end(404, err); }
				else {
					SocketService.message('box', 'updated', boxes[0]);
					res.json(boxes[0]);
				}
			});
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
