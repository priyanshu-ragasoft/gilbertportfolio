import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, getToken, setToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verify stored token on initial load
  useEffect(() => {
    const verifyUser = async () => {
      const token = getToken()
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await authAPI.getMe()
        if (response.success && response.user) {
          setUser(response.user)
        } else {
          setToken(null)
          setUser(null)
        }
      } catch (err) {
        console.warn('Session verification failed or expired:', err.message)
        setToken(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    verifyUser()
  }, [])

  // Login handler
  const login = async (email, password) => {
    setError(null)
    setLoading(true)
    try {
      const response = await authAPI.login({ email, password })
      if (response.success && response.token) {
        setToken(response.token)
        setUser(response.user)
        return { success: true }
      }
      throw new Error(response.message || 'Login failed')
    } catch (err) {
      setError(err.message || 'Invalid credentials')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Logout handler
  const logout = () => {
    setToken(null)
    setUser(null)
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
