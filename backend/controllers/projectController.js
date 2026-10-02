import ProjectSection from '../models/Project.js'

const defaultProjectsData = {
  eyebrow: 'Selected work',
  title: 'Projects That Impact Lives',
  leadText:
    'Documented initiatives spanning education in Fort Portal, cancer care advocacy, pan-African employment awareness, and global cultural dialogue.',
  projects: [
    {
      slug: 'supporting-education-empowering-futures',
      title: 'Supporting Education, Empowering Futures',
      category: 'Community development',
      date: '19 March 2026',
      image: '/src/assets/images/Supporting-Education-Empowering-Futures.jpg',
      heroImage: '',
      imageAlt: 'Primary pupils holding new exercise books outside their school',
      imageFit: 'cover',
      summary:
        'Scholastic materials for Divine Mercy Nursery & Primary School in Kiko, Fort Portal: books, pens, pencils, rulers, rubbers, and learning charts.',
      paragraphs: [
        'On 19 March 2026, Divine Mercy Nursery & Primary School in Kiko, along Kamwenge Road in Fort Portal, received a donation of scholastic materials from Gilbert Kevin Jimmy Kwizera. The gift was part of his ongoing support for education and community development.',
        'The materials were everyday tools that change a classroom: exercise books, pens, pencils, rulers, rubbers, and learning charts. He was not present in person. The pupils’ response was. School director Rev. Fr. Christopher Mukidi said, “I was also surprised by how happy the children were. I believe the parents are just as glad.”',
        'The published account of the gift is straightforward. Access to a decent education should not stop because basic tools are missing. The support is practical, and it goes directly to learners and the community around them.',
      ],
      tags: ['Education', 'Empowering', 'Supporting'],
      gallery: [
        {
          src: '/src/assets/images/Gilbert-Kwizera-Charity-Support-for-Uganda-Students-Drive.jpg',
          alt: 'Staff and pupils with donated scholastic materials inside a classroom',
          position: 'center top',
          className: 'aspect-[4/3]',
          parallax: false,
          fit: 'cover',
        },
      ],
    },
    {
      slug: 'he-battled-cancer-for-24-years',
      title: 'He Battled Cancer for 24 Years',
      category: 'Cancer care',
      date: '2006–2007',
      image: '/src/assets/images/ccf-cancer-care-compassion.jpg',
      heroImage: '/src/assets/images/ccf-uci.jpg',
      imageAlt: 'Gilbert Kevin Jimmy Kwizera Providing Compassionate Cancer Care Support in Uganda',
      imageFit: 'cover',
      summary:
        'Salim Bwagu lived with Hodgkin’s lymphoma from childhood. In 2006, support from Gilbert’s charity helped him complete treatment. He was cleared in 2007.',
      paragraphs: [
        'Salim Bwagu was four when his illness began. In 1987, swellings appeared on his neck and wrist. His father, Mzee Sengoba Bwagu, first thought they were boils. A private clinic could not explain them. Mulago Hospital could: a biopsy identified Hodgkin’s lymphoma.',
        'Chemotherapy started in 1988. The treatment was physically punishing, and it worked quickly enough that the family stopped it four months early. The cancer returned in 1996. For years after that, Salim moved between relapse and partial recovery. His family, peasant farmers from Iganga, struggled to raise the Shs 500,000 needed each month for medication.',
        'In 2006, nearly twenty years after the first diagnosis, Salim met Gilbert Kevin Jimmy Kwizera. Through Gilbert’s charity, he received the financial support required to finish the full dosage. In 2007 he was cleared by the National Cancer Institute.',
        'Salim later founded the Chronic Disease Support Organisation to help other patients with the two barriers he knew well: money, and a lack of clear information. The story, as published, leaves three lessons: detect illness early, finish the course of treatment, and remember that community matters.',
      ],
      tags: ['Cancer', 'Care', 'CCF Foundation'],
      gallery: [
        {
          src: '/src/assets/images/He-Battled-Cancer-for-24-Years.jpg',
          alt: 'Portrait of Salim Bwagu, published with his cancer-care story',
          position: 'center top',
          className: 'aspect-[4/3]',
          parallax: false,
          fit: 'cover',
        },
        {
          src: '/src/assets/images/ccf-uci.jpg',
          alt: 'Uganda Cancer Institute, where specialised cancer treatment is centred in Kampala',
          position: 'center top',
          className: 'aspect-[4/3]',
          parallax: false,
          fit: 'cover',
        },
      ],
    },
    {
      slug: 'living-testimony-gladys-nsereko',
      title: 'Living Testimony: Mrs. Gladys Nsereko',
      category: 'Cancer care & Hope',
      date: '2009–Present',
      image: '/src/assets/images/pa.jpeg',
      heroImage: '',
      imageAlt: 'Mrs. Gladys Nsereko, 70-year-old breast cancer survivor and living testimony of hope',
      imageFit: 'cover',
      summary:
        'Diagnosed with Stage 2 breast cancer in 2009, Mrs. Gladys Nsereko received critical medication support for 6 cycles of chemotherapy from Mr. Jimmy and CCF, achieving full remission and celebrating 70 years of life.',
      paragraphs: [
        'My name is Gladys Nsereko and I turned 70 years old on September 5th. My journey with breast cancer began in 2009, when I discovered something unusual in my right breast.',
        'At the time, I had heard health programs on the radio advising women to regularly check their breasts for any unusual lumps or changes. One day, while bathing, I followed that advice and examined my right breast. When I pressed the nipple, I noticed an unusual discharge mixed with blood. I was frightened even though I did not feel any lump or pain.',
        'I immediately went to Nsambya Hospital and explained what had happened to the doctor. After examining me, the doctors recommended further tests, including a biopsy. The results confirmed that I had breast cancer, which was at Stage 2.',
        'The doctors advised that the affected breast needed to be removed because they were concerned that the cancer could spread. I underwent surgery and after recovering, I was told that I needed chemotherapy.',
        'At that time, chemotherapy was not available at Nsambya Hospital, so I was referred to Mulago Hospital. I underwent six cycles of chemotherapy, receiving one cycle each month. The treatment was difficult and there were times when I became very weak and could not move around on my own.',
        'After completing chemotherapy, I developed severe back pain and was advised to undergo radiotherapy. I subsequently received six sessions of radiotherapy.',
        'During this difficult period, Mr. Jimmy became involved in my care after learning about my situation through Bishop Paul Ssemogerere. He offered to support me with the cost of the medicines I needed during my chemotherapy treatment. Because I was too weak to travel myself, my daughter would go to his office to collect the money needed to purchase my medication.',
        'For all six cycles of chemotherapy, Mr. Jimmy continued supporting me with the cost of my medicines. His assistance made a significant difference to me and my family at a time when the financial burden of cancer treatment was overwhelming.',
        'After completing my treatment, I continued going for regular medical check-ups. In around 2013, doctors became concerned that there might be a recurrence affecting my bones and placed me on additional medication and chemotherapy. I was also advised to undergo a PET scan, which was not available in Uganda at the time.',
        'With the help of my son, I was able to get an appointment at Aga Khan Hospital in Nairobi, where I underwent the scan. Later, I also had another PET scan abroad. The results indicated that I did not have cancer at that time.',
        'Today, I continue to monitor my health and attend medical check-ups. I still experience some back pain, and I know that continuing to take care of my health and following up with doctors is important.',
        'Looking back, I am grateful that I noticed the unusual change in my breast and sought medical attention immediately. I am also grateful for the support I received during one of the most difficult periods of my life.',
        'I may not remember whether Mr. Jimmy was supporting me personally or through the Cancer Charity Foundation at that time, but what I remember clearly is that he was the person who came forward to help me when I needed support the most. His assistance with my medication helped me continue with my treatment when the cost of cancer care was a major challenge for my family.',
        'My story is a reminder of the importance of paying attention to changes in your body, seeking medical attention early, and ensuring that people facing cancer are not left alone because they cannot afford the treatment and medicines they need.',
      ],
      tags: ['Living Testimony', 'Breast Cancer', 'CCF Foundation', 'Survivor Story'],
      gallery: [
        {
          src: '/src/assets/images/pa.jpeg',
          alt: 'Mrs. Gladys Nsereko portrait, smiling with warmth and gratitude',
          position: 'center top',
          className: 'aspect-[3/4]',
          parallax: false,
          fit: 'cover',
        },
        {
          src: '/src/assets/images/pe.jpeg',
          alt: 'Mrs. Gladys Nsereko standing full view, living testimony of recovery',
          position: 'center top',
          className: 'aspect-[3/4]',
          parallax: false,
          fit: 'cover',
        },
      ],
    },
    {
      slug: 'living-testimony-apple-jackie',
      title: 'Living Testimony: Apple Jackie',
      category: 'Cancer care & Hope',
      date: '2010–Present',
      image: '/src/assets/images/jack1.jpg',
      heroImage: '',
      imageAlt: 'Apple Jackie, 58-year-old cervical cancer survivor and living testimony of hope',
      imageFit: 'cover',
      summary:
        'Diagnosed with cervical cancer in 2010, Apple Jackie found a lifeline through Mr. Jimmy and the Cancer Charity Foundation (CCF), receiving prompt treatment at Nsambya Hospital and achieving full recovery.',
      paragraphs: [
        'My name is Apple Jackie. I am 58 years old, married to Godfrey Ikoro, and blessed with four children.',
        'In 2010, I began experiencing unusual bleeding. At first, I did not take it seriously because I thought it might be related to my menstrual cycle. However, the bleeding continued, including at times when I was not on my period.',
        'Concerned about my health, I went to the hospital and explained my symptoms to the doctors. They advised me to undergo tests for cancer and referred me to a specialist. Samples were taken for testing, and after two days, I returned to receive my results. I was told that the tests indicated cervical cancer.',
        'I shared the news with my family, and they encouraged me to seek further confirmation. I underwent another test in Kampala, which produced the same results. I later went to Mulago Hospital for further testing, and once again, the results confirmed the diagnosis.',
        'At that point, my family and I were deeply concerned about what the future would hold. Fortunately, someone I knew through work was connected to Mr. Jimmy, and my situation was brought to his attention. Through his Cancer Charity Foundation (CCF), I was connected to the support and medical care I needed.',
        'The foundation helped me with the necessary medical tests and treatment at Nsambya Hospital. I received treatment for seven days, and because the cancer was detected at an early stage, I was able to recover.',
        'Today, I stand as a living testimony of hope, early treatment, and compassionate support. I am deeply grateful to Mr. Jimmy and the Cancer Charity Foundation for standing with me during one of the most difficult moments of my life. Their support gave me access to the medical care I needed when I was facing a frightening diagnosis. I thank the Cancer Charity Foundation sincerely for helping me through that difficult journey and giving me the opportunity to continue living and caring for my family.',
      ],
      tags: ['Living Testimony', 'Cancer Care', 'CCF Foundation', 'Survivor Story'],
      gallery: [
        {
          src: '/src/assets/images/jack1.jpg',
          alt: 'Apple Jackie portrait, smiling with warmth and gratitude',
          position: 'center top',
          className: 'aspect-[3/4]',
          parallax: false,
          fit: 'cover',
        },
        {
          src: '/src/assets/images/jack2.jpg',
          alt: 'Apple Jackie standing full view, living testimony of cancer recovery',
          position: 'center top',
          className: 'aspect-[3/4]',
          parallax: false,
          fit: 'cover',
        },
      ],
    },
    {
      slug: 'humanitarian-employment-initiative',
      title: 'Supporting Africa Through Employment Awareness',
      category: 'Humanitarian initiative',
      date: '2026',
      image: '/src/assets/images/kwizera-humanitarian-employment-initiative.jpg',
      heroImage: '',
      imageFit: 'contain',
      imageAlt: 'Gilbert Kevin Jimmy Kwizera Humanitarian Initiative Supporting Africa Through Employment Awareness',
      summary:
        'A pan-African initiative providing verified employment information, free job updates, and community welfare guidance without charging recruitment fees.',
      paragraphs: [
        'Employment awareness and honest guidance are fundamental to poverty alleviation across Africa. Unscrupulous middlemen and exploitative recruitment agencies frequently target vulnerable job seekers.',
        'Under the Gilbert Kevin Jimmy Kwizera Humanitarian Initiative, a clear commitment was established: provide free, verified employment information directly to communities across Uganda and Africa, with a strict zero-fee policy.',
        'The initiative pairs job alerts with community health awareness and vocational literacy, empowering young men and women to find sustainable careers with confidence and dignity.',
      ],
      tags: ['Employment', 'Africa', 'Humanitarian', 'Youth'],
      gallery: [
        {
          src: '/src/assets/images/gilbert-kwizera-hotel-entrance.jpg',
          alt: 'Gilbert Kevin Jimmy Kwizera championing international consultancy and employment advocacy',
          position: 'center top',
          className: 'aspect-[4/3]',
          parallax: false,
          fit: 'cover',
        },
      ],
    },
    {
      slug: 'global-cultural-dialogue-and-philanthropy',
      title: 'Global Cultural Dialogue & Philanthropic Outreach',
      category: 'Global outreach',
      date: '2026',
      image: '/src/assets/images/gilbert-kwizera-sanjay-dutt.jpg',
      heroImage: '',
      imageAlt: 'Gilbert Kevin Jimmy Kwizera with cultural icon Sanjay Dutt',
      imageFit: 'cover',
      summary:
        'Connecting global cultural leaders, healthcare advocates, and humanitarian initiatives across Africa, the UAE, and India.',
      paragraphs: [
        'Philanthropic impact accelerates when leaders across industries and continents unite for shared human values. Gilbert Kevin Jimmy Kwizera regularly meets with international icons and influencers to build dialogue on cancer care, recovery, and social responsibility.',
        'In discussions with renowned cultural figures like Sanjay Dutt, focus is brought to resilience, destigmatizing recovery, and supporting vulnerable patients battling life-threatening illnesses.',
        'These dialogues bridge the UAE, Africa, and global centres of culture, demonstrating how collaborative goodwill can mobilize resources and dignity-centred care worldwide.',
      ],
      tags: ['Global Outreach', 'Dialogue', 'Culture', 'Cancer Advocacy'],
      gallery: [
        {
          src: '/src/assets/images/gilbert-kwizera-dubai-marina-yacht.jpg',
          alt: 'Gilbert Kevin Jimmy Kwizera in Dubai Marina during international consultations',
          position: 'center top',
          className: 'aspect-[4/3]',
          parallax: false,
          fit: 'cover',
        },
      ],
    },
  ],
}

// @desc    Get Projects section data
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    let section = await ProjectSection.findOne()

    if (!section) {
      section = await ProjectSection.create(defaultProjectsData)
    }

    res.status(200).json({
      success: true,
      data: section,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects data',
      error: error.message,
    })
  }
}

// @desc    Update Projects section data
// @route   PUT /api/projects
// @access  Private/Admin
export const updateProjects = async (req, res) => {
  try {
    const { eyebrow, title, leadText, projects } = req.body

    let section = await ProjectSection.findOne()

    if (!section) {
      section = new ProjectSection({
        eyebrow,
        title,
        leadText,
        projects,
      })
    } else {
      if (eyebrow !== undefined) section.eyebrow = eyebrow
      if (title !== undefined) section.title = title
      if (leadText !== undefined) section.leadText = leadText
      if (projects !== undefined) section.projects = projects
    }

    const updated = await section.save()

    res.status(200).json({
      success: true,
      message: 'Projects section updated successfully',
      data: updated,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update projects section',
      error: error.message,
    })
  }
}

// @desc    Upload Projects image
// @route   POST /api/projects/upload
// @access  Private/Admin
export const uploadProjectImage = async (req, res) => {
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
