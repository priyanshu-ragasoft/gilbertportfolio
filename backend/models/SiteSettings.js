import mongoose from 'mongoose'

const siteSettingsSchema = new mongoose.Schema(
  {
    showFooterCornerImage: {
      type: Boolean,
      default: true,
    },
    footerCornerImage: {
      type: String,
      default: '',
    },
    footerCornerImageAlt: {
      type: String,
      default: 'Brand Emblem & Shaded Watermark',
    },
    footerWatermarkOpacity: {
      type: Number,
      default: 18, // 18% opacity
    },
    footerLogo: {
      type: String,
      default: '',
    },
    footerLogoAlt: {
      type: String,
      default: 'Gilbert Kevin Jimmy Kwizera Official Brand',
    },
    footerTagline: {
      type: String,
      default:
        'Dedicated to dignity-based care, ethical resource stewardship, and sustainable social systems across East Africa and the Middle East.',
    },
    officeAddress: {
      type: String,
      default: 'Le Pont, Port de la Mer, Jumeirah, Dubai',
    },
    contactPhone: {
      type: String,
      default: '+971 54 312 1222',
    },
    contactEmail: {
      type: String,
      default: 'kevin@piogoldcoin.com',
    },
    quoteText: {
      type: String,
      default: 'When you choose to help others up, you help people rise as well.',
    },
    quoteAuthor: {
      type: String,
      default: 'Core Leadership Principle',
    },
    copyrightText: {
      type: String,
      default: '© 2026 Gilbert Kevin Jimmy Kwizera. All rights reserved.',
    },
  },
  {
    timestamps: true,
  }
)

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema)

export default SiteSettings
