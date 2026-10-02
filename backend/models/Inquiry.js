import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
    },
    subject: {
      type: String,
      default: 'General Inquiry',
    },
    organization: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Please provide message content'],
    },
    type: {
      type: String,
      enum: ['inquiry', 'donation', 'partnership', 'advisory'],
      default: 'inquiry',
    },
    status: {
      type: String,
      enum: ['new', 'in-review', 'responded', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
)

const Inquiry = mongoose.model('Inquiry', inquirySchema)
export default Inquiry
