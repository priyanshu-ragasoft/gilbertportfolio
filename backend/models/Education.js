import mongoose from 'mongoose'

const educationSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: 'Knowledge',
    },
    title: {
      type: String,
      default: 'Education as a Tool for Service',
    },
    paragraphs: {
      type: [String],
      default: [
        'In his published writing, learning was never framed as a private advantage. Business, information technology, and finance were how he learned to see institutions: where resources go, and how a system can help a person or harm them.',
        'That is the bridge into the humanitarian work. Compassion still needs a structure that is transparent and able to last. ISBET Brainery Academy is the education platform in this body of work — practical technology training, guided lessons, and career skills.',
        'The same conviction shows up in direct gifts: books and tools in a classroom, so a child’s day is not stopped by the absence of something basic.',
      ],
    },
    linkText: {
      type: String,
      default: 'Explore ISBET Brainery',
    },
    linkUrl: {
      type: String,
      default: '/impact/isbet-brainery',
    },
    image: {
      type: String,
      default: '/src/assets/images/Supporting-Education-Empowering-Futures.jpg',
    },
    imageAlt: {
      type: String,
      default: 'Pupils holding new exercise books after a donation of scholastic materials',
    },
  },
  {
    timestamps: true,
  }
)

const Education = mongoose.model('Education', educationSchema)

export default Education
