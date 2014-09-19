'use strict';

var mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = mongoose.model('User');

// Serialize sessions
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ _id: id }).populate('school').exec(function (err, user) {
    done(err, user);
  });
});

// Use local strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    console.log(email, password);
    User.findOne({ email: email }).populate('school').exec(function (err, user) {
      if (err) {
        console.log("sdf");
        return done(err);
      }
      if (!user) {
        console.log("sdfsdfsdf");
        return done(null, false, {
          'errors': {
            'email': { message: 'The email or password that you entered are incorrect' }
          }
        });
      }
      if (!user.authenticate(password)) {
        console.log("sdf098");
        return done(null, false, {
          'errors': {
            'password': { message: 'The email or password that you entered are incorrect' }
          }
        });
      }
      console.log("sdf34958");
      return done(null, user);
    });
  }
));
