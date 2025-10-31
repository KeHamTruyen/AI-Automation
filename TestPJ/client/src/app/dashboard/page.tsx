'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Platform {
  id: string
  name: string
  color: string
  connected: boolean
}

export default function Dashboard() {
  const [platforms, setPlatforms] = useState<Platform[]>([
    { id: 'facebook', name: 'Facebook', color: 'bg-blue-600', connected: false },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700', connected: false },
    { id: 'twitter', name: 'Twitter', color: 'bg-blue-400', connected: false },
  ])

  const [content, setContent] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [image, setImage] = useState<File | null>(null)
  const [isPosting, setIsPosting] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<any>(null)

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/profile')
      setUser(response.data)
      
      // Update platform connection status
      setPlatforms(prev => prev.map(platform => ({
        ...platform,
        connected: response.data?.provider === platform.id
      })))
    } catch (error) {
      console.log('Not authenticated')
    }
  }

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      setMessage('Please enter some content')
      return
    }
    
    // Check if user is connected to any platform
    const connectedPlatforms = platforms.filter(p => p.connected)
    if (connectedPlatforms.length === 0) {
      setMessage('Please connect to at least one platform first')
      return
    }
    
    if (selectedPlatforms.length === 0) {
      setMessage('Please select at least one platform')
      return
    }

    setIsPosting(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('content', content)
      formData.append('platforms', JSON.stringify(selectedPlatforms))
      if (image) {
        formData.append('image', image)
      }

      const response = await axios.post('/api/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setMessage('Post created successfully!')
      setContent('')
      setSelectedPlatforms([])
      setImage(null)
    } catch (error: any) {
      // Try to surface the real server error for easier debugging
      const serverMsg = error?.response?.data?.error || error?.response?.data?.message;
      setMessage(serverMsg ? `Error: ${serverMsg}` : 'Error creating post. Please try again.')
    } finally {
      setIsPosting(false)
    }
  }

  const connectPlatform = (platformId: string) => {
    window.location.href = `/api/auth/${platformId}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        {/* User Info */}
        {user && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">
              ✅ Connected as <strong>{user.name}</strong> via <strong>{user.provider}</strong>
            </p>
          </div>
        )}
        
        {/* Platform Connections */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Connected Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {platforms.map(platform => (
              <div key={platform.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded ${platform.color}`}></div>
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  <button
                    onClick={() => connectPlatform(platform.id)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      platform.connected
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {platform.connected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Post Creation Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="What's on your mind?"
              />
              <p className="text-sm text-gray-500 mt-1">
                {content.length}/280 characters
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {image && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected: {image.name}
                </p>
              )}
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Platforms
              </label>
              <div className="space-y-2">
                {platforms.map(platform => (
                  <label key={platform.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(platform.id)}
                      onChange={() => handlePlatformToggle(platform.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{platform.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPosting}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                isPosting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } transition duration-150`}
            >
              {isPosting ? 'Posting...' : 'Post to Selected Platforms'}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-md ${
              message.includes('Error') 
                ? 'bg-red-100 text-red-700' 
                : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
