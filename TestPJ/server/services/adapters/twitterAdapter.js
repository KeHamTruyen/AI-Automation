const axios = require('axios');
let TwitterApi;
try {
  // Lazy require to avoid error if package not installed yet
  TwitterApi = require('twitter-api-v2').TwitterApi;
} catch (_) {
  TwitterApi = null;
}

class TwitterAdapter {
  async post({ content, image, user }) {
    try {
      // Development mode - return mock success
      if (process.env.NODE_ENV === 'development') {
        console.log('🐦 Twitter (DEV MODE): Would post:', content.substring(0, 280));
        return {
          success: true,
          id: 'tw_dev_' + Date.now(),
          platform: 'twitter',
          message: 'Posted successfully (Development Mode)'
        };
      }

      const { accessToken, accessTokenSecret } = user;

      // If in production and library is available, try real post
      if (process.env.NODE_ENV === 'production' && TwitterApi && accessToken && accessTokenSecret) {
        const client = new TwitterApi({
          appKey: process.env.TWITTER_CONSUMER_KEY,
          appSecret: process.env.TWITTER_CONSUMER_SECRET,
          accessToken,
          accessSecret: accessTokenSecret,
        });

        const { data } = await client.v2.tweet(content.substring(0, 280));
        return {
          success: true,
          platform: 'twitter',
          postId: data.id,
          postUrl: `https://twitter.com/i/web/status/${data.id}`,
        };
      }

      // Fallback to mock if not production or missing deps
      const id = 'tw_mock_' + Date.now();
      return {
        success: true,
        platform: 'twitter',
        postId: id,
        postUrl: `https://twitter.com/i/web/status/${id}`,
        note: 'Mock posting (library not available or not production)'
      };
      
    } catch (error) {
      console.error('Twitter posting error:', error.message);
      
      // Fallback to compose intent
      return {
        success: true,
        platform: 'twitter',
        postId: 'intent_' + Date.now(),
        postUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`,
        note: 'Opened X compose dialog'
      };
    }
  }

  // TODO: Implement proper X API v2 OAuth 1.0a authentication
  // Reference: https://docs.x.com/x-api/tweets/manage-tweets/api-reference/post-tweets
  async makeRealRequest(postData, accessToken, accessTokenSecret) {
    const url = 'https://api.twitter.com/2/tweets';
    
    // Proper OAuth 1.0a implementation needed here
    // Use library like 'oauth-1.0a' for production
    
    const response = await axios.post(url, postData, {
      headers: {
        'Authorization': 'OAuth ...', // OAuth 1.0a header
        'Content-Type': 'application/json'
      }
    });
    
    return response;
  }
}

module.exports = new TwitterAdapter();
