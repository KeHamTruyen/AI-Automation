const axios = require('axios');

class LinkedInAdapter {
  async post({ content, image, user }) {
    try {
      // Development mode - return mock success
      if (process.env.NODE_ENV === 'development') {
        console.log('💼 LinkedIn (DEV MODE): Would post:', content);
        return {
          success: true,
          id: 'li_dev_' + Date.now(),
          platform: 'linkedin',
          message: 'Posted successfully (Development Mode)'
        };
      }

      const { accessToken } = user;

      // Get user's LinkedIn profile ID
      const profileResponse = await axios.get(
        'https://api.linkedin.com/v2/people/~',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const authorUrn = `urn:li:person:${profileResponse.data.id}`;

      let postData = {
        author: authorUrn,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      // If image is provided, we need to upload it first
      if (image && image.path) {
        // LinkedIn image upload is more complex and requires multiple API calls
        // For MVP, we'll post text-only and add image support later
        console.warn('LinkedIn image upload not implemented in MVP. Posting text only.');
      }

      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        postData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        platform: 'linkedin',
        postId: response.data.id,
        postUrl: `https://linkedin.com/feed/update/${response.data.id}`
      };
    } catch (error) {
      console.error('LinkedIn posting error:', error.response?.data || error.message);
      throw new Error(`LinkedIn posting failed: ${error.response?.data?.message || error.message}`);
    }
  }
}

module.exports = new LinkedInAdapter();
