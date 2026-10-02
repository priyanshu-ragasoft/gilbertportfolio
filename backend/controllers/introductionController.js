import Introduction from '../models/Introduction.js'

// @desc    Get active Introduction section content
// @route   GET /api/intro
// @access  Public
export const getIntro = async (req, res, next) => {
  try {
    let intro = await Introduction.findOne({ isActive: true }).sort({ updatedAt: -1 })

    if (!intro) {
      intro = await Introduction.create({
        indexNumber: '01',
        kicker: 'Introduction',
        titleLine1: 'A Life Dedicated to',
        titleLine2: 'Service, Dignity, and Hope.',
        role: 'Humanitarian leader, international consultant, and volunteer',
        paragraphs: [
          'Gilbert Kevin Jimmy Kwizera is a humanitarian leader, international consultant, and volunteer. He founded the Cancer Charity Foundation and Haven Welfare, and he has committed the work to dignity-based care, ethical leadership, and sustainable social impact.',
          'The work is quiet on purpose. Help is offered without turning people into public stories. What matters is consistency: showing up, using resources responsibly, and making decisions that protect human dignity.',
        ],
        profileLinkText: 'Read the full profile',
        profileLinkUrl: '/about',
        shutterBadge: 'Hover to reveal',
        shutterTag: 'A working standard',
        shutterHeading: 'Charity is treated as a duty, not a performance.',
        shutterDescription:
          'Show up, use resources carefully, and leave a person’s dignity intact. The work is meant to continue when no one is watching.',
        shutterImage: '/src/assets/images/gilbert-kwizera-office-standing.jpg',
        shutterOriginLabel: 'Origin',
        shutterOriginValue: 'Kampala, Uganda',
        shutterNowLabel: 'Now',
        shutterNowValue: 'Jumeirah, Dubai',
        facts: [
          { label: 'Born', value: 'Kampala, 1971' },
          { label: 'Based', value: 'Dubai, UAE' },
          { label: 'Founded', value: 'CCF & Haven Welfare' },
          { label: 'Standard', value: 'Dignity-based care' },
        ],
        pillars: [
          {
            number: '01',
            title: 'Cancer care',
            organization: 'Cancer Charity Foundation',
            text: 'Practical support so treatment is not abandoned because of poverty, distance, or isolation.',
            to: '/impact/cancer-charity-foundation',
          },
          {
            number: '02',
            title: 'Recovery',
            organization: 'Haven Welfare',
            text: 'Rehabilitation given time and privacy — a return to community without stigma.',
            to: '/impact/haven-welfare',
          },
          {
            number: '03',
            title: 'Education',
            organization: 'Classrooms and skills',
            text: 'Books in a classroom, and training that prepares people to serve rather than to display.',
            to: '/impact/isbet-brainery',
          },
        ],
        isActive: true,
      })
    }

    res.status(200).json({
      success: true,
      data: intro,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update Introduction section content
// @route   PUT /api/intro
// @access  Private / Public in Dev
export const updateIntro = async (req, res, next) => {
  try {
    const updateData = req.body

    let intro = await Introduction.findOne({ isActive: true })

    if (intro) {
      intro = await Introduction.findByIdAndUpdate(intro._id, updateData, {
        new: true,
        runValidators: true,
      })
    } else {
      intro = await Introduction.create({
        ...updateData,
        isActive: true,
      })
    }

    res.status(200).json({
      success: true,
      data: intro,
      message: 'Introduction content updated and published live successfully!',
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Upload Introduction shutter/portrait image
// @route   POST /api/intro/upload
// @access  Public / Private
export const uploadIntroImage = async (req, res, next) => {
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
      message: 'Introduction image uploaded successfully',
    })
  } catch (error) {
    next(error)
  }
}
