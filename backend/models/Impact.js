import mongoose from 'mongoose'

const figureSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})

const pointSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  text: { type: String, default: '' },
})

const impactAreaSchema = new mongoose.Schema({
  slug: { type: String, default: 'cancer-charity-foundation' },
  number: { type: String, default: '01' },
  title: { type: String, default: 'Cancer care' },
  organization: { type: String, default: 'Cancer Charity Foundation' },
  image: { type: String, default: '/src/assets/images/ccf-cancer-care-compassion.jpg' },
  imageAlt: { type: String, default: 'Cancer care initiative' },
  summary: { type: String, default: 'A support system so people facing cancer are not left without dignity.' },
  points: [pointSchema],
})

const impactSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: 'Impact',
    },
    title: {
      type: String,
      default: 'Turning Awareness Into Action',
    },
    leadText: {
      type: String,
      default:
        'Most people feel concern when they see suffering. Fewer turn that concern into something that still works later. The published account of this life is about that move: from sympathy to structures that help in the background.',
    },
    sideNote: {
      type: String,
      default:
        'Where sickness, poverty, and displacement meet, small failures become overwhelming. The response described here is patience and organisation — showing up, spending resources carefully, and refusing choices that cost a person their dignity.',
    },
    figures: {
      type: [figureSchema],
      default: [
        { value: '500+', label: 'Patients helped' },
        { value: '50+', label: 'Verified staff' },
        { value: '25+', label: 'Rehab centres' },
        { value: '$182,000+', label: 'Donations received' },
      ],
    },
    caption: {
      type: String,
      default: "Figures as published alongside his foundations' work.",
    },
    storyImage: {
      type: String,
      default: '/src/assets/images/ccf-uci.jpg',
    },
    storyImageAlt: {
      type: String,
      default: 'Uganda Cancer Institute, a centre of specialised cancer treatment in Kampala',
    },
    storyHeading: {
      type: String,
      default: 'Consistency, not the dramatic moment, is what the work asks for.',
    },
    storyDescription: {
      type: String,
      default:
        'In the writing published with his name, inspiration is not a single gesture. It is the decision to build support that operates when no one is watching, for people at their most vulnerable.',
    },
    areas: {
      type: [impactAreaSchema],
      default: [
        {
          slug: 'cancer-charity-foundation',
          number: '01',
          title: 'Cancer care',
          organization: 'Cancer Charity Foundation',
          image: '/src/assets/images/ccf-cancer-care-compassion.jpg',
          imageAlt: 'Gilbert Kevin Jimmy Kwizera Providing Compassionate Cancer Care Support in Uganda',
          summary:
            'A support system so people facing cancer are not left without dignity because of poverty or circumstance. The work is practical and ethical, not built for publicity.',
          points: [
            { title: 'Daily survival', text: 'Meals, clean drinking water, and hygiene support.' },
            { title: 'Guidance', text: 'Volunteers and staff help with appointments.' },
          ],
        },
        {
          slug: 'haven-welfare',
          number: '02',
          title: 'Rehabilitation and welfare',
          organization: 'Haven Welfare',
          image: '/src/assets/images/havenwelfare.jpg',
          imageAlt: 'A caregiver speaking with a man during a moment of support',
          summary:
            'A social welfare programme centred on addiction management, intervention, treatment, recovery, and reintegration. Recovery is given time, dignity, and room to happen without shame.',
          points: [
            { title: 'Register and verify', text: 'Safe and structured onboarding process.' },
            { title: 'Connect and consult', text: 'Matching with clinics and rehabilitation specialists.' },
          ],
        },
        {
          slug: 'isbet-brainery',
          number: '03',
          title: 'Education',
          organization: 'ISBET Brainery Academy',
          image: '/src/assets/images/Gilbert-Kwizera-Charity-Support-for-Uganda-Students-Drive.jpg',
          imageAlt: 'Teachers and pupils with boxes of scholastic materials in a classroom',
          summary:
            'An all-in-one platform for learning technology, mastering practical skills, and growing a career. The public description is simple: empowering minds, shaping futures.',
          points: [
            { title: 'Practical training', text: 'Hands-on practical skills and coursework.' },
            { title: 'Career growth', text: 'Programs from technology to entrepreneurship.' },
          ],
        },
        {
          slug: 'blockchain-for-humanity',
          number: '04',
          title: 'Blockchain for Humanity',
          organization: 'A guide for digital livelihoods',
          image: '/src/assets/images/pio-ecosystem-technology.jpg',
          imageAlt: 'PIO Ecosystem and Philanthropist Gilbert Kevin Jimmy Kwizera Driving Impact',
          summary:
            'A book and pathway about using a phone, practical skills, and ethical digital work to build a livelihood. It is framed as a compass for African readers moving from dependency toward self-reliant work.',
          points: [
            { title: 'Accessibility', text: 'Mobile-first practical earnings.' },
            { title: 'Skill before spectacle', text: 'Real economy focus rather than speculation.' },
          ],
        },
        {
          slug: 'employment-awareness-initiative',
          number: '05',
          title: 'Employment Awareness',
          organization: 'Humanitarian Initiative',
          image: '/src/assets/images/kwizera-humanitarian-employment-initiative.jpg',
          imageAlt: 'Gilbert Kevin Jimmy Kwizera Humanitarian Initiative Supporting Africa Through Employment Awareness',
          summary:
            'A pan-African initiative providing verified employment information, free job updates, and community empowerment without charging recruitment fees.',
          points: [
            { title: 'Free Job Updates', text: 'Regular, vetted employment information.' },
            { title: 'Zero Fees Guarantee', text: 'Strict anti-exploitation policy.' },
          ],
        },
      ],
    },
  },
  {
    timestamps: true,
  }
)

const Impact = mongoose.model('Impact', impactSchema)

export default Impact
