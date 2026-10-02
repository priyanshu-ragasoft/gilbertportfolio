import About from '../models/About.js'

// @desc    Get active About section content
// @route   GET /api/about
// @access  Public
export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne()
    if (!about) {
      about = await About.create({})
    }
    res.status(200).json({
      success: true,
      data: about,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve About section content',
      error: error.message,
    })
  }
}

// @desc    Update About section content
// @route   PUT /api/about
// @access  Public (or Admin protected)
export const updateAbout = async (req, res) => {
  try {
    const updateData = req.body

    let about = await About.findOne()
    if (!about) {
      about = await About.create(updateData)
    } else {
      about = await About.findByIdAndUpdate(about._id, updateData, {
        new: true,
        runValidators: true,
      })
    }

    res.status(200).json({
      success: true,
      message: 'About section updated successfully',
      data: about,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update About section',
      error: error.message,
    })
  }
}

// @desc    Upload About section portrait image
// @route   POST /api/about/upload
// @access  Public (or Admin protected)
export const uploadAboutImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded',
      })
    }

    const host = req.get('host')
    const protocol = req.protocol
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`

    res.status(200).json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message,
    })
  }
}
