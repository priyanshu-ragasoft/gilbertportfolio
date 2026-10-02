import Philosophy from '../models/Philosophy.js'

const defaultPhilosophyData = {
  kicker: 'A thematic statement',
  statement: 'When you choose to help others up, you help people rise as well.',
  note: 'A thematic statement drawn from his published writing on service. It is not presented here as a recorded quotation.',
  image: '/src/assets/images/gilbert-kwizera-office-standing.jpg',
  imageAlt: 'Gilbert Kevin Jimmy Kwizera',
}

// @desc    Get Thematic Statement / Philosophy data
// @route   GET /api/philosophy
// @access  Public
export const getPhilosophy = async (req, res) => {
  try {
    let doc = await Philosophy.findOne()

    if (!doc) {
      doc = await Philosophy.create(defaultPhilosophyData)
    }

    res.status(200).json({
      success: true,
      data: doc,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch philosophy data',
      error: error.message,
    })
  }
}

// @desc    Update Thematic Statement / Philosophy data
// @route   PUT /api/philosophy
// @access  Private/Admin
export const updatePhilosophy = async (req, res) => {
  try {
    const { kicker, statement, note, image, imageAlt } = req.body

    let doc = await Philosophy.findOne()

    if (!doc) {
      doc = new Philosophy(req.body)
    } else {
      if (kicker !== undefined) doc.kicker = kicker
      if (statement !== undefined) doc.statement = statement
      if (note !== undefined) doc.note = note
      if (image !== undefined) doc.image = image
      if (imageAlt !== undefined) doc.imageAlt = imageAlt
    }

    const updated = await doc.save()

    res.status(200).json({
      success: true,
      message: 'Thematic statement updated successfully',
      data: updated,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update thematic statement',
      error: error.message,
    })
  }
}

// @desc    Upload Thematic Statement Background Image
// @route   POST /api/philosophy/upload
// @access  Private/Admin
export const uploadPhilosophyImage = async (req, res) => {
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
