import mongoose from 'mongoose'

const galleryImageSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    caption: { type: String, default: '' },
  },
  { _id: false }
)

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide blog title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true,
      enum: ['Innovation', 'Cancer Care', 'Education', 'Profile & Philosophy', 'Humanitarian', 'General'],
      default: 'General',
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    author: {
      type: String,
      default: 'Gilbert Kevin Jimmy Kwizera',
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide an excerpt summary'],
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    paragraphs: {
      type: [String],
      required: [true, 'Please provide article content paragraphs'],
      validate: [v => Array.isArray(v) && v.length > 0, 'Article must have at least one paragraph'],
    },
    image: {
      type: String,
      required: [true, 'Please provide a primary featured image URL'],
    },
    imageAlt: {
      type: String,
      default: 'Featured blog photo',
    },
    gallery: [galleryImageSchema],
    tags: {
      type: [String],
      default: [],
    },
    video: {
      type: String,
      default: '',
    },
    videoFile: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Auto-generate unique slug from title if not provided or modified
blogSchema.pre('save', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  next()
})

const Blog = mongoose.model('Blog', blogSchema)
export default Blog
