import { useState, useEffect, useRef } from 'react'
import {
  Heart,
  Save,
  RotateCcw,
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  User,
  Activity,
  ShieldCheck,
  Quote,
  Layers,
  Calendar,
  Building,
} from 'lucide-react'
import { livingTestimonyAPI } from '../../services/api'

const PRESET_SURVIVOR_IMAGES = [
  { label: 'Mrs. Gladys Nsereko (pa.jpeg)', path: '/src/assets/images/pa.jpeg' },
  { label: 'Mrs. Gladys Portrait 2 (pe.jpeg)', path: '/src/assets/images/pe.jpeg' },
  { label: 'Apple Jackie (jack1.jpg)', path: '/src/assets/images/jack1.jpg' },
  { label: 'CCF Compassion Ward (ccf-care.jpg)', path: '/src/assets/images/ccf-care.jpg' },
  { label: 'Uganda Cancer Institute (ccf-uci.jpg)', path: '/src/assets/images/ccf-uci.jpg' },
]

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
    age: '70 Years Old',
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
      'During this difficult period, Mr. Jimmy became involved in my case after learning about my situation through Bishop Paul Ssemogerere. He offered to support me with the cost of the medicines I needed during my chemotherapy treatment.',
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

export default function TestimoniesManager() {
  const [testimonyData, setTestimonyData] = useState(DEFAULT_LIVING_TESTIMONY)
  const [activeSurvivorIdx, setActiveSurvivorIdx] = useState(0)
  const [activeMilestoneIdx, setActiveMilestoneIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [notification, setNotification] = useState(null)
  const survivorFileRef = useRef(null)

  useEffect(() => {
    fetchTestimonies()
  }, [])

  const fetchTestimonies = async () => {
    try {
      setLoading(true)
      const testRes = await livingTestimonyAPI.getTestimonies()
      if (testRes.success && testRes.data) {
        setTestimonyData({
          eyebrow: testRes.data.eyebrow || DEFAULT_LIVING_TESTIMONY.eyebrow,
          title: testRes.data.title || DEFAULT_LIVING_TESTIMONY.title,
          subtitle: testRes.data.subtitle || DEFAULT_LIVING_TESTIMONY.subtitle,
          survivors: Array.isArray(testRes.data.survivors) && testRes.data.survivors.length > 0
            ? testRes.data.survivors
            : DEFAULT_SURVIVORS,
        })
      }
    } catch (e) {
      console.warn('Testimonies API notice, using fallback/cache:', e.message)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 4500)
  }

  const currentSurvivor = testimonyData.survivors[activeSurvivorIdx] || DEFAULT_SURVIVORS[0]
  const currentMilestones = currentSurvivor.milestones || DEFAULT_GLADYS_MILESTONES
  const currentMilestone = currentMilestones[activeMilestoneIdx] || currentMilestones[0]

  const handleSurvivorFieldChange = (field, value) => {
    setTestimonyData((prev) => {
      const updated = [...prev.survivors]
      updated[activeSurvivorIdx] = {
        ...updated[activeSurvivorIdx],
        [field]: value,
      }
      return { ...prev, survivors: updated }
    })
  }

  const handleMilestoneFieldChange = (field, value) => {
    setTestimonyData((prev) => {
      const updatedSurvivors = [...prev.survivors]
      const updatedMilestones = [...(updatedSurvivors[activeSurvivorIdx].milestones || [])]
      updatedMilestones[activeMilestoneIdx] = {
        ...updatedMilestones[activeMilestoneIdx],
        [field]: value,
      }
      updatedSurvivors[activeSurvivorIdx] = {
        ...updatedSurvivors[activeSurvivorIdx],
        milestones: updatedMilestones,
      }
      return { ...prev, survivors: updatedSurvivors }
    })
  }

  const handleAddSurvivor = () => {
    const nextIdx = testimonyData.survivors.length + 1
    const newSurvivor = {
      id: `survivor-${Date.now()}`,
      name: `Survivor ${nextIdx}`,
      badge: 'Cancer Survivor',
      age: '65 Years Old',
      year: 'Surviving Since 2015',
      hospitals: 'Nsambya & Mulago Hospital',
      image: '/src/assets/images/pa.jpeg',
      accentColor: 'rose',
      tagline: 'Living Proof of Early Action & Hope',
      quote: '“Compassionate support and clinical treatment gave me a second chance at life.”',
      detectionStatLabel: 'Self-Exam',
      detectionStatSub: 'Early medical consultation',
      chemoStatLabel: 'Full Care',
      chemoStatSub: 'Supported by Mr. Jimmy & CCF',
      introStory: 'Share this survivor’s courage, diagnosis discovery, and triumphant road to recovery...',
      highlightQuote: 'Mr. Jimmy and CCF stepped in to alleviate medical and financial burdens when it mattered most.',
      milestonesHeading: 'The Path to Recovery',
      milestonesSub: 'Key recovery chapters and clinical milestones',
      milestones: DEFAULT_GLADYS_MILESTONES,
    }

    setTestimonyData((prev) => ({
      ...prev,
      survivors: [...prev.survivors, newSurvivor],
    }))
    setActiveSurvivorIdx(testimonyData.survivors.length)
    showToast(`New survivor added! Fill in their details below.`)
  }

  const handleDeleteSurvivor = (idx) => {
    if (testimonyData.survivors.length <= 1) {
      showToast('At least one survivor testimony must remain.', 'error')
      return
    }
    if (window.confirm(`Delete testimony for "${testimonyData.survivors[idx]?.name}"?`)) {
      setTestimonyData((prev) => ({
        ...prev,
        survivors: prev.survivors.filter((_, i) => i !== idx),
      }))
      setActiveSurvivorIdx(Math.max(0, idx - 1))
      showToast('Survivor profile removed.')
    }
  }

  const handleSurvivorImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('image', file)

      const res = await livingTestimonyAPI.uploadImage(formData)
      if (res.success && res.url) {
        handleSurvivorFieldChange('image', res.url)
        showToast('Survivor photo uploaded successfully!')
      }
    } catch (err) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        handleSurvivorFieldChange('image', ev.target.result)
        showToast('Photo preview updated!')
      }
      reader.readAsDataURL(file)
    } finally {
      setUploadingImage(false)
      if (survivorFileRef.current) survivorFileRef.current.value = ''
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await livingTestimonyAPI.updateTestimonies(testimonyData)
      localStorage.setItem('gilbert_cached_testimonies', JSON.stringify(testimonyData))
      window.dispatchEvent(new CustomEvent('gilbert_testimonies_updated', { detail: testimonyData }))
      showToast('Living Testimonies (Stories of Strength & Survival) published live!')
    } catch (err) {
      localStorage.setItem('gilbert_cached_testimonies', JSON.stringify(testimonyData))
      window.dispatchEvent(new CustomEvent('gilbert_testimonies_updated', { detail: testimonyData }))
      showToast('Saved locally and updated on live view!')
    } finally {
      setSaving(false)
    }
  }

  const handleResetDefaults = () => {
    if (window.confirm('Reset all survivor testimonies to default template values?')) {
      setTestimonyData(DEFAULT_LIVING_TESTIMONY)
      setActiveSurvivorIdx(0)
      setActiveMilestoneIdx(0)
      showToast('Reset to default testimonies.')
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
          <p className="text-xs uppercase tracking-widest text-[#8a847c]">Loading Testimonies Section...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 rounded-lg border px-5 py-3 shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-4 ${
            notification.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-950/90 text-emerald-200'
              : 'border-red-500/30 bg-red-950/90 text-red-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#8d7043]">
            <Heart className="h-4 w-4 text-rose-400" />
            <span>Living Testimonies of Hope · Cancer Charity Foundation</span>
          </div>
          <h1 className="mt-1 font-serif text-3xl text-paper">Stories of Strength &amp; Survival Editor</h1>
          <p className="mt-1 text-sm text-[#8a847c]">
            Customise the survivor profiles, recovery milestones, clinical stats, and verbatim quotes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-2 rounded border border-white/15 px-3 py-2 text-xs font-medium text-[#b7b0a6] transition-colors hover:border-white/30 hover:bg-white/5 hover:text-paper"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded bg-gradient-to-r from-rose-600 to-rose-700 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-rose-900/40 transition-all hover:opacity-95 disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <Save className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">{saving ? 'Publishing...' : 'SAVE & PUBLISH LIVE'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Edit Form */}
        <div className="space-y-8 lg:col-span-7">
          {/* Card 1: Section Title & Top Tag */}
          <div className="rounded-xl border border-white/10 bg-[#161412] p-6 shadow-xl space-y-4">
            <h2 className="flex items-center gap-2 font-serif text-lg text-paper pb-2 border-b border-white/5">
              <Sparkles className="h-4 w-4 text-[#8d7043]" />
              Section Heading &amp; Subtitle
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Top Pill Badge Tag
                </label>
                <input
                  type="text"
                  value={testimonyData.eyebrow}
                  onChange={(e) => setTestimonyData({ ...testimonyData, eyebrow: e.target.value })}
                  placeholder="Living Testimonies of Hope · Cancer Charity Foundation"
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Main Section Title
                </label>
                <input
                  type="text"
                  value={testimonyData.title}
                  onChange={(e) => setTestimonyData({ ...testimonyData, title: e.target.value })}
                  placeholder="Stories of Strength & Survival"
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none font-serif"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Subtitle Description
                </label>
                <input
                  type="text"
                  value={testimonyData.subtitle}
                  onChange={(e) => setTestimonyData({ ...testimonyData, subtitle: e.target.value })}
                  placeholder="Real people whose lives were saved through early detection..."
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Survivor Profiles Editor */}
          <div className="rounded-xl border border-white/10 bg-[#161412] p-6 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-rose-400" />
                <h2 className="font-serif text-lg text-paper">
                  Survivor Profiles ({testimonyData.survivors.length} Total)
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddSurvivor}
                  className="flex items-center gap-1.5 rounded-md border border-rose-500/50 bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/35 transition-all shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Survivor</span>
                </button>

                {testimonyData.survivors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSurvivor(activeSurvivorIdx)}
                    className="flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-950/30 px-2.5 py-1.5 text-xs font-medium text-red-300 hover:bg-red-950/60 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>

            {/* Survivor Switcher Tabs */}
            <div className="flex flex-wrap gap-2 bg-[#0d0c0a] p-2 rounded-lg border border-white/5">
              {testimonyData.survivors.map((s, idx) => {
                const isActive = idx === activeSurvivorIdx
                return (
                  <button
                    key={s.id || idx}
                    type="button"
                    onClick={() => {
                      setActiveSurvivorIdx(idx)
                      setActiveMilestoneIdx(0)
                    }}
                    className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-rose-500/25 border border-rose-500/60 text-paper font-semibold shadow-md'
                        : 'text-mist/70 hover:bg-white/5 hover:text-paper border border-transparent'
                    }`}
                  >
                    <img
                      src={s.image}
                      alt={s.name}
                      className="h-6 w-6 rounded-full object-cover border border-white/20"
                    />
                    <span>{s.name}</span>
                  </button>
                )
              })}
            </div>

            {/* Profile Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    Survivor Name
                  </label>
                  <input
                    type="text"
                    value={currentSurvivor.name || ''}
                    onChange={(e) => handleSurvivorFieldChange('name', e.target.value)}
                    placeholder="e.g. Mrs. Gladys Nsereko"
                    className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none font-serif"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    Cancer Type / Badge
                  </label>
                  <input
                    type="text"
                    value={currentSurvivor.badge || ''}
                    onChange={(e) => handleSurvivorFieldChange('badge', e.target.value)}
                    placeholder="e.g. Breast Cancer Survivor"
                    className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    Age &amp; Milestone Detail
                  </label>
                  <input
                    type="text"
                    value={currentSurvivor.age || ''}
                    onChange={(e) => handleSurvivorFieldChange('age', e.target.value)}
                    placeholder="e.g. 70 Years Old"
                    className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none"
                  />
                </div>
              </div>

              {/* Survivor Top Pill / Eyebrow Badge Field */}
              <div className="rounded-xl border border-white/10 bg-black/40 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-[#fae8be] font-semibold flex items-center gap-2">
                    <Heart className="h-3.5 w-3.5 text-rose-400" />
                    <span>Top Pill Badge (Eyebrow Tag)</span>
                  </label>
                  <span className="text-[10px] text-mist/60 font-mono">Header Tag</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={currentSurvivor.eyebrow || ''}
                    onChange={(e) => handleSurvivorFieldChange('eyebrow', e.target.value)}
                    placeholder={`LIVING TESTIMONY · ${String(currentSurvivor.badge || 'BREAST CANCER SURVIVOR').toUpperCase()}`}
                    className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none font-medium tracking-wide uppercase"
                  />
                </div>
                <p className="text-[11px] text-mist/60">
                  Ye text survivor page ke top rounded pill badge par display hoga (e.g. <strong className="text-paper">LIVING TESTIMONY · {String(currentSurvivor.badge || 'BREAST CANCER SURVIVOR').toUpperCase()}</strong>).
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    Survival Year / Period
                  </label>
                  <input
                    type="text"
                    value={currentSurvivor.year || ''}
                    onChange={(e) => handleSurvivorFieldChange('year', e.target.value)}
                    placeholder="e.g. Surviving Since 2009"
                    className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    Hospitals &amp; Care Centers
                  </label>
                  <input
                    type="text"
                    value={currentSurvivor.hospitals || ''}
                    onChange={(e) => handleSurvivorFieldChange('hospitals', e.target.value)}
                    placeholder="e.g. Nsambya & Mulago"
                    className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none"
                  />
                </div>
              </div>

              {/* Accent Color / Ribbon Theme Picker */}
              <div className="rounded-lg border border-white/5 bg-[#0d0c0a] p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#fae8be]">
                    Survivor Theme &amp; Ribbon Accent Color
                  </label>
                  <span className="text-[11px] text-mist/70 capitalize">
                    Active: {currentSurvivor.accentColor || 'rose'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    { id: 'rose', label: '🌸 Rose / Pink (Breast Cancer)', border: 'border-rose-500', bg: 'bg-rose-500/20 text-rose-200' },
                    { id: 'amber', label: '🍯 Amber / Gold (Cervical / Hope)', border: 'border-amber-500', bg: 'bg-amber-500/20 text-amber-200' },
                    { id: 'emerald', label: '🌿 Emerald / Green (Liver / Lymphoma)', border: 'border-emerald-500', bg: 'bg-emerald-500/20 text-emerald-200' },
                    { id: 'blue', label: '🔷 Royal Blue (Colon / Prostate)', border: 'border-blue-500', bg: 'bg-blue-500/20 text-blue-200' },
                    { id: 'purple', label: '🔮 Lavender / Purple (All Cancers)', border: 'border-purple-500', bg: 'bg-purple-500/20 text-purple-200' },
                    { id: 'orange', label: '🍊 Warm Orange (Kidney / Leukemia)', border: 'border-orange-500', bg: 'bg-orange-500/20 text-orange-200' },
                  ].map((theme) => {
                    const isSelected = (currentSurvivor.accentColor || 'rose') === theme.id
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => handleSurvivorFieldChange('accentColor', theme.id)}
                        className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium border transition-all ${
                          isSelected
                            ? `${theme.border} ${theme.bg} shadow-md font-semibold scale-105`
                            : 'border-white/10 bg-white/5 text-mist/70 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className={`h-2.5 w-2.5 rounded-full border ${theme.border} ${theme.bg.split(' ')[0]}`} />
                        <span>{theme.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Stats Counters */}
              <div className="rounded-lg border border-white/5 bg-[#0d0c0a] p-4 space-y-3">
                <span className="block text-xs font-semibold uppercase tracking-wider text-[#fae8be]">
                  Clinical Metric Chips &amp; Highlights
                </span>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] text-[#8a847c] mb-1">
                      Detection Stat Value &amp; Subtitle
                    </label>
                    <input
                      type="text"
                      value={currentSurvivor.detectionStatLabel || ''}
                      onChange={(e) => handleSurvivorFieldChange('detectionStatLabel', e.target.value)}
                      placeholder="Self-Exam"
                      className="w-full rounded border border-white/10 bg-[#161412] px-3 py-1.5 text-xs text-paper mb-1"
                    />
                    <input
                      type="text"
                      value={currentSurvivor.detectionStatSub || ''}
                      onChange={(e) => handleSurvivorFieldChange('detectionStatSub', e.target.value)}
                      placeholder="Prompt media guidance in 2009"
                      className="w-full rounded border border-white/10 bg-[#161412] px-3 py-1 text-[11px] text-mist/70"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#8a847c] mb-1">
                      Chemotherapy / Support Stat
                    </label>
                    <input
                      type="text"
                      value={currentSurvivor.chemoStatLabel || ''}
                      onChange={(e) => handleSurvivorFieldChange('chemoStatLabel', e.target.value)}
                      placeholder="6 Cycles"
                      className="w-full rounded border border-white/10 bg-[#161412] px-3 py-1.5 text-xs text-paper mb-1"
                    />
                    <input
                      type="text"
                      value={currentSurvivor.chemoStatSub || ''}
                      onChange={(e) => handleSurvivorFieldChange('chemoStatSub', e.target.value)}
                      placeholder="Medication funded by Mr. Jimmy"
                      className="w-full rounded border border-white/10 bg-[#161412] px-3 py-1 text-[11px] text-mist/70"
                    />
                  </div>
                </div>
              </div>

              {/* Subtitle Quote */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Main Subtitle Quote
                </label>
                <input
                  type="text"
                  value={currentSurvivor.quote || ''}
                  onChange={(e) => handleSurvivorFieldChange('quote', e.target.value)}
                  placeholder="“My journey began in 2009... Mr. Jimmy was the person who came forward...”"
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none italic"
                />
              </div>

              {/* Highlight Quote Box */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Mr. Jimmy &amp; CCF Highlight Quote Card
                </label>
                <textarea
                  rows={3}
                  value={currentSurvivor.highlightQuote || ''}
                  onChange={(e) => handleSurvivorFieldChange('highlightQuote', e.target.value)}
                  placeholder="During this difficult period, Mr. Jimmy became involved in my case..."
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Full Written Narrative Story */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Full Written Testimony Narrative Story (Optional Custom Text)
                </label>
                <textarea
                  rows={4}
                  value={currentSurvivor.introStory || ''}
                  onChange={(e) => handleSurvivorFieldChange('introStory', e.target.value)}
                  placeholder="Share this survivor's story, diagnosis journey, clinical care, and recovery milestones..."
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Photo Upload */}
              <div className="pt-2 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-[#8a847c] font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-rose-400" />
                    Survivor Portrait Photo
                  </label>
                  <span className="text-[11px] text-[#8a847c]">Luxury Gold Bezel Frame</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="file"
                    ref={survivorFileRef}
                    onChange={handleSurvivorImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => survivorFileRef.current?.click()}
                    disabled={uploadingImage}
                    className="flex items-center justify-center gap-2 rounded border border-rose-500/50 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/20 transition-colors shrink-0 whitespace-nowrap"
                  >
                    <Upload className="h-4 w-4 shrink-0" />
                    <span className="whitespace-nowrap">{uploadingImage ? 'Uploading...' : 'Upload New Photo'}</span>
                  </button>

                  <div className="relative flex-1">
                    <select
                      value={
                        PRESET_SURVIVOR_IMAGES.some((p) => p.path === currentSurvivor.image)
                          ? currentSurvivor.image
                          : ''
                      }
                      onChange={(e) => {
                        if (e.target.value) handleSurvivorFieldChange('image', e.target.value)
                      }}
                      className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-xs text-paper focus:border-[#8d7043] focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Or Pick From Photo Presets --</option>
                      {PRESET_SURVIVOR_IMAGES.map((preset) => (
                        <option key={preset.path} value={preset.path}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: The Path to Recovery (Vital Milestones) */}
          <div className="rounded-xl border border-white/10 bg-[#161412] p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-rose-400" />
                <h2 className="font-serif text-lg text-paper">
                  The Path to Recovery ({currentMilestones.filter((m) => m.enabled !== false).length} of {currentMilestones.length} Visible in Slider)
                </h2>
              </div>

              {/* Master Section Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#8a847c] font-medium">
                  {currentSurvivor.showMilestones !== false ? 'Section Active' : 'Section Hidden'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleSurvivorFieldChange('showMilestones', currentSurvivor.showMilestones === false ? true : false)
                  }
                  className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    currentSurvivor.showMilestones !== false ? 'bg-emerald-500' : 'bg-white/20'
                  }`}
                  role="switch"
                  aria-checked={currentSurvivor.showMilestones !== false}
                  title={currentSurvivor.showMilestones !== false ? 'Turn Entire Slider Section OFF' : 'Turn Entire Slider Section ON'}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      currentSurvivor.showMilestones !== false ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* If Section is completely disabled */}
            {currentSurvivor.showMilestones === false && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>Ye pura <strong>"The Path to Recovery"</strong> slider section website par disabled/hidden hai. Is survivor ke page par ye section render nahi hoga.</span>
              </div>
            )}

            {/* Milestones Section Heading & Subtitle Inputs */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1 font-medium">
                  Section Main Heading
                </label>
                <input
                  type="text"
                  value={currentSurvivor.milestonesHeading || 'The Path to Recovery'}
                  onChange={(e) => handleSurvivorFieldChange('milestonesHeading', e.target.value)}
                  placeholder="The Path to Recovery"
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-1.5 text-sm text-paper focus:border-[#8d7043] focus:outline-none font-serif"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1 font-medium">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={currentSurvivor.milestonesSub || ''}
                  onChange={(e) => handleSurvivorFieldChange('milestonesSub', e.target.value)}
                  placeholder={`Explore the vital chapters of recovery`}
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-1.5 text-sm text-paper focus:border-[#8d7043] focus:outline-none"
                />
              </div>
            </div>

            {/* Milestone Tabs with Active/Enabled Indicators */}
            <div className="grid grid-cols-2 xs:grid-cols-5 gap-1.5 bg-[#0d0c0a] p-1.5 rounded-lg border border-white/5">
              {currentMilestones.map((m, mIdx) => {
                const isActive = mIdx === activeMilestoneIdx
                const isEnabled = m?.enabled !== false
                return (
                  <button
                    key={m.step || mIdx}
                    type="button"
                    onClick={() => setActiveMilestoneIdx(mIdx)}
                    className={`flex flex-col items-center py-2 px-1 rounded transition-all text-center ${
                      isActive
                        ? 'bg-rose-500/25 border border-rose-500/60 text-paper font-semibold shadow-md'
                        : isEnabled
                        ? 'text-mist/80 hover:bg-white/5 hover:text-paper border border-transparent'
                        : 'text-mist/35 hover:bg-white/5 hover:text-mist/60 border border-transparent opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className={`text-[10px] font-mono ${isEnabled ? 'text-rose-400' : 'text-mist/40 line-through'}`}>{m.step}</span>
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${isEnabled ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'bg-rose-500/50'}`}
                        title={isEnabled ? 'ON (Visible in Slider)' : 'OFF (Hidden from Slider)'}
                      />
                    </div>
                    <span className="text-[10px] font-medium truncate max-w-full">{m.shortTitle || `Milestone ${m.step}`}</span>
                  </button>
                )
              })}
            </div>

            {/* Milestone Slider Toggle ON/OFF Switch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 p-4 transition-all hover:border-white/20">
              <div className="flex items-start sm:items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    currentMilestone?.enabled !== false
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {currentMilestone?.enabled !== false ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-paper">
                      Slider Visibility (Milestone {currentMilestone?.step})
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        currentMilestone?.enabled !== false
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {currentMilestone?.enabled !== false ? '● ON (Visible)' : '○ OFF (Hidden)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-mist/70 mt-0.5">
                    {currentMilestone?.enabled !== false
                      ? 'Ye milestone live website par recovery slider me display hoga.'
                      : 'Ye milestone live website ke recovery slider se hide rahega (Off).'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleMilestoneFieldChange('enabled', currentMilestone?.enabled === false ? true : false)
                }
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  currentMilestone?.enabled !== false ? 'bg-emerald-500' : 'bg-white/20'
                }`}
                role="switch"
                aria-checked={currentMilestone?.enabled !== false}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    currentMilestone?.enabled !== false ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Active Milestone Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    Milestone Step
                  </label>
                  <input
                    type="text"
                    value={currentMilestone?.step || ''}
                    onChange={(e) => handleMilestoneFieldChange('step', e.target.value)}
                    placeholder="01"
                    className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    Year / Stage Tag
                  </label>
                  <input
                    type="text"
                    value={currentMilestone?.year || ''}
                    onChange={(e) => handleMilestoneFieldChange('year', e.target.value)}
                    placeholder="e.g. 2009 or Diagnosis"
                    className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    Short Tab Title
                  </label>
                  <input
                    type="text"
                    value={currentMilestone?.shortTitle || ''}
                    onChange={(e) => handleMilestoneFieldChange('shortTitle', e.target.value)}
                    placeholder="Self-Check Discovery"
                    className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Full Milestone Heading
                </label>
                <input
                  type="text"
                  value={currentMilestone?.title || ''}
                  onChange={(e) => handleMilestoneFieldChange('title', e.target.value)}
                  placeholder="Radio Broadcasts & Prompt Self-Examination"
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper font-serif"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Milestone Subtitle
                </label>
                <input
                  type="text"
                  value={currentMilestone?.subtitle || ''}
                  onChange={(e) => handleMilestoneFieldChange('subtitle', e.target.value)}
                  placeholder="Heeding awareness advice leading to immediate hospital consultation"
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Detailed Narrative Description
                </label>
                <textarea
                  rows={3}
                  value={currentMilestone?.description || ''}
                  onChange={(e) => handleMilestoneFieldChange('description', e.target.value)}
                  placeholder="In 2009, having heard radio health programs advising women..."
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Milestone Quote / Highlight Callout
                </label>
                <textarea
                  rows={2}
                  value={currentMilestone?.highlight || ''}
                  onChange={(e) => handleMilestoneFieldChange('highlight', e.target.value)}
                  placeholder="“I followed that advice and examined my right breast...”"
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper italic"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Card Simulation Preview */}
        <div className="space-y-6 lg:col-span-5">
          <div className="sticky top-6 rounded-xl border border-white/10 bg-[#161412] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400">
                <Eye className="h-4 w-4" />
                Live Survivor Card Preview
              </span>
              <span className="text-xs text-[#8a847c]">{currentSurvivor.badge}</span>
            </div>

            {/* Survivor Card Simulation with dynamic theme accent */}
            <div className={`rounded-xl border bg-[#0D0D0C] p-5 shadow-2xl relative overflow-hidden space-y-4 transition-all ${
              currentSurvivor.accentColor === 'amber'
                ? 'border-amber-500/50 shadow-amber-500/10'
                : currentSurvivor.accentColor === 'emerald'
                ? 'border-emerald-500/50 shadow-emerald-500/10'
                : currentSurvivor.accentColor === 'blue'
                ? 'border-blue-500/50 shadow-blue-500/10'
                : currentSurvivor.accentColor === 'purple'
                ? 'border-purple-500/50 shadow-purple-500/10'
                : currentSurvivor.accentColor === 'orange'
                ? 'border-orange-500/50 shadow-orange-500/10'
                : 'border-rose-500/50 shadow-rose-500/10'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest ${
                  currentSurvivor.accentColor === 'amber'
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                    : currentSurvivor.accentColor === 'emerald'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : currentSurvivor.accentColor === 'blue'
                    ? 'border-blue-500/30 bg-blue-500/10 text-blue-300'
                    : currentSurvivor.accentColor === 'purple'
                    ? 'border-purple-500/30 bg-purple-500/10 text-purple-300'
                    : currentSurvivor.accentColor === 'orange'
                    ? 'border-orange-500/30 bg-orange-500/10 text-orange-300'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                }`}>
                  <Heart className="h-3 w-3" />
                  {currentSurvivor.eyebrow || `Living Testimony · ${currentSurvivor.badge || 'Cancer Survivor'}`}
                </span>
                <span className="text-[11px] text-mist/60 font-mono">{currentSurvivor.year}</span>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-black shadow-md">
                  <img
                    src={currentSurvivor.image}
                    alt={currentSurvivor.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-serif text-xl text-paper leading-snug">{currentSurvivor.name}</h3>
                  <p className="text-[11px] text-mist/90">{currentSurvivor.age}</p>
                  <p className="text-[10px] text-mist/70">{currentSurvivor.hospitals}</p>
                </div>
              </div>

              <p className="text-xs text-mist/80 italic leading-relaxed border-l-2 border-white/30 pl-3">
                {currentSurvivor.quote}
              </p>

              {/* Mini Milestones Preview */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <span className="block text-[11px] font-semibold text-[#fae8be] uppercase tracking-wider">
                  Milestone Preview: {currentMilestone?.shortTitle}
                </span>
                <div className="rounded-lg bg-black/60 p-3 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-gold font-mono">
                    <span>Step {currentMilestone?.step}</span>
                    <span>{currentMilestone?.year}</span>
                  </div>
                  <h4 className="font-serif text-sm text-paper">{currentMilestone?.title}</h4>
                  <p className="text-[11px] text-mist/75 line-clamp-2">{currentMilestone?.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
