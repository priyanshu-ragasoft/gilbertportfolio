import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Protect routes - Verify JWT token in Authorization Header (Bearer <token>)
export const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'gilbert_super_secure_jwt_secret_key_2026_@#!$%'
    )

    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      })
    }

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.',
      error: error.message,
    })
  }
}

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role}' is not authorized to access this resource`,
      })
    }
    next()
  }
}

// Admin / Superadmin only shorthand middleware
export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    return next()
  }
  return res.status(403).json({
    success: false,
    message: 'Access restricted to administrators only',
  })
}

