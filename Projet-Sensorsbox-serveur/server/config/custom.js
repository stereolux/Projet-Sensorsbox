/*
  Set passport logic and static folder location
*/

var express    = require('sails/node_modules/express'),
  passport    = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function(err, user) {
      if (err) { return done(null, err); }
      if (!user || user.length < 1) { return done(null, false, { message: 'Incorrect User'}); }
      bcrypt.compare(password, user.password, function(err, res) {
        if (!res) return done(null, false, { message: 'Invalid Password'});
        return done(null, user);
      });
    });
  })
);

module.exports = {
  express: {
    customMiddleware: function(app){
      console.log('Changing default static assets folder');

      if (process.env.NODE_ENV === 'development') {
        app.use(express.static(process.cwd() + '/../client/.tmp'));
        app.use(express.static(process.cwd() + '/../client/app'));        
      }
      else if (process.env.NODE_ENV === 'production') {
        app.use(express.static(process.cwd() + '/dist'));
      }

      console.log('Adding express midleware for passport');
      app.use(passport.initialize());
      app.use(passport.session());
    }
  }
};

