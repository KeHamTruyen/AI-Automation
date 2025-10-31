const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

// User serialization
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Facebook Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/auth/facebook/callback",
    profileFields: ['id', 'displayName']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: null, // No email permission
        provider: 'facebook',
        accessToken,
        refreshToken
      };
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// LinkedIn Strategy
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: "/api/auth/linkedin/callback",
    scope: ['r_liteprofile', 'w_member_social']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0]?.value,
        provider: 'linkedin',
        accessToken,
        refreshToken
      };
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
}

// Twitter Strategy
if (process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_CONSUMER_SECRET) {
  console.log('🐦 Configuring Twitter Strategy...');
  console.log('Twitter Consumer Key:', process.env.TWITTER_CONSUMER_KEY?.substring(0, 10) + '...');
  
  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "/api/auth/twitter/callback"
  }, async (token, tokenSecret, profile, done) => {
    try {
      console.log('🐦 Twitter OAuth success:', profile.username);
      const user = {
        id: profile.id,
        name: profile.displayName,
        username: profile.username,
        provider: 'twitter',
        accessToken: token,
        accessTokenSecret: tokenSecret
      };
      return done(null, user);
    } catch (error) {
      console.error('🐦 Twitter OAuth error:', error);
      return done(error, null);
    }
  }));
} else {
  console.log('❌ Twitter credentials not found in environment');
}
