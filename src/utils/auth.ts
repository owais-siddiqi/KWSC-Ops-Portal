// Auth utility functions

const TOKEN_KEY = 'reviewerToken'
const USER_KEY = 'reviewerUser'

export interface AuthUser {
  id: string
  fullName: string
  email: string
  role: string
  status: string
}

// Token management
export const authUtils = {
  // Save token and user data
  setAuth: (token: string, user: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  // Get token
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
  },

  // Get user data
  getUser: (): AuthUser | null => {
    const userStr = localStorage.getItem(USER_KEY)
    if (!userStr) return null
    try {
      return JSON.parse(userStr) as AuthUser
    } catch {
      return null
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authUtils.getToken()
  },

  // Clear auth data (logout)
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}

