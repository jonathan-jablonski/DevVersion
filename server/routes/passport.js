const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GOOGLE_CLIENT_ID =
  '746742004572-doda3p06e7aqdsuiqff4lguet9ug8aiu.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'AJa2qzeHWvd68gTav5l4udT3';

passport.serializeUser(function(user, done) {
 done(null, user);
});

passport.deserializeUser(function(user, done) {
 done(null, user);
});

passport.use(
 new GoogleStrategy(
  {
   clientID: GOOGLE_CLIENT_ID,
   clientSecret: GOOGLE_CLIENT_SECRET,
   callbackURL: "http://localhost:3000/auth/google/redirect"
  },
  function(accessToken, refreshToken, profile, done) {
    let userData = {
        email: profile.emails[0].value,
        name: profile.displayName,
        token: accessToken
    };
   done(null, userData);
  }
 )
);