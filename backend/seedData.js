import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Blog from './models/Blog.js'
import User from './models/User.js'

dotenv.config()

const initialBlogs = [
  {
    title: 'PIO System and Gilbert Kevin Jimmy Kwizera’s Innovation Role',
    slug: 'pio-system-and-gilbert-kevin-jimmy-kwizeras-innovation-role',
    category: 'Innovation',
    readTime: '5 min read',
    tags: ['Ecosystem', 'Technology', 'Digital Empowerment', 'Agriculture'],
    author: 'Gilbert Kevin Jimmy Kwizera',
    excerpt: 'The PIO System is a multi-sector framework for technology, education, agriculture, and shared digital solutions, led with a focus on local empowerment.',
    image: '/src/assets/images/pio-ecosystem-technology.jpg',
    imageAlt: 'PIO Ecosystem and Philanthropist Gilbert Kevin Jimmy Kwizera Driving Impact',
    paragraphs: [
      'The PIO System is described as an organised innovation framework, not a single service. It brings people, institutions, and initiatives into one vision spanning technology-based development, education, agricultural modernisation, and shared digital tools.',
      'Under Gilbert Kevin Jimmy Kwizera’s leadership, the system is presented as a way to join innovation with local empowerment. The aim is an environment where education programmes, agricultural projects, social-impact work, and technology can sit inside one ecosystem and share knowledge.',
      'Digital programmes are meant to help young people and organisations see how technology can improve productivity, access, and the way projects are carried out. Education support covers skills, digital literacy, and leadership.',
    ],
    gallery: [
      { src: '/src/assets/images/pio-ecosystem-technology.jpg', caption: 'PIO Platform architecture' },
      { src: '/src/assets/images/PIO-System-and-Gilbert-Kevin-Jimmy-Kwizeras-Innovation-Role.jpg', caption: 'Executive planning in Dubai' },
    ],
    isPublished: true,
    featured: true,
  },
  {
    title: 'Charity Support for Uganda Students',
    slug: 'gilbert-kwizera-charity-support-for-uganda-students-drive',
    category: 'Education',
    readTime: '3 min film',
    tags: ['Education', 'Scholastic Aid', 'Youth Empowerment', 'Uganda'],
    author: 'Gilbert Kevin Jimmy Kwizera',
    excerpt: 'A recorded look at scholastic materials and community-based education support for young learners in Uganda.',
    image: '/src/assets/images/Gilbert-Kwizera-Charity-Support-for-Uganda-Students-Drive.jpg',
    imageAlt: 'Teachers and children with donated school supplies in a Ugandan classroom',
    video: 'https://www.youtube.com/watch?v=_1s5t8bOgKo',
    videoFile: '/videos/uganda-students-charity.mp4',
    paragraphs: [
      'This short film follows a charity initiative in which Gilbert Kevin Jimmy Kwizera supported young learners in Uganda with essential scholastic materials.',
      'The published note is brief and specific: the support was practical, it was rooted in the community, and it was aimed at children’s education. The film is the primary record of the drive.',
      'Classroom materials, textbooks, and sustainable learning tools were distributed directly to students and educators, ensuring that financial barriers do not halt academic progress.',
    ],
    gallery: [
      { src: '/src/assets/images/Gilbert-Kwizera-Charity-Support-for-Uganda-Students-Drive.jpg', caption: 'Scholastic supplies distribution in Kiko' },
      { src: '/src/assets/images/Supporting-Education-Empowering-Futures.jpg', caption: 'Divine Mercy Primary School, Fort Portal' },
    ],
    isPublished: true,
  },
  {
    title: 'Cancer Support and Awareness in Uganda',
    slug: 'gilbert-kwizera-driving-cancer-support-and-awareness-in-uganda',
    category: 'Cancer Care',
    readTime: '4 min film',
    tags: ['Healthcare', 'Cancer Charity Foundation', 'Patient Advocacy'],
    author: 'Gilbert Kevin Jimmy Kwizera',
    excerpt: 'A film on awareness, financial aid, and community programmes for cancer patients and the families around them.',
    image: '/src/assets/images/ccf-cancer-care-compassion.jpg',
    imageAlt: 'Gilbert Kevin Jimmy Kwizera Providing Compassionate Cancer Care Support in Uganda',
    video: 'https://www.youtube.com/watch?v=GxwVERXJZko',
    videoFile: '/videos/cancer-support-uganda.mp4',
    paragraphs: [
      'This film looks at how Gilbert Kevin Jimmy Kwizera is supporting cancer patients in Uganda through awareness, financial aid, and community programmes.',
      'The published description stays with the purpose of the work: improving access to care, and standing with families who are carrying the cost of treatment in more than money.',
      'Through strategic partnerships with oncology medical centers, the initiative bridges critical gaps in diagnostic testing and chemotherapy adherence for underserved patients.',
    ],
    gallery: [
      { src: '/src/assets/images/ccf-cancer-care-compassion.jpg', caption: 'Cancer patient support in Kampala' },
      { src: '/src/assets/images/ccf-care.jpg', caption: 'CCF shelter home' },
    ],
    isPublished: true,
  },
  {
    title: 'Global Cultural Dialogue & Cancer Advocacy with Sanjay Dutt',
    slug: 'global-cultural-dialogue-and-cancer-advocacy-with-sanjay-dutt',
    category: 'Cancer Care',
    readTime: '4 min read',
    tags: ['Advocacy', 'Global Dialogue', 'Cancer Recovery', 'Dubai'],
    author: 'Gilbert Kevin Jimmy Kwizera',
    excerpt: 'Uniting international cultural leaders and philanthropists in Dubai to champion global cancer recovery, dignified treatment access, and public awareness.',
    image: '/src/assets/images/gilbert-kwizera-sanjay-dutt.jpg',
    imageAlt: 'Gilbert Kevin Jimmy Kwizera and cultural icon Sanjay Dutt discussing cancer care',
    paragraphs: [
      'In a landmark philanthropic meeting in Dubai, Gilbert Kevin Jimmy Kwizera engaged with celebrated cinema icon and cancer survivor Sanjay Dutt to discuss international frameworks for cancer awareness and patient support.',
      'The dialogue centered on the emotional and financial realities faced by vulnerable oncology patients across Africa and developing nations.',
    ],
    gallery: [
      { src: '/src/assets/images/gilbert-kwizera-sanjay-dutt.jpg', caption: 'Dialogue on cancer recovery networks' },
      { src: '/src/assets/images/gilbert-kwizera-executive.jpg', caption: 'Humanitarian governance coordination' },
    ],
    isPublished: true,
  },
  {
    title: 'A Life Dedicated to Hope and Charity',
    slug: 'gilbert-kevin-jimmy-kwizera-a-life-dedicated-to-hope-and-charity',
    category: 'Profile & Philosophy',
    readTime: '7 min read',
    tags: ['Leadership', 'Philosophy', 'Dignity', 'Humanitarian'],
    author: 'Gilbert Kevin Jimmy Kwizera',
    excerpt: 'An account of why the work began, how support is organised, and why hope is treated as something a community does.',
    image: '/src/assets/images/gilbert-kwizera-office-standing.jpg',
    imageAlt: 'Gilbert Kevin Jimmy Kwizera in his office with African art and heritage',
    paragraphs: [
      'The essay begins from a simple test of leadership: not the title, but the effect on other people. It places Gilbert Kevin Jimmy Kwizera’s work with cancer patients and people living in poverty, in Uganda and beyond.',
      'The support he builds is described as long-term rather than a one-off relief: funds, emotional support, and public education, with donors, community leaders, and cooperation so that money is not what decides whether treatment continues.',
    ],
    gallery: [
      { src: '/src/assets/images/gilbert-kwizera-office-standing.jpg', caption: 'Gilbert Kwizera in his executive office' },
      { src: '/src/assets/images/Gilbert-Kevin-Jimmy-Kwizera-A-Life-Dedicated-to-Hope-and-Charity.jpg', caption: 'Humanitarian doctrine' },
    ],
    isPublished: true,
  },
  {
    title: 'Salim Bwagu: A 20-Year Journey of Courage and Cancer Care',
    slug: 'salim-bwagu-20-year-cancer-journey-and-survivor-advocacy',
    category: 'Cancer Care',
    readTime: '6 min read',
    tags: ['Survivor Story', 'CCF', 'Healthcare', 'Hope'],
    author: 'Gilbert Kevin Jimmy Kwizera',
    excerpt: 'The remarkable story of patient recovery and how continuous support transforms personal survival into community advocacy.',
    image: '/src/assets/images/He-Battled-Cancer-for-24-Years.jpg',
    imageAlt: 'Salim Bwagu, 24-year cancer survivor supported by Cancer Charity Foundation',
    paragraphs: [
      'Salim Bwagu’s recovery represents one of the foundational inspirations behind the Cancer Charity Foundation. Diagnosed in the early 2000s, Salim faced daunting economic and medical hurdles that threatened to halt his life-saving therapy.',
      'Through structured medical assistance, consistent accommodation, and direct personal intervention by Gilbert Kwizera, Salim completed full chemotherapy cycles and achieved lasting remission.',
    ],
    gallery: [
      { src: '/src/assets/images/He-Battled-Cancer-for-24-Years.jpg', caption: 'Salim Bwagu survivor story' },
      { src: '/src/assets/images/ccf-uci.jpg', caption: 'Uganda Cancer Institute Mulago' },
    ],
    isPublished: true,
  },
  {
    title: 'Empowering Pan-African Livelihoods: Zero-Fee Employment Initiative',
    slug: 'pan-african-employment-and-economic-empowerment',
    category: 'Innovation',
    readTime: '5 min read',
    tags: ['Youth', 'Employment', 'Pan-Africa', 'Livelihoods'],
    author: 'Gilbert Kevin Jimmy Kwizera',
    excerpt: 'Eliminating recruitment exploitation and connecting African job seekers directly with verified, dignified global employment opportunities.',
    image: '/src/assets/images/kwizera-humanitarian-employment-initiative.jpg',
    imageAlt: 'Pan-African Employment Initiative empowering job seekers across Africa',
    paragraphs: [
      'Economic vulnerability often leaves young African job seekers prey to predatory recruitment schemes and exorbitant agency fees. In response, Gilbert Kwizera spearheaded the Pan-African Employment Awareness Initiative.',
      'The project delivers verified employment notices directly to candidates with a strict zero-placement-fee mandate, ensuring transparent recruitment.',
    ],
    gallery: [
      { src: '/src/assets/images/kwizera-humanitarian-employment-initiative.jpg', caption: 'Employment awareness campaign' },
      { src: '/src/assets/images/havenwelfare.jpg', caption: 'Haven Welfare community center' },
    ],
    isPublished: true,
  },
  {
    title: 'Blockchain for Humanity: Decentralized Systems for Social Good',
    slug: 'blockchain-for-humanity-and-decentralized-resilience',
    category: 'Innovation',
    readTime: '6 min read',
    tags: ['Blockchain', 'Fintech', 'PIO Ecosystem', 'Digital Inclusion'],
    author: 'Gilbert Kevin Jimmy Kwizera',
    excerpt: 'How blockchain infrastructure, transparent ledger systems, and digital assets can empower unbanked communities and optimize charitable aid delivery.',
    image: '/src/assets/images/Blockchain.jpg',
    imageAlt: 'Blockchain for Humanity publication by Gilbert Kevin Jimmy Kwizera',
    paragraphs: [
      'In his published work on blockchain technology, Gilbert Kwizera explores how emerging decentralized technologies can be harnessed directly for social impact rather than speculative trading.',
      'Blockchain ledgers allow charitable foundations to demonstrate cryptographic transparency in fund allocation—giving donors verified confidence that every dollar reaches hospital beds and classrooms.',
    ],
    gallery: [
      { src: '/src/assets/images/Blockchain.jpg', caption: 'Blockchain for Humanity publication' },
      { src: '/src/assets/images/pio-ecosystem-technology.jpg', caption: 'PIO tech architecture' },
    ],
    isPublished: true,
  },
]

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gilbert')
    console.log('[Seed]: Connected to MongoDB...')

    for (const blog of initialBlogs) {
      await Blog.findOneAndUpdate({ slug: blog.slug }, blog, { upsert: true, new: true })
    }
    console.log(`[Seed]: Successfully synced ${initialBlogs.length} initial blogs in MongoDB`)

    process.exit(0)
  } catch (error) {
    console.error('[Seed Error]:', error.message)
    process.exit(1)
  }
}

seedDB()
