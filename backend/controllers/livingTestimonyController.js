import LivingTestimony from '../models/LivingTestimony.js'

const DEFAULT_GLADYS_MILESTONES = [
  {
    step: '01',
    year: '2009',
    tag: 'Early Warning',
    shortTitle: 'Self-Check Discovery',
    title: 'Radio Broadcasts & Prompt Self-Examination',
    subtitle: 'Heeding awareness advice leading to immediate hospital consultation',
    description:
      'In 2009, having heard radio health programs advising women to regularly check their breasts, Gladys examined her right breast while bathing. Noticing an unusual bloody discharge from the nipple without lump or pain, she acted decisively and sought immediate medical attention at Nsambya Hospital.',
    highlight:
      '“I followed that advice and examined my right breast... When I pressed the nipple, I noticed an unusual discharge mixed with blood. I immediately went to Nsambya Hospital.”',
    enabled: true,
  },
  {
    step: '02',
    year: 'Diagnosis',
    tag: 'Stage 2 Diagnosis',
    shortTitle: 'Mastectomy Surgery',
    title: 'Stage 2 Confirmation & Life-Saving Surgery',
    subtitle: 'Biopsy confirmation and swift surgical intervention at Nsambya Hospital',
    description:
      'Detailed clinical examinations and a biopsy at Nsambya Hospital confirmed Stage 2 breast cancer. To prevent the cancer from spreading further, the surgical team advised immediate mastectomy surgery. Gladys underwent successful surgery and prepared for post-operative chemotherapy.',
    highlight:
      '“The results confirmed that I had breast cancer at Stage 2. The doctors advised that the affected breast needed to be removed... I underwent surgery.”',
    enabled: true,
  },
  {
    step: '03',
    year: 'The Lifeline',
    tag: 'Mr. Jimmy Sponsorship',
    shortTitle: 'Chemo Sponsorship',
    title: 'Mr. Jimmy & CCF Full Medication Support',
    subtitle: 'Relieving overwhelming financial burdens across 6 chemotherapy cycles',
    description:
      'Chemotherapy was required at Mulago Hospital for 6 monthly cycles. Weakened by treatment, Gladys received a life-saving intervention when Mr. Jimmy (Gilbert Kevin Jimmy Kwizera) learned of her situation through Bishop Paul Ssemogerere. Mr. Jimmy funded all essential chemotherapy medicines for the entire duration of her treatment.',
    highlight:
      '“For all six cycles of chemotherapy, Mr. Jimmy continued supporting me with the cost of my medicines. His assistance made a significant difference when the financial burden was overwhelming.”',
    enabled: true,
  },
  {
    step: '04',
    year: 'Treatment',
    tag: 'Radiotherapy & Scans',
    shortTitle: 'Radiotherapy & PET Scan',
    title: 'Radiotherapy & Comprehensive Clear Scans',
    subtitle: '6 radiotherapy sessions and advanced scans at Aga Khan Hospital Nairobi',
    description:
      'Following chemotherapy, Gladys completed six sessions of radiotherapy for severe back pain. In 2013, to rule out bone recurrence, she traveled with her son’s support to Aga Khan Hospital in Nairobi and abroad for advanced PET scans, which confirmed she was completely cancer-free.',
    highlight:
      '“With the help of my son, I was able to get an appointment at Aga Khan Hospital in Nairobi, where I underwent the scan... The results indicated that I did not have cancer.”',
    enabled: true,
  },
  {
    step: '05',
    year: 'Today',
    tag: '70 Years Milestone',
    shortTitle: '70 & Cancer Free',
    title: '70-Year-Old Living Beacon of Hope',
    subtitle: 'Celebrating 70 years, vigilant health monitoring, and inspiring early detection',
    description:
      'Having celebrated her 70th birthday on September 5th, Gladys continues regular check-ups while sharing her story. She stands as living proof that listening to your body, seeking immediate medical care, and compassionate benefactors make survival possible.',
    highlight:
      '“Mr. Jimmy was the person who came forward to help me when I needed support the most... ensuring people facing cancer are not left alone because they cannot afford treatment.”',
    enabled: true,
  },
]

const DEFAULT_SURVIVORS = [
  {
    id: 'gladys',
    name: 'Mrs. Gladys Nsereko',
    badge: 'Breast Cancer Survivor',
    age: '70 Years Old - Turned 70 on September 5th',
    year: 'Surviving Since 2009',
    hospitals: 'Nsambya & Mulago',
    image: '/src/assets/images/pa.jpeg',
    accentColor: 'rose',
    tagline: '70-Year-Old Beacon of Hope & Early Screening',
    quote:
      '“My journey began in 2009... Mr. Jimmy was the person who came forward to help me when I needed support the most.”',
    detectionStatLabel: 'Self-Exam',
    detectionStatSub: 'Prompt media guidance in 2009',
    chemoStatLabel: '6 Cycles',
    chemoStatSub: 'Medication funded by Mr. Jimmy',
    introStory:
      'My name is Gladys Nsereko and I turned 70 years old on September 5th. My journey with breast cancer began in 2009, when I discovered something unusual in my right breast.',
    highlightQuote:
      'During this difficult period, Mr. Jimmy became involved in my case after learning about my situation through Bishop Paul Ssemogerere. He offered to support me with the cost of the medicines I needed during my chemotherapy treatment. For all six cycles of chemotherapy, Mr. Jimmy continued supporting me with the cost of my medicines.',
    milestonesHeading: 'The Path to Recovery',
    milestonesSub: 'Explore the 5 vital chapters of Mrs. Gladys Nsereko’s courageous recovery',
    milestones: DEFAULT_GLADYS_MILESTONES,
  },
  {
    id: 'jackie',
    name: 'Apple Jackie',
    badge: 'Cervical Cancer Survivor',
    age: '58 Years Old',
    year: 'Surviving Since 2010',
    hospitals: 'Nsambya Hospital',
    image: '/src/assets/images/jack1.jpg',
    accentColor: 'amber',
    tagline: 'Mother of 4 & Living Voice of Early Action',
    quote:
      '“Early screening saved my life. Mr. Jimmy and CCF stepped in with clinical guidance and unwavering compassion.”',
    detectionStatLabel: 'Screening',
    detectionStatSub: 'Annual routine health clinic',
    chemoStatLabel: 'Completed Care',
    chemoStatSub: 'Treatment & recovery guidance',
    introStory:
      'Apple Jackie shares her transformative testimony of early diagnosis, perseverance through cancer therapies, and full remission through medical care and CCF compassionate assistance.',
    highlightQuote:
      'No one should walk through diagnosis in silence. Community support and compassionate interventions bridge the gap to survival.',
    milestonesHeading: 'The Road to Remission',
    milestonesSub: 'Explore Jackie’s journey through diagnosis, treatment, and community leadership',
    milestones: DEFAULT_GLADYS_MILESTONES.map((m) => ({
      ...m,
      subtitle: 'Comprehensive treatment milestones and ongoing healthy remission',
    })),
  },
]

const DEFAULT_LIVING_TESTIMONY = {
  eyebrow: 'Living Testimonies of Hope · Cancer Charity Foundation',
  title: 'Stories of Strength & Survival',
  subtitle:
    'Real people whose lives were saved through early detection, clinical treatment, and compassionate support from Mr. Jimmy & CCF.',
  survivors: DEFAULT_SURVIVORS,
}

// @desc    Get Living Testimony Section data
// @route   GET /api/testimonies
// @access  Public
export const getLivingTestimonies = async (req, res) => {
  try {
    let data = await LivingTestimony.findOne()

    if (!data) {
      data = await LivingTestimony.create(DEFAULT_LIVING_TESTIMONY)
    }

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve living testimonies data',
      error: error.message,
    })
  }
}

// @desc    Update Living Testimony Section data
// @route   PUT /api/testimonies
// @access  Private/Admin
export const updateLivingTestimonies = async (req, res) => {
  try {
    const { eyebrow, title, subtitle, survivors } = req.body

    let data = await LivingTestimony.findOne()

    if (!data) {
      data = new LivingTestimony(DEFAULT_LIVING_TESTIMONY)
    }

    if (eyebrow !== undefined) data.eyebrow = eyebrow
    if (title !== undefined) data.title = title
    if (subtitle !== undefined) data.subtitle = subtitle
    if (Array.isArray(survivors) && survivors.length > 0) {
      data.survivors = survivors
    }

    const updated = await data.save()

    res.status(200).json({
      success: true,
      message: 'Living Testimonies section updated successfully',
      data: updated,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update living testimonies',
      error: error.message,
    })
  }
}

// @desc    Upload Survivor Image
// @route   POST /api/testimonies/upload
// @access  Private/Admin
export const uploadSurvivorImage = async (req, res) => {
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
      message: 'Survivor image uploaded successfully',
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
