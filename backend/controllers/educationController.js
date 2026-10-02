import Education from '../models/Education.js'

const defaultEducationData = {
  eyebrow: 'Knowledge',
  title: 'Education as a Tool for Service',
  paragraphs: [
    'In his published writing, learning was never framed as a private advantage. Business, information technology, and finance were how he learned to see institutions: where resources go, and how a system can help a person or harm them.',
    'That is the bridge into the humanitarian work. Compassion still needs a structure that is transparent and able to last. ISBET Brainery Academy is the education platform in this body of work — practical technology training, guided lessons, and career skills.',
    'The same conviction shows up in direct gifts: books and tools in a classroom, so a child’s day is not stopped by the absence of something basic.',
  ],
  linkText: 'Explore ISBET Brainery',
  linkUrl: '/impact/isbet-brainery',
  image: '/src/assets/images/Supporting-Education-Empowering-Futures.jpg',
  imageAlt: 'Pupils holding new exercise books after a donation of scholastic materials',
}

// @desc    Get Education section data
// @route   GET /api/education
// @access  Public
export const getEducation = async (req, res) => {
  try {
    let section = await Education.findOne()

    if (!section) {
      section = await Education.create(defaultEducationData)
    }

    res.status(200).json({
      success: true,
      data: section,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch education section data',
      error: error.message,
    })
  }
}

// @desc    Update Education section data
// @route   PUT /api/education
// @access  Private/Admin
export const updateEducation = async (req, res) => {
  try {
    const { eyebrow, title, paragraphs, linkText, linkUrl, image, imageAlt } = req.body

    let section = await Education.findOne()

    if (!section) {
      section = new Education(req.body)
    } else {
      if (eyebrow !== undefined) section.eyebrow = eyebrow
      if (title !== undefined) section.title = title
      if (paragraphs !== undefined) section.paragraphs = paragraphs
      if (linkText !== undefined) section.linkText = linkText
      if (linkUrl !== undefined) section.linkUrl = linkUrl
      if (image !== undefined) section.image = image
      if (imageAlt !== undefined) section.imageAlt = imageAlt
    }

    const updated = await section.save()

    res.status(200).json({
      success: true,
      message: 'Education section updated successfully',
      data: updated,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update education section',
      error: error.message,
    })
  }
}

// @desc    Upload image for Education section
// @route   POST /api/education/upload
// @access  Private/Admin
export const uploadEducationImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      })
    }

    const host = req.get('host')
    const protocol = req.protocol
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message,
    })
  }
}
