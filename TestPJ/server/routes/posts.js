const express = require('express');
const multer = require('multer');
const router = express.Router();
const postService = require('../services/postService');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Authentication required' });
};

// Create a new post
router.post('/create', requireAuth, upload.single('image'), async (req, res) => {
  try {
    console.log('📝 Creating post...', req.body);
    const { content, platforms } = req.body;
    const image = req.file;
    const user = req.user;

    console.log('User:', user?.name, 'Provider:', user?.provider);

    if (!content || !platforms) {
      console.log('❌ Missing content or platforms');
      return res.status(400).json({ 
        message: 'Content and platforms are required' 
      });
    }

    const selectedPlatforms = JSON.parse(platforms);
    console.log('Selected platforms:', selectedPlatforms);
    
    const result = await postService.createMultiPlatformPost({
      content,
      image,
      platforms: selectedPlatforms,
      user
    });

    console.log('✅ Post result:', result);
    res.json(result);
  } catch (error) {
    console.error('💥 Error creating post:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      message: 'Error creating post', 
      error: error.message 
    });
  }
});

// Get post status
router.get('/status/:postId', requireAuth, async (req, res) => {
  try {
    const { postId } = req.params;
    const status = await postService.getPostStatus(postId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error getting post status', 
      error: error.message 
    });
  }
});

// Get user's posts history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await postService.getUserPosts(userId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error getting posts history', 
      error: error.message 
    });
  }
});

module.exports = router;
