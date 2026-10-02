import mongoose from 'mongoose'

const insightsSectionSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: 'Insights',
    },
    title: {
      type: String,
      default: 'Notes from the work',
    },
    leadText: {
      type: String,
      default:
        'Essays and short films published on his site, kept in his own record rather than retold as something else.',
    },
    buttonText: {
      type: String,
      default: 'View All Blog & Insights',
    },
    buttonLink: {
      type: String,
      default: '/blog',
    },
    featuredSlug: {
      type: String,
      default: 'pio-system-and-gilbert-kevin-jimmy-kwizeras-innovation-role',
    },
    bottomNote: {
      type: String,
      default: 'Looking for the project records? They live on the projects page.',
    },
  },
  {
    timestamps: true,
  }
)

const InsightsSection = mongoose.model('InsightsSection', insightsSectionSchema)

export default InsightsSection
