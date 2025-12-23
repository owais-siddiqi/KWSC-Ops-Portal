import { API_BASE_URL, API_ENDPOINTS } from '../config/api'

// Types
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  data: {
    token: string
    role: string
    employee: {
      id: string
      fullName: string
      email: string
      role: string
      status: string
    }
  }
}

export interface ApiError {
  success: false
  error: string
  message: string
}

// API Client
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    try {
      console.log('API Request:', { url, method: config.method, body: config.body })
      
      const response = await fetch(url, config)
      
      console.log('API Response:', { 
        status: response.status, 
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      // Try to parse JSON response
      let data: any
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
        console.log('API Response Data:', data)
      } else {
        const text = await response.text()
        console.error('Non-JSON response:', text)
        throw new Error(text || `HTTP ${response.status}: ${response.statusText}`)
      }

      if (!response.ok) {
        // Handle error response
        const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`
        console.error('API Error:', errorMessage)
        throw new Error(errorMessage)
      }

      return data as T
    } catch (error) {
      console.error('API Request Failed:', error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error occurred')
    }
  }

  // Login API
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('Login request:', { 
      url: `${this.baseURL}${API_ENDPOINTS.LOGIN}`,
      credentials: { ...credentials, password: '***' } 
    })
    
    return this.request<LoginResponse>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
      credentials: 'include', // Include cookies if needed
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL)

