import mongoose from 'mongoose'

const galleryItemSchema = new mongoose.Schema({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  position: { type: String, default: 'center top' },
  className: { type: String, default: 'aspect-[4/3]' },
  parallax: { type: Boolean, default: false },
  fit: { type: String, default: 'cover' },
})

const projectItemSchema = new mongoose.Schema({
  slug: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'Community development' },
  date: { type: String, default: '2026' },
  image: { type: String, required: true },
  heroImage: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
  imageFit: { type: String, default: 'cover' },
  summary: { type: String, default: '' },
  paragraphs: [{ type: String }],
  tags: [{ type: String }],
  gallery: [galleryItemSchema],
})

const projectsSectionSchema = new mongoose.Schema(
  {
    eyebrow: {
      type: String,
      default: 'Selected work',
    },
    title: {
      type: String,
      default: 'Projects That Impact Lives',
    },
    leadText: {
      type: String,
      default:
        'Documented initiatives spanning education in Fort Portal, cancer care advocacy, pan-African employment awareness, and global cultural dialogue.',
    },
    projects: [projectItemSchema],
  },
  {
    timestamps: true,
  }
)

const ProjectSection = mongoose.model('ProjectSection', projectsSectionSchema)

export default ProjectSection
