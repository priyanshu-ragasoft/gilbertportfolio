import mongoose from 'mongoose'

const galleryCardSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'Humanitarian & Care' },
  location: { type: String, default: 'Dubai, UAE' },
  year: { type: String, default: '2026' },
  image: { type: String, required: true },
  position: { type: String, default: 'center 10%' },
  caption: { type: String, default: '' },
  tag: { type: String, default: 'Initiative' },
})

const gallerySectionSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: 'Archival Visuals',
    },
    title: {
      type: String,
      default: 'Moments of Service, Fieldwork & Leadership',
    },
    leadText: {
      type: String,
      default:
        'A complete photographic archive documenting over two decades of direct humanitarian fieldwork, cancer care foundations, school initiatives, and international strategic leadership.',
    },
    categories: {
      type: [String],
      default: [
        'All',
        'Humanitarian & Care',
        'Education & Youth',
        'Global Leadership',
        'Publications & Media',
      ],
    },
    items: [galleryCardSchema],
  },
  {
    timestamps: true,
  }
)

const GallerySection = mongoose.model('GallerySection', gallerySectionSchema)

export default GallerySection
