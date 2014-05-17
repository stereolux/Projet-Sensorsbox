/*
  Set passport logic and static folder location
*/

var sails = require('sails'),
  express    = require('sails/node_modules/express'),
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

var initAuthWithWebSockets = function() {
  var initialize = passport.initialize(),
    session = passport.session(),
    http = require('http'),
    methods = ['login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated'];
/*
*/

  sails.removeAllListeners('router:request');
  sails.on('router:request', function(req, res) {
    initialize(req, res, function () {
      session(req, res, function (err) {
        if (err) {
          return sails.config[500](500, req, res);
        }
        for (var i = 0; i < methods.length; i++) {
          req[methods[i]] = http.IncomingMessage.prototype[methods[i]].bind(req);
        }
        sails.router.route(req, res);
      });
    });
  });
  return {
    initialize : initialize,
    session : session
  }
};

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

      console.log('Enabling passport for websockets communication');
      var objs = initAuthWithWebSockets();

      console.log('Adding express midleware for passport');
      app.use(objs.initialize);
      app.use(objs.session);
    }
  }
};

