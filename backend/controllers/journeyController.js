import Journey from '../models/Journey.js'

const DEFAULT_CHAPTERS = [
  {
    id: 'born-uganda',
    index: '01',
    year: '1971',
    shortLocation: 'Uganda',
    location: 'Kampala, Uganda',
    title: 'Born in Uganda',
    description:
      'Born in Uganda in 1971, cultivating early values of resilience, resourcefulness, and a lifelong commitment toward uplifting vulnerable communities through enterprise and service.',
    image: '/src/assets/images/gilbert-kwizera-lounge-armchair.jpg',
    imageAlt: 'Portrait of Gilbert Kevin Jimmy Kwizera, Born in Uganda in 1971',
    href: '/about',
    cta: 'Read the profile',
  },
  {
    id: 'studies-india',
    index: '02',
    year: '1993–1999',
    shortLocation: 'India',
    location: 'Mahaveera & Mangalore, India',
    title: 'Higher Studies in India',
    description:
      'Pursued pre-university credentials at Mahaveera College (1993–1995) followed by a Bachelor of Business Management (BBM) at Mangalore University (1996–1999), establishing a lifelong Pan-Asian network.',
    image: '/src/assets/images/gilbert-kwizera-marble-lobby.jpg',
    imageAlt: 'Gilbert Kevin Jimmy Kwizera, Higher Studies at Mahaveera College and Mangalore University',
    href: '/about',
    cta: 'View education notes',
  },
  {
    id: 'enterprise-uganda',
    index: '03',
    year: '2000',
    shortLocation: 'Uganda',
    location: 'Kampala, Uganda',
    title: 'Pioneering Internet & Enterprise in Uganda',
    description:
      "Returned to Uganda in 2000 to establish one of the country's first cyber cafés, subsequently expanding into woodworks, real estate, manufacturing, procurement, vehicle imports, IT, and education.",
    image: '/src/assets/images/gilbert-kwizera-office-standing.jpg',
    imageAlt: 'Pioneering early internet café and multi-sector enterprise growth in Uganda',
    href: '/projects',
    cta: 'See enterprise ventures',
  },
  {
    id: 'gold-uganda',
    index: '04',
    year: '2010',
    shortLocation: 'Gold Mine',
    location: 'Uganda & East Africa',
    title: 'Gold Operations & Regional Trade',
    description:
      'Entered the gold trade in Uganda, focusing on ethical sourcing, transparent supply chain management, and sustainable mineral stewardship across East African markets.',
    image: '/src/assets/images/gilbert-kwizera-executive.jpg',
    imageAlt: 'Responsible gold business and mineral trading initiatives in Uganda',
    href: '/about',
    cta: 'Read mineral & gold story',
  },
  {
    id: 'foundations-ccf',
    index: '05',
    year: '2014',
    shortLocation: 'Charity',
    location: 'Pan-African Outreach',
    title: 'Cancer Charity & Haven Welfare',
    description:
      'Co-founded Cancer Charity Foundation (CCF) to fund life-saving oncology care and established Haven Welfare to provide dignity-first rehabilitation, nutrition, and skills training for vulnerable families.',
    image: '/src/assets/images/ccf-cancer-care-compassion.jpg',
    imageAlt: 'Cancer Charity Foundation and Haven Welfare founded in 2014',
    href: '/#impact',
    cta: 'Explore CCF & Haven',
  },
  {
    id: 'dubai-headquarters',
    index: '06',
    year: '2016+',
    shortLocation: 'Dubai',
    location: 'Dubai, UAE',
    title: 'Settled in Dubai & Digital Assets',
    description:
      'Relocated headquarters to Dubai, engaging in international gold trading, cross-border structured commodities, and proprietary digital asset investments across the MENA region.',
    image: '/src/assets/images/gilbert-kwizera-dubai-walking.jpg',
    imageAlt: 'Gilbert Kevin Jimmy Kwizera, settled in Dubai for gold sales, consulting, and asset management',
    href: '/about',
    cta: 'Dubai headquarters',
  },
  {
    id: 'global-blockchain',
    index: '07',
    year: '2022–26',
    shortLocation: '18 Nations',
    location: 'Global (18 Countries)',
    title: 'Global Blockchain & 18 Nations',
    description:
      'Traveled across 18 countries (Singapore, France, Italy, Turkey, South Africa, Rwanda, Congo, etc.) while building next-generation blockchain protocols, PIO Ecosystem, and ISBET Brainery.',
    image: '/src/assets/images/gilbert-kwizera-dubai-marina-yacht.jpg',
    imageAlt: 'Blockchain projects, PIO Ecosystem, and travels across 18 countries',
    href: '/projects',
    cta: 'Explore PIO & Blockchain',
  },
]

const DEFAULT_JOURNEY = {
  eyebrow: 'Journey',
  title: 'A Journey',
  subtitle: 'Across Borders',
  introText:
    'Kampala, the years of study, a life in the Emirates, and the work that kept returning to Uganda.',
  scrollHintText: 'Scroll to travel',
  chapters: DEFAULT_CHAPTERS,
}

// @desc    Get Journey Section data
// @route   GET /api/journey
// @access  Public
export const getJourney = async (req, res) => {
  try {
    let journeyData = await Journey.findOne()

    if (!journeyData) {
      journeyData = await Journey.create(DEFAULT_JOURNEY)
    }

    res.status(200).json({
      success: true,
      data: journeyData,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve journey data',
      error: error.message,
    })
  }
}

// @desc    Update Journey Section data
// @route   PUT /api/journey
// @access  Private/Admin
export const updateJourney = async (req, res) => {
  try {
    const { eyebrow, title, subtitle, introText, scrollHintText, chapters } = req.body

    let journeyData = await Journey.findOne()

    if (!journeyData) {
      journeyData = new Journey(DEFAULT_JOURNEY)
    }

    if (eyebrow !== undefined) journeyData.eyebrow = eyebrow
    if (title !== undefined) journeyData.title = title
    if (subtitle !== undefined) journeyData.subtitle = subtitle
    if (introText !== undefined) journeyData.introText = introText
    if (scrollHintText !== undefined) journeyData.scrollHintText = scrollHintText
    if (Array.isArray(chapters) && chapters.length > 0) {
      journeyData.chapters = chapters
    }

    const updated = await journeyData.save()

    res.status(200).json({
      success: true,
      message: 'Journey section updated successfully',
      data: updated,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update journey section',
      error: error.message,
    })
  }
}

// @desc    Upload Journey Image
// @route   POST /api/journey/upload
// @access  Private/Admin
export const uploadJourneyImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file',
      })
    }

    const host = req.get('host')
    const protocol = req.protocol
    const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`

    res.status(200).json({
      success: true,
      message: 'Journey image uploaded successfully',
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
