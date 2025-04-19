// config/passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err, null));
});

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // e.g. '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find existing user
        let user = await User.findOne({ googleID: profile.id });

        if (!user) {
          // Create new user
          user = new User({
            googleID:    profile.id,
            email:       profile.emails[0].value,
            name:        profile.displayName,
            picture:     profile.photos[0].value,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
        } else {
          // Update tokens in case they've changed
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
        }

        await user.save();
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
