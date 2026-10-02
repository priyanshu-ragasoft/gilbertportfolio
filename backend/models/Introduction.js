import mongoose from 'mongoose'

const factSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
})

const pillarSchema = new mongoose.Schema({
  number: { type: String, required: true },
  title: { type: String, required: true },
  organization: { type: String, required: true },
  text: { type: String, required: true },
  to: { type: String, default: '/about' },
})

const introductionSchema = new mongoose.Schema(
  {
    indexNumber: { type: String, default: '01' },
    kicker: { type: String, default: 'Introduction' },
    titleLine1: { type: String, default: 'A Life Dedicated to' },
    titleLine2: { type: String, default: 'Service, Dignity, and Hope.' },
    role: {
      type: String,
      default: 'Humanitarian leader, international consultant, and volunteer',
    },
    paragraphs: {
      type: [String],
      default: [
        'Gilbert Kevin Jimmy Kwizera is a humanitarian leader, international consultant, and volunteer. He founded the Cancer Charity Foundation and Haven Welfare, and he has committed the work to dignity-based care, ethical leadership, and sustainable social impact.',
        'The work is quiet on purpose. Help is offered without turning people into public stories. What matters is consistency: showing up, using resources responsibly, and making decisions that protect human dignity.',
      ],
    },
    profileLinkText: { type: String, default: 'Read the full profile' },
    profileLinkUrl: { type: String, default: '/about' },

    // Interactive Shutter Plate Aside
    shutterBadge: { type: String, default: 'Hover to reveal' },
    shutterTag: { type: String, default: 'A working standard' },
    shutterHeading: {
      type: String,
      default: 'Charity is treated as a duty, not a performance.',
    },
    shutterDescription: {
      type: String,
      default:
        'Show up, use resources carefully, and leave a person’s dignity intact. The work is meant to continue when no one is watching.',
    },
    shutterImage: {
      type: String,
      default: '/src/assets/images/gilbert-kwizera-office-standing.jpg',
    },
    shutterOriginLabel: { type: String, default: 'Origin' },
    shutterOriginValue: { type: String, default: 'Kampala, Uganda' },
    shutterNowLabel: { type: String, default: 'Now' },
    shutterNowValue: { type: String, default: 'Jumeirah, Dubai' },

    // Facts List
    facts: {
      type: [factSchema],
      default: [
        { label: 'Born', value: 'Kampala, 1971' },
        { label: 'Based', value: 'Dubai, UAE' },
        { label: 'Founded', value: 'CCF & Haven Welfare' },
        { label: 'Standard', value: 'Dignity-based care' },
      ],
    },

    // 3 Pillars List
    pillars: {
      type: [pillarSchema],
      default: [
        {
          number: '01',
          title: 'Cancer care',
          organization: 'Cancer Charity Foundation',
          text: 'Practical support so treatment is not abandoned because of poverty, distance, or isolation.',
          to: '/impact/cancer-charity-foundation',
        },
        {
          number: '02',
          title: 'Recovery',
          organization: 'Haven Welfare',
          text: 'Rehabilitation given time and privacy — a return to community without stigma.',
          to: '/impact/haven-welfare',
        },
        {
          number: '03',
          title: 'Education',
          organization: 'Classrooms and skills',
          text: 'Books in a classroom, and training that prepares people to serve rather than to display.',
          to: '/impact/isbet-brainery',
        },
      ],
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

const Introduction = mongoose.model('Introduction', introductionSchema)
export default Introduction
