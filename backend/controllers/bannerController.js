import Banner from '../models/Banner.js'

// @desc    Get active Hero Banner settings
// @route   GET /api/banner
// @access  Public
export const getBanner = async (req, res, next) => {
  try {
    let banner = await Banner.findOne({ isActive: true }).sort({ updatedAt: -1 })

    if (!banner) {
      banner = await Banner.create({
        kicker: 'HUMANITARIAN • CONSULTANT • SOCIAL IMPACT',
        heading: 'Turning Purpose Into Meaningful Impact.',
        lines: ['Turning Purpose', 'Into Meaningful', 'Impact.'],
        description:
          'Gilbert Kevin Jimmy Kwizera builds practical support for people at their most vulnerable — in cancer care, recovery, education, and the quiet work of protecting dignity.',
        primaryButtonText: 'Explore My Journey',
        primaryButtonLink: '/#journey',
        secondaryButtonText: "Let's Connect",
        secondaryButtonLink: '/contact',
        image: '/src/assets/images/gilbert-kwizera-executive.jpg',
        images: [
          '/src/assets/images/gilbert-kwizera-executive.jpg',
          '/src/assets/images/gilbert-kwizera-lounge-armchair.jpg',
          '/src/assets/images/gilbert-kwizera-office-standing.jpg',
        ],
        autoSlideInterval: 5000,
        isActive: true,
      })
    }

    res.status(200).json({
      success: true,
      data: banner,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update / Save Hero Banner settings
// @route   PUT /api/banner
// @access  Private (Admin Only)
export const updateBanner = async (req, res, next) => {
  try {
    const updateData = req.body

    // Ensure lines array
    if (typeof updateData.lines === 'string') {
      updateData.lines = updateData.lines
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
    }

    // Ensure images array is non-empty
    if (Array.isArray(updateData.images) && updateData.images.length > 0) {
      updateData.image = updateData.images[0]
    } else if (updateData.image) {
      updateData.images = [updateData.image]
    }

    let banner = await Banner.findOne({ isActive: true })

    if (banner) {
      banner = await Banner.findByIdAndUpdate(banner._id, updateData, {
        new: true,
        runValidators: true,
      })
    } else {
      banner = await Banner.create({
        ...updateData,
        isActive: true,
      })
    }

    res.status(200).json({
      success: true,
      data: banner,
      message: 'Hero banner updated and applied live successfully!',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Upload hero banner image
// @route   POST /api/banner/upload
// @access  Private (Admin Only)
export const uploadBannerImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file to upload',
      })
    }

    const fileUrl = `/uploads/${req.file.filename}`

    res.status(200).json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      message: 'Banner image uploaded successfully',
    })
  } catch (error) {
    next(error)
  }
}
