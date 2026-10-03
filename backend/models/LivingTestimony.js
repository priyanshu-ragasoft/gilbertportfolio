import mongoose from 'mongoose'

const milestoneSchema = new mongoose.Schema({
  step: { type: String, default: '01' },
  year: { type: String, default: '' },
  tag: { type: String, default: '' },
  shortTitle: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  highlight: { type: String, default: '' },
  enabled: { type: Boolean, default: true },
})

const survivorSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  badge: { type: String, default: 'Cancer Survivor' },
  eyebrow: { type: String, default: '' },
  age: { type: String, default: '' },
  year: { type: String, default: '' },
  hospitals: { type: String, default: '' },
  image: { type: String, default: '' },
  accentColor: { type: String, default: 'rose' },
  tagline: { type: String, default: '' },
  quote: { type: String, default: '' },
  detectionStatLabel: { type: String, default: 'Self-Exam' },
  detectionStatSub: { type: String, default: 'Prompt media guidance in 2009' },
  chemoStatLabel: { type: String, default: '6 Cycles' },
  chemoStatSub: { type: String, default: 'Medication funded by Mr. Jimmy' },
  introStory: { type: String, default: '' },
  highlightQuote: { type: String, default: '' },
  milestonesHeading: { type: String, default: 'The Path to Recovery' },
  milestonesSub: { type: String, default: 'Explore the vital chapters of courageous recovery' },
  showMilestones: { type: Boolean, default: true },
  milestones: [milestoneSchema],
})

const livingTestimonySchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: 'Living Testimonies of Hope · Cancer Charity Foundation',
    },
    title: {
      type: String,
      default: 'Stories of Strength & Survival',
    },
    subtitle: {
      type: String,
      default:
        'Real people whose lives were saved through early detection, clinical treatment, and compassionate support from Mr. Jimmy & CCF.',
    },
    survivors: [survivorSchema],
  },
  {
    timestamps: true,
  }
)

const LivingTestimony = mongoose.model('LivingTestimony', livingTestimonySchema)

export default LivingTestimony
