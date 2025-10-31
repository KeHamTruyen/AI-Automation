const Queue = require('bull');
const axios = require('axios');
const fs = require('fs').promises;

// Create posting queue with error handling
let postQueue = null; // Force disable Redis for development
console.log('⚠️  Redis disabled - posts will be processed synchronously');

// Platform adapters
const platformAdapters = {
  facebook: require('./adapters/facebookAdapter'),
  linkedin: require('./adapters/linkedinAdapter'),
  twitter: require('./adapters/twitterAdapter')
};

class PostService {
  async createMultiPlatformPost({ content, image, platforms, user }) {
    const postId = this.generatePostId();
    const results = {};

  for (const platform of platforms) {
      if (platformAdapters[platform]) {
        try {
          // If Redis is available, use queue; otherwise process directly
          if (postQueue) {
            const job = await postQueue.add('post-to-platform', {
              postId,
              platform,
              content,
              image: image ? {
                path: image.path,
                mimetype: image.mimetype,
                originalname: image.originalname
              } : null,
              user
            });

            results[platform] = {
              status: 'queued',
              jobId: job.id
            };
          } else {
            // Process directly without queue
            const result = await this.postToPlatform({
              platform,
              content,
              image,
              user
            });
            
            results[platform] = result;
          }
        } catch (error) {
          results[platform] = {
            status: 'error',
            error: error?.response?.data || error?.message || 'Unknown error'
          };
        }
      } else {
        results[platform] = {
          status: 'error',
          error: 'Platform not supported'
        };
      }
    }

    return {
      postId,
      results
    };
  }

  async postToPlatform({ platform, content, image, user }) {
    try {
      const adapter = platformAdapters[platform];
      const result = await adapter.post({ content, image, user });
      
      return {
        status: 'success',
        platformPostId: result.id || 'mock_post_id',
        message: 'Posted successfully'
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  async getPostStatus(postId) {
    // This would typically query a database
    // For MVP, return mock status
    return {
      postId,
      status: 'completed',
      platforms: {
        facebook: { status: 'success', postId: 'fb_123' },
        linkedin: { status: 'success', postId: 'li_456' },
        twitter: { status: 'success', postId: 'tw_789' }
      }
    };
  }

  async getUserPosts(userId) {
    // This would typically query a database
    // For MVP, return mock data
    return [
      {
        id: '1',
        content: 'Hello world!',
        createdAt: new Date(),
        platforms: ['facebook', 'linkedin'],
        status: 'completed'
      }
    ];
  }

  generatePostId() {
    return 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

// Process jobs in the queue (only if Redis is available)
if (postQueue) {
  postQueue.process('post-to-platform', async (job) => {
    const { postId, platform, content, image, user } = job.data;
    
    try {
      const adapter = platformAdapters[platform];
      const result = await adapter.post({ content, image, user });
      
      // Clean up uploaded file
      if (image && image.path) {
        try {
          await fs.unlink(image.path);
        } catch (err) {
          console.warn('Could not delete uploaded file:', err);
        }
      }
      
      return result;
    } catch (error) {
      console.error(`Error posting to ${platform}:`, error);
      throw error;
    }
  });
}

module.exports = new PostService();
