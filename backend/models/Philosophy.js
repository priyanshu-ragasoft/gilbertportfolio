import mongoose from 'mongoose'

const philosophySchema = new mongoose.Schema(
  {
    kicker: {
      type: String,
      default: 'A thematic statement',
    },
    statement: {
      type: String,
      default: 'When you choose to help others up, you help people rise as well.',
    },
    note: {
      type: String,
      default:
        'A thematic statement drawn from his published writing on service. It is not presented here as a recorded quotation.',
    },
    image: {
      type: String,
      default: '/src/assets/images/gilbert-kwizera-office-standing.jpg',
    },
    imageAlt: {
      type: String,
      default: 'Gilbert Kevin Jimmy Kwizera',
    },
  },
  {
    timestamps: true,
  }
)

const Philosophy = mongoose.model('Philosophy', philosophySchema)

export default Philosophy
