import User from '../models/User.js'

// @desc    Admin login & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate email & password presence
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      })
    }

    // Check for user
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    // Generate JWT Token
    const token = user.getSignedJwtToken()

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
      },
      message: 'Login successful. Welcome back!',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private (Protected by JWT)
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update Admin Profile
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      avatar: req.body.avatar,
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      user,
      message: 'Profile updated successfully',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update Password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password')

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      })
    }

    user.password = req.body.newPassword
    await user.save()

    const token = user.getSignedJwtToken()

    res.status(200).json({
      success: true,
      token,
      message: 'Password updated successfully',
    })
  } catch (error) {
    next(error)
  }
}
