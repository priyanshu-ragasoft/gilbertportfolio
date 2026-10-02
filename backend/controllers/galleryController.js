import GallerySection from '../models/Gallery.js'

const defaultGalleryData = {
  eyebrow: 'Archival Visuals',
  title: 'Moments of Service, Fieldwork & Leadership',
  leadText:
    'A complete photographic archive documenting over two decades of direct humanitarian fieldwork, cancer care foundations, school initiatives, and international strategic leadership.',
  categories: [
    'All',
    'Humanitarian & Care',
    'Education & Youth',
    'Global Leadership',
    'Publications & Media',
  ],
  items: [
    {
      id: 'executive-office',
      title: 'International Executive Consultation',
      category: 'Global Leadership',
      location: 'Dubai, UAE',
      year: '2026',
      image: '/src/assets/images/gilbert-kwizera-executive.jpg',
      position: 'center 8%',
      caption: 'Leading cross-sector partnerships and sustainable advisory from Dubai.',
      tag: 'Executive',
    },
    {
      id: 'ccf-compassion',
      title: 'Compassionate Cancer Care in Uganda',
      category: 'Humanitarian & Care',
      location: 'Kampala, Uganda',
      year: '2026',
      image: '/src/assets/images/ccf-cancer-care-compassion.jpg',
      position: 'center center',
      caption: 'Cancer Charity Foundation providing nutrition, shelter, and continuous care.',
      tag: 'Healthcare',
    },
    {
      id: 'sanjay-dutt-dialogue',
      title: 'Global Cultural Dialogue & Advocacy',
      category: 'Global Leadership',
      location: 'Dubai, UAE',
      year: '2026',
      image: '/src/assets/images/gilbert-kwizera-sanjay-dutt.jpg',
      position: 'center 8%',
      caption: 'With cultural icon Sanjay Dutt, uniting international voices for cancer recovery.',
      tag: 'Outreach',
    },
    {
      id: 'fort-portal-schoolyard',
      title: 'Supporting Education in Fort Portal',
      category: 'Education & Youth',
      location: 'Fort Portal, Uganda',
      year: '2026',
      image: '/src/assets/images/Supporting-Education-Empowering-Futures.jpg',
      position: 'center 20%',
      caption: 'Pupils at Divine Mercy Primary School receiving scholastic books and supplies.',
      tag: 'Education',
    },
    {
      id: 'dubai-walking',
      title: 'Urban Diplomacy & Enterprise',
      category: 'Global Leadership',
      location: 'Downtown Dubai',
      year: '2026',
      image: '/src/assets/images/gilbert-kwizera-dubai-walking.jpg',
      position: 'center 8%',
      caption: 'Navigating international economic and humanitarian commitments.',
      tag: 'Consultancy',
    },
    {
      id: 'employment-awareness',
      title: 'Pan-African Employment Awareness',
      category: 'Humanitarian & Care',
      location: 'Pan-Africa',
      year: '2026',
      image: '/src/assets/images/kwizera-humanitarian-employment-initiative.jpg',
      position: 'center center',
      caption: 'Empowering job seekers across Africa with verified updates and zero recruitment fees.',
      tag: 'Initiative',
    },
    {
      id: 'haven-rehab',
      title: 'Dignified Rehabilitation & Recovery',
      category: 'Humanitarian & Care',
      location: 'Uganda',
      year: '2024',
      image: '/src/assets/images/havenwelfare.jpg',
      position: 'center 25%',
      caption: 'Quiet, community-centred addiction recovery and personal renewal.',
      tag: 'Haven Welfare',
    },
    {
      id: 'lounge-portrait',
      title: 'Philosophy of Quiet Leadership',
      category: 'Global Leadership',
      location: 'Jumeirah, Dubai',
      year: '2026',
      image: '/src/assets/images/gilbert-kwizera-lounge-armchair.jpg',
      position: 'center 8%',
      caption: 'Service treated as a duty rather than performance or public spectacle.',
      tag: 'Portrait',
    },
    {
      id: 'pio-innovation',
      title: 'PIO Innovation Ecosystem',
      category: 'Publications & Media',
      location: 'Global',
      year: '2026',
      image: '/src/assets/images/pio-ecosystem-technology.jpg',
      position: 'center center',
      caption: 'Integrating technology, education, and humanitarian initiatives.',
      tag: 'Technology',
    },
    {
      id: 'classroom-supplies',
      title: 'Classroom Learning Distribution',
      category: 'Education & Youth',
      location: 'Kiko, Uganda',
      year: '2026',
      image: '/src/assets/images/Gilbert-Kwizera-Charity-Support-for-Uganda-Students-Drive.jpg',
      position: 'center 20%',
      caption: 'Teachers and students with exercise books and classroom learning charts.',
      tag: 'Fieldwork',
    },
    {
      id: 'salim-story',
      title: 'Salim Bwagu: 20-Year Cancer Journey',
      category: 'Humanitarian & Care',
      location: 'Mulago, Uganda',
      year: '2006–2007',
      image: '/src/assets/images/He-Battled-Cancer-for-24-Years.jpg',
      position: 'center 10%',
      caption: 'Full chemotherapy completion and recovery, leading to chronic disease advocacy.',
      tag: 'Survivor Care',
    },
    {
      id: 'uci-centre',
      title: 'Uganda Cancer Institute',
      category: 'Humanitarian & Care',
      location: 'Mulago Hill, Kampala',
      year: '2006–Present',
      image: '/src/assets/images/ccf-uci.jpg',
      position: 'center center',
      caption: 'The institutional centre of specialised oncological care in Uganda.',
      tag: 'Institution',
    },
    {
      id: 'marina-yacht',
      title: 'Maritime Outreach & International Talks',
      category: 'Global Leadership',
      location: 'Dubai Marina',
      year: '2026',
      image: '/src/assets/images/gilbert-kwizera-dubai-marina-yacht.jpg',
      position: 'center 8%',
      caption: 'Engaging global partners along international trade and cultural corridors.',
      tag: 'Dubai',
    },
    {
      id: 'ccf-care-home',
      title: 'Patient Sanctuary & Daily Sustenance',
      category: 'Humanitarian & Care',
      location: 'Kampala, Uganda',
      year: '2024',
      image: '/src/assets/images/ccf-care.jpg',
      position: 'center 20%',
      caption: 'Providing meals, clean water, and emotional safety near treatment centres.',
      tag: 'CCF Haven',
    },
    {
      id: 'marble-lobby',
      title: 'Commercial Governance & Finance',
      category: 'Global Leadership',
      location: 'Financial District, Dubai',
      year: '2026',
      image: '/src/assets/images/gilbert-kwizera-marble-lobby.jpg',
      position: 'center 8%',
      caption: 'Applying disciplined fiscal stewardship to humanitarian foundations.',
      tag: 'Governance',
    },
    {
      id: 'office-reflection',
      title: 'African Roots & Modern Impact',
      category: 'Global Leadership',
      location: 'Dubai, UAE',
      year: '2026',
      image: '/src/assets/images/gilbert-kwizera-office-standing.jpg',
      position: 'center 8%',
      caption: 'Honouring African heritage while building sustainable global institutions.',
      tag: 'Heritage',
    },
    {
      id: 'hotel-entrance-walk',
      title: 'Field Diplomatic Missions',
      category: 'Global Leadership',
      location: 'Dubai, UAE',
      year: '2026',
      image: '/src/assets/images/gilbert-kwizera-hotel-entrance.jpg',
      position: 'center 8%',
      caption: 'Direct community presence and institutional partnerships.',
      tag: 'Diplomacy',
    },
    {
      id: 'blockchain-humanity-book',
      title: 'Blockchain for Humanity Publication',
      category: 'Publications & Media',
      location: 'Nairobi & Kampala',
      year: '2025',
      image: '/src/assets/images/Blockchain.jpg',
      position: 'center center',
      caption: 'A practical roadmap for African digital livelihoods and ethical technology.',
      tag: 'Author',
    },
    {
      id: 'cancer-documentary',
      title: 'Cancer Support & Awareness Film',
      category: 'Publications & Media',
      location: 'Uganda',
      year: '2026',
      image: '/src/assets/images/Gilbert-Kwizera-Driving-Cancer-Support-and-Awareness-in-Uganda.jpg',
      position: 'center 20%',
      caption: 'Documentary still highlighting awareness and community oncological aid.',
      tag: 'Media',
    },
    {
      id: 'early-portrait',
      title: 'Foundational Years of Service',
      category: 'Publications & Media',
      location: 'Kampala & Dubai',
      year: '2022',
      image: '/src/assets/images/solution-kevin.jpg',
      position: 'center 10%',
      caption: 'Early milestones in community volunteering and non-profit structuring.',
      tag: 'Archive',
    },
    {
      id: 'formal-headshot',
      title: 'Diplomatic Registry & Accreditation',
      category: 'Publications & Media',
      location: 'Dubai, UAE',
      year: '2024',
      image: '/src/assets/images/about-kevin.jpg',
      position: 'center 8%',
      caption: 'Official humanitarian leadership portrait and civic foundation registry.',
      tag: 'Archive',
    },
    {
      id: 'hope-essay',
      title: 'A Life Dedicated to Hope & Charity',
      category: 'Publications & Media',
      location: 'Published Essay',
      year: '2026',
      image: '/src/assets/images/Gilbert-Kevin-Jimmy-Kwizera-A-Life-Dedicated-to-Hope-and-Charity.jpg',
      position: 'center 10%',
      caption: 'Reflections on leadership as duty, and charity as quiet structural support.',
      tag: 'Archive',
    },
    {
      id: 'dubai-boardroom',
      title: 'Strategic Innovation & Enterprise',
      category: 'Publications & Media',
      location: 'Dubai, UAE',
      year: '2025',
      image: '/src/assets/images/PIO-System-and-Gilbert-Kevin-Jimmy-Kwizeras-Innovation-Role.jpg',
      position: 'center 15%',
      caption: 'Spearheading technological education frameworks across developing markets.',
      tag: 'Archive',
    },
  ],
}

// @desc    Get Gallery & Archive section data
// @route   GET /api/gallery
// @access  Public
export const getGallery = async (req, res) => {
  try {
    let section = await GallerySection.findOne()

    if (!section) {
      section = await GallerySection.create(defaultGalleryData)
    }

    res.status(200).json({
      success: true,
      data: section,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery archive data',
      error: error.message,
    })
  }
}

// @desc    Update Gallery & Archive section data
// @route   PUT /api/gallery
// @access  Private/Admin
export const updateGallery = async (req, res) => {
  try {
    const { eyebrow, title, leadText, categories, items } = req.body

    let section = await GallerySection.findOne()

    if (!section) {
      section = new GallerySection(req.body)
    } else {
      if (eyebrow !== undefined) section.eyebrow = eyebrow
      if (title !== undefined) section.title = title
      if (leadText !== undefined) section.leadText = leadText
      if (categories !== undefined) section.categories = categories
      if (items !== undefined) section.items = items
    }

    const updated = await section.save()

    res.status(200).json({
      success: true,
      message: 'Gallery & Archive section updated successfully',
      data: updated,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery section',
      error: error.message,
    })
  }
}

// @desc    Upload image for Gallery Archive
// @route   POST /api/gallery/upload
// @access  Private/Admin
export const uploadGalleryImage = async (req, res) => {
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
