import SiteSettings from '../models/SiteSettings.js'
import User from '../models/User.js'

const defaultSettings = {
  footerLogo: '',
  footerLogoAlt: 'Gilbert Kevin Jimmy Kwizera Official Brand',
  footerTagline:
    'Dedicated to dignity-based care, ethical resource stewardship, and sustainable social systems across East Africa and the Middle East.',
  officeAddress: 'Le Pont, Port de la Mer, Jumeirah, Dubai',
  contactPhone: '+971 54 312 1222',
  contactEmail: 'kevin@piogoldcoin.com',
  quoteText: 'When you choose to help others up, you help people rise as well.',
  quoteAuthor: 'Core Leadership Principle',
  copyrightText: '© 2026 Gilbert Kevin Jimmy Kwizera. All rights reserved.',
}

// @desc    Get Site Settings & Footer Configuration
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne()

    if (!settings) {
      settings = await SiteSettings.create(defaultSettings)
    }

    res.status(200).json({
      success: true,
      data: settings,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch site settings',
      error: error.message,
    })
  }
}

// @desc    Update Site Settings & Footer Configuration
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    const {
      showFooterCornerImage,
      footerCornerImage,
      footerCornerImageAlt,
      footerWatermarkOpacity,
      footerLogo,
      footerLogoAlt,
      footerTagline,
      officeAddress,
      contactPhone,
      contactEmail,
      quoteText,
      quoteAuthor,
      copyrightText,
    } = req.body

    let settings = await SiteSettings.findOne()

    if (!settings) {
      settings = new SiteSettings(req.body)
    } else {
      if (showFooterCornerImage !== undefined) settings.showFooterCornerImage = Boolean(showFooterCornerImage)
      if (footerCornerImage !== undefined) settings.footerCornerImage = footerCornerImage
      if (footerCornerImageAlt !== undefined) settings.footerCornerImageAlt = footerCornerImageAlt
      if (footerWatermarkOpacity !== undefined) settings.footerWatermarkOpacity = Number(footerWatermarkOpacity)
      if (footerLogo !== undefined) settings.footerLogo = footerLogo
      if (footerLogoAlt !== undefined) settings.footerLogoAlt = footerLogoAlt
      if (footerTagline !== undefined) settings.footerTagline = footerTagline
      if (officeAddress !== undefined) settings.officeAddress = officeAddress
      if (contactPhone !== undefined) settings.contactPhone = contactPhone
      if (contactEmail !== undefined) settings.contactEmail = contactEmail
      if (quoteText !== undefined) settings.quoteText = quoteText
      if (quoteAuthor !== undefined) settings.quoteAuthor = quoteAuthor
      if (copyrightText !== undefined) settings.copyrightText = copyrightText
    }

    const updated = await settings.save()

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: updated,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
      error: error.message,
    })
  }
}

// @desc    Upload Footer Logo / Brand Image
// @route   POST /api/settings/upload-logo
// @access  Private/Admin
export const uploadFooterLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      })
    }

    const host = req.get('host')
    const protocol = req.protocol
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`

    res.status(200).json({
      success: true,
      message: 'Footer logo uploaded successfully',
      url: imageUrl,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload logo image',
      error: error.message,
    })
  }
}

// @desc    Reset / Change Admin Password
// @route   PUT /api/settings/change-password
// @access  Private/Admin
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      })
    }

    // Find admin user
    let user
    if (req.user && req.user.id) {
      user = await User.findById(req.user.id).select('+password')
    } else {
      user = await User.findOne().select('+password')
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Admin account not found',
      })
    }

    // If currentPassword provided, verify it
    if (currentPassword) {
      const isMatch = await user.matchPassword(currentPassword)
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password does not match',
        })
      }
    }

    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Admin password successfully updated!',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update password',
      error: error.message,
    })
  }
}
