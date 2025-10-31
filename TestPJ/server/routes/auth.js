const express = require('express');
const passport = require('passport');
const router = express.Router();

// Import passport strategies
require('../config/passport');

// Facebook Auth
router.get('/facebook', passport.authenticate('facebook', { 
  scope: ['public_profile'] 
}));

router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL + '/dashboard');
  }
);

// LinkedIn Auth
router.get('/linkedin', passport.authenticate('linkedin', { 
  scope: ['r_liteprofile', 'w_member_social'] 
}));

router.get('/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect(process.env.CLIENT_URL + '/dashboard');
  }
);

// Twitter Auth
router.get('/twitter', (req, res, next) => {
  console.log('🐦 Starting Twitter OAuth...');
  passport.authenticate('twitter')(req, res, next);
});

router.get('/twitter/callback',
  (req, res, next) => {
    console.log('🐦 Twitter callback received...');
    passport.authenticate('twitter', { failureRedirect: '/login' })(req, res, next);
  },
  (req, res) => {
    console.log('🐦 Twitter OAuth completed successfully');
    res.redirect(process.env.CLIENT_URL + '/dashboard');
  }
);

// Get user profile
router.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
