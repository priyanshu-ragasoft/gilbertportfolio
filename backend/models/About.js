import mongoose from 'mongoose'

const roleItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
})

const aboutSchema = new mongoose.Schema(
  {
    kicker: {
      type: String,
      default: 'About',
    },
    headline: {
      type: String,
      default: 'Who is Gilbert Kevin Jimmy Kwizera?',
    },
    bodyText: {
      type: String,
      default:
        'A humanitarian leader, international consultant, and volunteer. Born in Kampala on 30 November 1971, trained in information systems and finance, and now based in the United Arab Emirates. The public measure of the work is simple: whether it protects dignity and can be sustained.',
    },
    portraitImage: {
      type: String,
      default: '/src/assets/images/gilbert-kwizera-lounge-armchair.jpg',
    },
    badgeTopText: {
      type: String,
      default: 'EST. 1971',
    },
    badgeSubText: {
      type: String,
      default: 'Kampala · Dubai',
    },
    profileLinkText: {
      type: String,
      default: 'Read the full profile',
    },
    profileLinkUrl: {
      type: String,
      default: '/about',
    },
    roles: {
      type: [roleItemSchema],
      default: [
        {
          title: 'Humanitarian leader',
          text: 'Founder of the Cancer Charity Foundation and Haven Welfare, with the work measured by dignity, consistency, and care.',
        },
        {
          title: 'International consultant',
          text: 'A consultant and social entrepreneur based in the United Arab Emirates, focused on ethical, people-centred decisions.',
        },
      ],
    },
  },
  {
    timestamps: true,
  }
)

const About = mongoose.model('About', aboutSchema)

export default About
