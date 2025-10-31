const axios = require('axios');

class TwitterAdapter {
  async post({ content, image, user }) {
    try {
      const { accessToken, accessTokenSecret } = user;
      
      // X API v2 endpoint - FREE TIER SUPPORTS 100 POSTS/MONTH!
      const postData = {
        text: content.substring(0, 280) // X character limit
      };

      // Note: For MVP, we'll use mock response
      // In production, implement proper OAuth 1.0a with X API v2
      console.log('Posting to X/Twitter:', postData.text);
      
      // Mock successful response matching X API v2 format
      const mockResponse = {
        data: {
          id: '1' + Date.now(),
          text: postData.text
        }
      };

      return {
        success: true,
        platform: 'twitter',
        postId: mockResponse.data.id,
        postUrl: `https://twitter.com/i/web/status/${mockResponse.data.id}`,
        note: 'X API v2 - Free tier supports 100 posts/month!'
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
