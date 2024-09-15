const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// Authentication using passport
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true, // Allows passing the request object as the first argument
    },
    function (req, email, password, done) {
      // Find a user and establish their identity
      User.findOne({ email: email }, async function (err, user) {
        if (err) {
          req.flash('error', err);
          return done(err);
        }

        if (!user) {
          req.flash('error', 'Invalid username or password');
          return done(null, false);
        }

        // Match the password using the user's method
        const isPasswordCorrect = await user.isValidatedPassword(password);

        if (!isPasswordCorrect) {
          req.flash('error', 'Invalid username or password');
          return done(null, false);
        }

        return done(null, user); // Authentication successful, pass the user to the next step
      });
    }
  )
);

// Serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log('Error in finding user ---> Passport');
      return done(err);
    }

    return done(null, user); // User deserialized successfully
  });
});

// Check if user authenticated (middleware)
passport.checkAuthentication = function (req, res, next) {
  // If the user is signed in, then pass on the request to the next function (controller's action)
  if (req.isAuthenticated()) {
    return next();
  }

  // If the user is not signed in, redirect them to the root path
  return res.redirect('/');
};

// Middleware to set the authenticated user in the response locals
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed-in user from the session cookie, and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
