import InsightsSection from '../models/InsightsSection.js'

const defaultInsightsData = {
  eyebrow: 'Insights',
  title: 'Notes from the work',
  leadText:
    'Essays and short films published on his site, kept in his own record rather than retold as something else.',
  buttonText: 'View All Blog & Insights',
  buttonLink: '/blog',
  featuredSlug: 'pio-system-and-gilbert-kevin-jimmy-kwizeras-innovation-role',
  bottomNote: 'Looking for the project records? They live on the projects page.',
}

// @desc    Get Insights Section configuration
// @route   GET /api/insights-section
// @access  Public
export const getInsightsSection = async (req, res) => {
  try {
    let section = await InsightsSection.findOne()

    if (!section) {
      section = await InsightsSection.create(defaultInsightsData)
    }

    res.status(200).json({
      success: true,
      data: section,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch insights section settings',
      error: error.message,
    })
  }
}

// @desc    Update Insights Section configuration
// @route   PUT /api/insights-section
// @access  Private/Admin
export const updateInsightsSection = async (req, res) => {
  try {
    const { eyebrow, title, leadText, buttonText, buttonLink, featuredSlug, bottomNote } = req.body

    let section = await InsightsSection.findOne()

    if (!section) {
      section = new InsightsSection(req.body)
    } else {
      if (eyebrow !== undefined) section.eyebrow = eyebrow
      if (title !== undefined) section.title = title
      if (leadText !== undefined) section.leadText = leadText
      if (buttonText !== undefined) section.buttonText = buttonText
      if (buttonLink !== undefined) section.buttonLink = buttonLink
      if (featuredSlug !== undefined) section.featuredSlug = featuredSlug
      if (bottomNote !== undefined) section.bottomNote = bottomNote
    }

    const updated = await section.save()

    res.status(200).json({
      success: true,
      message: 'Insights section updated successfully',
      data: updated,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update insights section',
      error: error.message,
    })
  }
}
