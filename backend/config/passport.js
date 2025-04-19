const passport       = require('passport');
const { Strategy }   = require('passport-google-oauth20');
const User           = require('../models/User');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id).then(user => done(null, user)).catch(done)
);

passport.use(new Strategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ googleID: profile.id });
    if (!user) {
      user = await User.create({
        googleID: profile.id,
        email:    profile.emails[0].value,
        name:     profile.displayName,
        picture:  profile.photos[0].value
      });
    }
    done(null, user);
  }
));