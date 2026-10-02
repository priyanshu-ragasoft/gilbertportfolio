import mongoose from 'mongoose'

const chapterSchema = new mongoose.Schema({
  id: { type: String, required: true },
  index: { type: String, default: '01' },
  year: { type: String, default: '1971' },
  shortLocation: { type: String, default: 'Uganda' },
  location: { type: String, default: 'Kampala, Uganda' },
  title: { type: String, default: 'Born in Uganda' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
  href: { type: String, default: '/about' },
  cta: { type: String, default: 'Read the profile' },
  countryKey: { type: String, default: '' },
  lon: { type: Number, default: 0 },
  lat: { type: Number, default: 0 },
  pinNote: { type: String, default: '' },
})

const journeySchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: 'Journey',
    },
    title: {
      type: String,
      default: 'A Journey',
    },
    subtitle: {
      type: String,
      default: 'Across Borders',
    },
    introText: {
      type: String,
      default:
        'Kampala, the years of study, a life in the Emirates, and the work that kept returning to Uganda.',
    },
    scrollHintText: {
      type: String,
      default: 'Scroll to travel',
    },
    chapters: [chapterSchema],
  },
  {
    timestamps: true,
  }
)

const Journey = mongoose.model('Journey', journeySchema)

export default Journey
