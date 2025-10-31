const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

class FacebookAdapter {
  async post({ content, image, user }) {
    try {
      // Development mode - return mock success
      if (process.env.NODE_ENV === 'development') {
        console.log('📘 Facebook (DEV MODE): Would post:', content);
        return {
          success: true,
          id: 'fb_dev_' + Date.now(),
          platform: 'facebook',
          message: 'Posted successfully (Development Mode)'
        };
      }

      const { accessToken } = user;
      
      // Get user's pages (for posting to pages instead of personal profile)
      const pagesResponse = await axios.get(
        `https://graph.facebook.com/v18.0/me/accounts`,
        {
          params: {
            access_token: accessToken,
            fields: 'name,access_token,id'
          }
        }
      );

      if (!pagesResponse.data.data || pagesResponse.data.data.length === 0) {
        throw new Error('No Facebook pages found. Please ensure you have manage permissions for at least one page.');
      }

      // Use the first page for posting
      const page = pagesResponse.data.data[0];
      const pageAccessToken = page.access_token;
      const pageId = page.id;

      let postData = {
        message: content,
        access_token: pageAccessToken
      };

      let endpoint = `https://graph.facebook.com/v18.0/${pageId}/feed`;

      // If image is provided, upload it first
      if (image && image.path) {
        const formData = new FormData();
        formData.append('message', content);
        formData.append('access_token', pageAccessToken);
        formData.append('source', fs.createReadStream(image.path));

        endpoint = `https://graph.facebook.com/v18.0/${pageId}/photos`;
        
        const response = await axios.post(endpoint, formData, {
          headers: formData.getHeaders()
        });
        
        return {
          success: true,
          platform: 'facebook',
          postId: response.data.id,
          postUrl: `https://facebook.com/${response.data.id}`
        };
      } else {
        // Text-only post
        const response = await axios.post(endpoint, postData);
        
        return {
          success: true,
          platform: 'facebook',
          postId: response.data.id,
          postUrl: `https://facebook.com/${response.data.id}`
        };
      }
    } catch (error) {
      console.error('Facebook posting error:', error.response?.data || error.message);
      throw new Error(`Facebook posting failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

module.exports = new FacebookAdapter();
