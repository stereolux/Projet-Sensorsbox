/**
 * BoxController
 *
 * @description :: Server-side logic for managing boxes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  findAll: function(req,res){
    Box.find({owner:req.user[0].id}, function(err, box){
      if ((err) || (!box)) {
        return res.send(404, err);
      }
      else {
      	return res.send(box);
      }
	  });
  }
};