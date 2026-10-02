import FeaturedStory from '../models/FeaturedStory.js'

const defaultStoryData = {
  eyebrow: 'Featured story · Cancer care',
  title: 'He Battled Cancer for 24 Years',
  image: '/src/assets/images/ccf-uci.jpg',
  imageAlt: 'Uganda Cancer Institute, where specialised cancer treatment is centred in Kampala',
  leadParagraph:
    'Salim Bwagu was a child when Hodgkin’s lymphoma entered his life. Nearly twenty years later, in 2006, support from Gilbert’s charity made it possible to finish treatment. In 2007 he was cleared. He went on to help other patients face the same two barriers: cost, and a lack of clear information.',
  secondaryParagraph:
    'The account is published in full on this site without added drama. What it insists on is ordinary and serious: stay with the treatment, and do not leave people to carry it alone.',
  buttonText: 'Read the Story',
  buttonLink: '/projects/he-battled-cancer-for-24-years',
  sideNote:
    'Told with Salim’s name, his family’s, and the dates in the original record — from Mulago in 1987 to the National Cancer Institute in 2007.',
  sideLinkText: 'The full story',
  sideLinkUrl: '/projects/he-battled-cancer-for-24-years',
}

// @desc    Get Featured Story data
// @route   GET /api/featured-story
// @access  Public
export const getFeaturedStory = async (req, res) => {
  try {
    let story = await FeaturedStory.findOne()

    if (!story) {
      story = await FeaturedStory.create(defaultStoryData)
    }

    res.status(200).json({
      success: true,
      data: story,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured story data',
      error: error.message,
    })
  }
}

// @desc    Update Featured Story data
// @route   PUT /api/featured-story
// @access  Private/Admin
export const updateFeaturedStory = async (req, res) => {
  try {
    const {
      eyebrow,
      title,
      image,
      imageAlt,
      leadParagraph,
      secondaryParagraph,
      buttonText,
      buttonLink,
      sideNote,
      sideLinkText,
      sideLinkUrl,
    } = req.body

    let story = await FeaturedStory.findOne()

    if (!story) {
      story = new FeaturedStory(req.body)
    } else {
      if (eyebrow !== undefined) story.eyebrow = eyebrow
      if (title !== undefined) story.title = title
      if (image !== undefined) story.image = image
      if (imageAlt !== undefined) story.imageAlt = imageAlt
      if (leadParagraph !== undefined) story.leadParagraph = leadParagraph
      if (secondaryParagraph !== undefined) story.secondaryParagraph = secondaryParagraph
      if (buttonText !== undefined) story.buttonText = buttonText
      if (buttonLink !== undefined) story.buttonLink = buttonLink
      if (sideNote !== undefined) story.sideNote = sideNote
      if (sideLinkText !== undefined) story.sideLinkText = sideLinkText
      if (sideLinkUrl !== undefined) story.sideLinkUrl = sideLinkUrl
    }

    const updated = await story.save()

    res.status(200).json({
      success: true,
      message: 'Featured Story section updated successfully',
      data: updated,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update featured story section',
      error: error.message,
    })
  }
}

// @desc    Upload Featured Story image
// @route   POST /api/featured-story/upload
// @access  Private/Admin
export const uploadFeaturedStoryImage = async (req, res) => {
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
