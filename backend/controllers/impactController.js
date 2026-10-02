import Impact from '../models/Impact.js'

// @desc    Get active Impact section content
// @route   GET /api/impact
// @access  Public
export const getImpact = async (req, res) => {
  try {
    let impact = await Impact.findOne()
    if (!impact) {
      impact = await Impact.create({})
    }
    res.status(200).json({
      success: true,
      data: impact,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve Impact section content',
      error: error.message,
    })
  }
}

// @desc    Update Impact section content
// @route   PUT /api/impact
// @access  Public (or Admin protected)
export const updateImpact = async (req, res) => {
  try {
    const updateData = req.body

    let impact = await Impact.findOne()
    if (!impact) {
      impact = await Impact.create(updateData)
    } else {
      impact = await Impact.findByIdAndUpdate(impact._id, updateData, {
        new: true,
        runValidators: true,
      })
    }

    res.status(200).json({
      success: true,
      message: 'Impact section updated successfully',
      data: impact,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update Impact section',
      error: error.message,
    })
  }
}

// @desc    Upload Impact section story image
// @route   POST /api/impact/upload
// @access  Public (or Admin protected)
export const uploadImpactImage = async (req, res) => {
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
