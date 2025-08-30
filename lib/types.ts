// Type definitions cho toàn bộ ứng dụng

export interface SocialAccount {
  id: string
  platform: "facebook" | "instagram" | "twitter" | "linkedin" | "youtube"
  name: string
  username: string
  followers: number
  isActive: boolean
  status: "connected" | "error" | "pending"
  lastSync: string
  engagement: number
  posts: number
  avatar: string
  permissions?: {
    autoPost: boolean
    autoReply: boolean
    analytics: boolean
  }
  settings?: {
    postFrequency: "hourly" | "daily" | "weekly" | "monthly"
    description: string
  }
}

export interface ScheduledPost {
  id: string
  content: string
  platforms: string[]
  scheduledTime: string
  status: "pending" | "published" | "failed"
  createdAt: string
  mediaUrls?: string[]
  hashtags?: string[]
}

export interface GeneratedContent {
  content: string
  hashtags: string[]
  suggestedImages: string[]
  platform: string
  tone: string
  length: string
  generatedAt: string
}

export interface Analytics {
  overview: {
    totalAccounts: number
    activeAccounts: number
    totalFollowers: number
    totalPosts: number
    avgEngagement: number
    growthRate: number
  }
  byPlatform: Array<{
    platform: string
    accounts: number
    followers: number
    posts: number
    engagement: number
    growth: number
  }>
  timeline: Array<{
    date: string
    followers: number
    engagement: number
    posts: number
  }>
  topPosts: Array<{
    id: string
    platform: string
    content: string
    likes: number
    comments: number
    shares: number
    engagement: number
    publishedAt: string
  }>
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  total?: number
  limit?: number
  offset?: number
}

export interface ContentGenerationRequest {
  topic: string
  platform: string
  tone?: "friendly" | "professional" | "casual" | "formal"
  length?: "short" | "medium" | "long"
  includeHashtags?: boolean
  targetAudience?: string
}

export interface PostScheduleRequest {
  content: string
  platforms: string[]
  scheduledTime: string
  mediaUrls?: string[]
  hashtags?: string[]
}
