/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any user authenticated via passport
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next){
  if (req.isAuthenticated && req.isAuthenticated()){
    return next();
  }
  else {
    return res.send(403, { message: 'Not Authorized 4' });
  }
} 