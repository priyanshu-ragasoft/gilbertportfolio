import mongoose from 'mongoose'

const bannerSchema = new mongoose.Schema(
  {
    kicker: {
      type: String,
      default: 'HUMANITARIAN • CONSULTANT • SOCIAL IMPACT',
      trim: true,
    },
    heading: {
      type: String,
      default: 'Turning Purpose Into Meaningful Impact.',
      trim: true,
    },
    lines: {
      type: [String],
      default: ['Turning Purpose', 'Into Meaningful', 'Impact.'],
    },
    description: {
      type: String,
      default:
        'Gilbert Kevin Jimmy Kwizera builds practical support for people at their most vulnerable — in cancer care, recovery, education, and the quiet work of protecting dignity.',
      trim: true,
    },
    primaryButtonText: {
      type: String,
      default: 'Explore My Journey',
      trim: true,
    },
    primaryButtonLink: {
      type: String,
      default: '/#journey',
      trim: true,
    },
    secondaryButtonText: {
      type: String,
      default: "Let's Connect",
      trim: true,
    },
    secondaryButtonLink: {
      type: String,
      default: '/contact',
      trim: true,
    },
    image: {
      type: String,
      default: '/src/assets/images/gilbert-kwizera-executive.jpg',
      trim: true,
    },
    images: {
      type: [String],
      default: [
        '/src/assets/images/gilbert-kwizera-executive.jpg',
        '/src/assets/images/gilbert-kwizera-lounge-armchair.jpg',
        '/src/assets/images/gilbert-kwizera-office-standing.jpg',
      ],
    },
    autoSlideInterval: {
      type: Number,
      default: 5000,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

const Banner = mongoose.model('Banner', bannerSchema)
export default Banner
