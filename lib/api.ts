// API base URL - sử dụng environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "API request failed")
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  // Social Accounts API
  async getSocialAccounts(filters?: { platform?: string; status?: string }) {
    const params = new URLSearchParams()
    if (filters?.platform) params.append("platform", filters.platform)
    if (filters?.status) params.append("status", filters.status)

    const query = params.toString() ? `?${params.toString()}` : ""
    return this.request(`/social-accounts${query}`)
  }

  async addSocialAccount(data: {
    platform: string
    name: string
    username: string
    accessToken: string
  }) {
    return this.request("/social-accounts", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateSocialAccount(id: string, data: any) {
    return this.request(`/social-accounts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteSocialAccount(id: string) {
    return this.request(`/social-accounts/${id}`, {
      method: "DELETE",
    })
  }

  // Content Generation API
  async generateContent(data: {
    prompt: string
    platform: string
    tone?: string
    length?: string
  }) {
    return this.request("/content/generate", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Analytics API
  async getAnalytics(timeRange = "7d") {
    return this.request(`/social-accounts/analytics?timeRange=${timeRange}`)
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL)

// React hooks for API calls
export const useApi = () => {
  return {
    getSocialAccounts: apiClient.getSocialAccounts.bind(apiClient),
    addSocialAccount: apiClient.addSocialAccount.bind(apiClient),
    updateSocialAccount: apiClient.updateSocialAccount.bind(apiClient),
    deleteSocialAccount: apiClient.deleteSocialAccount.bind(apiClient),
    generateContent: apiClient.generateContent.bind(apiClient),
    getAnalytics: apiClient.getAnalytics.bind(apiClient),
  }
}
