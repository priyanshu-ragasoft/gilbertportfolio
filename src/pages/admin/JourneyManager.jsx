import { useState, useEffect, useRef } from 'react'
import {
  Compass,
  Save,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Link as LinkIcon,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ArrowUpRight,
  ExternalLink,
  Plus,
  Trash2,
  Globe2,
  Navigation,
} from 'lucide-react'
import { journeyAPI } from '../../services/api'
import { WORLD_LOCATIONS } from '../../data/worldLocations'

const PRESET_IMAGES = [
  { label: 'Lounge Armchair (Uganda 1971)', path: '/src/assets/images/gilbert-kwizera-lounge-armchair.jpg' },
  { label: 'Marble Lobby (India Studies 1993-99)', path: '/src/assets/images/gilbert-kwizera-marble-lobby.jpg' },
  { label: 'Office Standing (Uganda Enterprise 2000)', path: '/src/assets/images/gilbert-kwizera-office-standing.jpg' },
  { label: 'Executive Gold (East Africa 2010)', path: '/src/assets/images/gilbert-kwizera-executive.jpg' },
  { label: 'CCF Cancer Care Compassion (2014)', path: '/src/assets/images/ccf-cancer-care-compassion.jpg' },
  { label: 'Dubai Walking (Base 2016+)', path: '/src/assets/images/gilbert-kwizera-dubai-walking.jpg' },
  { label: 'Dubai Marina Yacht (18 Nations 2022-26)', path: '/src/assets/images/gilbert-kwizera-dubai-marina-yacht.jpg' },
  { label: 'Sanjay Dutt Cultural Dialogue', path: '/src/assets/images/gilbert-kwizera-sanjay-dutt.jpg' },
  { label: 'Uganda Cancer Institute', path: '/src/assets/images/ccf-uci.jpg' },
  { label: 'Haven Welfare Outreach', path: '/src/assets/images/havenwelfare.jpg' },
]

const DEFAULT_CHAPTERS = [
  {
    id: 'born-uganda',
    index: '01',
    year: '1971',
    countryKey: 'uganda',
    shortLocation: 'Uganda',
    location: 'Kampala, Uganda',
    lon: 32.5825,
    lat: 2.2,
    pinNote: 'Born 1971',
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
    countryKey: 'india',
    shortLocation: 'India',
    location: 'Mahaveera & Mangalore, India',
    lon: 74.856,
    lat: 14.5,
    pinNote: 'Studies (1993-2012)',
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
    countryKey: 'uganda',
    shortLocation: 'Uganda',
    location: 'Kampala, Uganda',
    lon: 32.5825,
    lat: 2.2,
    pinNote: 'Enterprise 2000',
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
    countryKey: 'east-africa',
    shortLocation: 'Gold Mine',
    location: 'Uganda & East Africa',
    lon: 43.5,
    lat: 4.5,
    pinNote: 'Gold 2010',
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
    countryKey: 'pan-africa',
    shortLocation: 'Charity',
    location: 'Pan-African Outreach',
    lon: 25.0,
    lat: -28.0,
    pinNote: 'Charity 2014',
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
    countryKey: 'dubai',
    shortLocation: 'Dubai',
    location: 'Dubai, UAE',
    lon: 55.2708,
    lat: 25.2048,
    pinNote: 'Base 2016+',
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
    countryKey: 'dubai',
    shortLocation: '18 Nations',
    location: 'Global (18 Countries)',
    lon: 55.2708,
    lat: 25.2048,
    pinNote: 'Global Reach',
    title: 'Global Blockchain & 18 Nations',
    description:
      'Traveled across 18 countries (Singapore, France, Italy, Turkey, South Africa, Rwanda, Congo, etc.) while building next-generation blockchain protocols, PIO Ecosystem, and ISBET Brainery.',
    image: '/src/assets/images/gilbert-kwizera-dubai-marina-yacht.jpg',
    imageAlt: 'Blockchain projects, PIO Ecosystem, and travels across 18 countries',
    href: '/projects',
    cta: 'Explore PIO & Blockchain',
  },
]

const DEFAULT_JOURNEY_DATA = {
  eyebrow: 'Journey',
  title: 'A Journey',
  subtitle: 'Across Borders',
  introText:
    'Kampala, the years of study, a life in the Emirates, and the work that kept returning to Uganda.',
  scrollHintText: 'Scroll to travel',
  chapters: DEFAULT_CHAPTERS,
}

export default function JourneyManager() {
  const [journeyData, setJourneyData] = useState(DEFAULT_JOURNEY_DATA)
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [notification, setNotification] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchJourneyData()
  }, [])

  const fetchJourneyData = async () => {
    try {
      setLoading(true)
      const res = await journeyAPI.getJourney()
      if (res.success && res.data) {
        let fetchedChapters = Array.isArray(res.data.chapters) && res.data.chapters.length > 0
          ? res.data.chapters.map((ch, idx) => ({
              ...DEFAULT_CHAPTERS[idx % DEFAULT_CHAPTERS.length],
              ...ch,
              index: String(idx + 1).padStart(2, '0'),
              id: ch.id || `chapter-${idx + 1}`,
            }))
          : DEFAULT_CHAPTERS

        setJourneyData({
          eyebrow: res.data.eyebrow || DEFAULT_JOURNEY_DATA.eyebrow,
          title: res.data.title || DEFAULT_JOURNEY_DATA.title,
          subtitle: res.data.subtitle || DEFAULT_JOURNEY_DATA.subtitle,
          introText: res.data.introText || DEFAULT_JOURNEY_DATA.introText,
          scrollHintText: res.data.scrollHintText || DEFAULT_JOURNEY_DATA.scrollHintText,
          chapters: fetchedChapters,
        })
      }
    } catch (err) {
      console.warn('Backend load notice (using fallback defaults):', err.message)
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => {
      setNotification(null)
    }, 4500)
  }

  const handleHeaderChange = (field, value) => {
    setJourneyData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleActiveChapterChange = (field, value) => {
    setJourneyData((prev) => {
      const updatedChapters = [...prev.chapters]
      updatedChapters[activeChapterIndex] = {
        ...updatedChapters[activeChapterIndex],
        [field]: value,
      }
      return {
        ...prev,
        chapters: updatedChapters,
      }
    })
  }

  // Add new milestone chapter
  const handleAddMilestone = () => {
    setJourneyData((prev) => {
      const nextNum = prev.chapters.length + 1
      const nextIndex = String(nextNum).padStart(2, '0')
      const newChapter = {
        id: `milestone-${Date.now()}`,
        index: nextIndex,
        year: '2026+',
        countryKey: 'dubai',
        shortLocation: 'New Milestone',
        location: 'New Destination',
        lon: 55.2708,
        lat: 25.2048,
        pinNote: 'New Chapter',
        title: `Milestone ${nextIndex} Title`,
        description: 'Describe the milestone achievement, key events, partnerships, and story for this chapter.',
        image: '/src/assets/images/gilbert-kwizera-dubai-marina-yacht.jpg',
        imageAlt: `Gilbert Kwizera milestone ${nextIndex}`,
        href: '/about',
        cta: 'Read more',
      }
      return {
        ...prev,
        chapters: [...prev.chapters, newChapter],
      }
    })
    setActiveChapterIndex(journeyData.chapters.length)
    showNotification('success', `Milestone ${String(journeyData.chapters.length + 1).padStart(2, '0')} added!`)
  }

  // Delete active milestone chapter
  const handleDeleteMilestone = (indexToDelete) => {
    if (journeyData.chapters.length <= 1) {
      showNotification('error', 'At least one milestone chapter must be retained.')
      return
    }

    if (window.confirm(`Are you sure you want to delete Milestone ${journeyData.chapters[indexToDelete]?.index || indexToDelete + 1}?`)) {
      setJourneyData((prev) => {
        const filtered = prev.chapters.filter((_, idx) => idx !== indexToDelete)
        const reIndexed = filtered.map((ch, idx) => ({
          ...ch,
          index: String(idx + 1).padStart(2, '0'),
        }))
        return {
          ...prev,
          chapters: reIndexed,
        }
      })
      setActiveChapterIndex(Math.max(0, indexToDelete - 1))
      showNotification('success', 'Milestone deleted and remaining chapters re-indexed.')
    }
  }

  // Country selector change
  const handleCountryPresetChange = (countryId) => {
    if (countryId === 'custom') {
      handleActiveChapterChange('countryKey', 'custom')
      return
    }
    const preset = WORLD_LOCATIONS.find((w) => w.id === countryId)
    if (preset) {
      setJourneyData((prev) => {
        const updatedChapters = [...prev.chapters]
        updatedChapters[activeChapterIndex] = {
          ...updatedChapters[activeChapterIndex],
          countryKey: preset.id,
          shortLocation: preset.label.split(' ')[0],
          location: preset.label,
          lon: preset.lon,
          lat: preset.lat,
          pinNote: preset.note || updatedChapters[activeChapterIndex]?.pinNote || '',
        }
        return {
          ...prev,
          chapters: updatedChapters,
        }
      })
      showNotification('success', `Location set to ${preset.label} [${preset.lon}, ${preset.lat}]`)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('image', file)

      const res = await journeyAPI.uploadImage(formData)
      if (res.success && res.url) {
        handleActiveChapterChange('image', res.url)
        showNotification('success', 'Milestone image uploaded successfully!')
      }
    } catch (err) {
      const reader = new FileReader()
      reader.onload = (loadEvt) => {
        handleActiveChapterChange('image', loadEvt.target.result)
        showNotification('success', 'Image preview updated!')
      }
      reader.readAsDataURL(file)
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await journeyAPI.updateJourney(journeyData)
      if (res.success) {
        localStorage.setItem('gilbert_cached_journey', JSON.stringify(journeyData))
        window.dispatchEvent(new CustomEvent('gilbert_journey_updated', { detail: journeyData }))
        showNotification('success', 'Journey Across Borders section published live!')
      }
    } catch (err) {
      localStorage.setItem('gilbert_cached_journey', JSON.stringify(journeyData))
      window.dispatchEvent(new CustomEvent('gilbert_journey_updated', { detail: journeyData }))
      showNotification('success', 'Saved locally and updated on live view!')
    } finally {
      setSaving(false)
    }
  }

  const handleResetToDefault = () => {
    if (window.confirm('Reset all Journey section content and milestones to default values?')) {
      setJourneyData(DEFAULT_JOURNEY_DATA)
      setActiveChapterIndex(0)
      showNotification('success', 'Reset to default template values.')
    }
  }

  const activeChapter = journeyData.chapters[activeChapterIndex] || DEFAULT_CHAPTERS[0]

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#8d7043] border-t-transparent" />
          <p className="text-xs uppercase tracking-widest text-[#8a847c]">Loading Journey Section...</p>
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
            <Compass className="h-4 w-4" />
            <span>Interactive Map &amp; Timeline Section</span>
          </div>
          <h1 className="mt-1 font-serif text-3xl text-paper">A Journey Across Borders Editor</h1>
          <p className="mt-1 text-sm text-[#8a847c]">
            Customise the interactive World Map milestones, chapter photos, narrative descriptions, and GPS locations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="flex items-center gap-2 rounded border border-white/15 px-3 py-2 text-xs font-medium text-[#b7b0a6] transition-colors hover:border-white/30 hover:bg-white/5 hover:text-paper"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded bg-gradient-to-r from-[#8d7043] to-[#a68652] px-5 py-2.5 text-xs font-medium text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <Save className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">
              {saving ? 'Publishing...' : 'SAVE & PUBLISH LIVE'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Form Layout: 2 Columns */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left / Main Column: Section Header & Chapter Editor */}
        <div className="space-y-8 lg:col-span-7">
          {/* Card 1: Section Header & Introduction */}
          <div className="rounded-xl border border-white/10 bg-[#161412] p-6 shadow-xl">
            <h2 className="flex items-center gap-2 font-serif text-lg text-paper mb-4 pb-2 border-b border-white/5">
              <Sparkles className="h-4 w-4 text-[#8d7043]" />
              Section Heading &amp; Intro
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    Eyebrow Tag
                  </label>
                  <input
                    type="text"
                    value={journeyData.eyebrow}
                    onChange={(e) => handleHeaderChange('eyebrow', e.target.value)}
                    placeholder="e.g. Journey"
                    className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    Main Title
                  </label>
                  <input
                    type="text"
                    value={journeyData.title}
                    onChange={(e) => handleHeaderChange('title', e.target.value)}
                    placeholder="e.g. A Journey"
                    className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    Italic Subtitle
                  </label>
                  <input
                    type="text"
                    value={journeyData.subtitle}
                    onChange={(e) => handleHeaderChange('subtitle', e.target.value)}
                    placeholder="e.g. Across Borders"
                    className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Introduction Paragraph
                </label>
                <textarea
                  rows={2}
                  value={journeyData.introText}
                  onChange={(e) => handleHeaderChange('introText', e.target.value)}
                  placeholder="Intro description below the title..."
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Chapter Selector & Editor */}
          <div className="rounded-xl border border-white/10 bg-[#161412] p-6 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#8d7043]" />
                <h2 className="font-serif text-lg text-paper">
                  Milestone Chapters ({journeyData.chapters.length} Total)
                </h2>
              </div>

              {/* Add & Delete Milestone Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="flex items-center gap-1.5 rounded-md border border-[#8d7043]/50 bg-[#8d7043]/20 px-3 py-1.5 text-xs font-semibold text-[#fae8be] hover:bg-[#8d7043]/35 transition-all shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5 text-[#C9A15A]" />
                  <span>Add Milestone</span>
                </button>

                {journeyData.chapters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteMilestone(activeChapterIndex)}
                    className="flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-950/30 px-2.5 py-1.5 text-xs font-medium text-red-300 hover:bg-red-950/60 hover:text-red-200 transition-all"
                    title="Delete current milestone"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>

            {/* Chapter Tabs Horizontal Nav */}
            <div className="flex flex-wrap gap-1.5 bg-[#0d0c0a] p-2 rounded-lg border border-white/5 max-h-36 overflow-y-auto">
              {journeyData.chapters.map((ch, idx) => {
                const isActive = idx === activeChapterIndex
                return (
                  <button
                    key={ch.id || idx}
                    type="button"
                    onClick={() => setActiveChapterIndex(idx)}
                    className={`flex flex-col items-center py-2 px-2.5 min-w-[4.5rem] rounded transition-all text-center ${
                      isActive
                        ? 'bg-[#8d7043]/25 border border-[#8d7043]/60 text-paper shadow-md'
                        : 'text-[#8a847c] hover:bg-white/5 hover:text-paper border border-transparent'
                    }`}
                  >
                    <span className="text-[10px] font-mono tracking-widest text-[#8d7043]">
                      {ch.index}
                    </span>
                    <span className="text-[11px] font-semibold truncate max-w-[5rem]">
                      {ch.year}
                    </span>
                    <span className="text-[9px] text-[#8a847c] truncate max-w-[5rem]">
                      {ch.shortLocation}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Active Chapter Form Fields */}
            <div className="space-y-5 pt-2">
              {/* Year & Location Row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    Timeline Year / Period
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-[#8a847c]" />
                    <input
                      type="text"
                      value={activeChapter.year || ''}
                      onChange={(e) => handleActiveChapterChange('year', e.target.value)}
                      placeholder="e.g. 1971, 1993-1999, 2016+"
                      className="w-full rounded border border-white/10 bg-[#0d0c0a] pl-9 pr-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    Short Location Badge
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-[#8a847c]" />
                    <input
                      type="text"
                      value={activeChapter.shortLocation || ''}
                      onChange={(e) => handleActiveChapterChange('shortLocation', e.target.value)}
                      placeholder="e.g. Uganda, India, Dubai"
                      className="w-full rounded border border-white/10 bg-[#0d0c0a] pl-9 pr-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Map Country & Coordinates System */}
              <div className="rounded-lg border border-[#8d7043]/30 bg-[#0d0c0a] p-4 space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#fae8be]">
                    <Globe2 className="h-4 w-4 text-[#C9A15A]" />
                    World Map Location &amp; Coordinates
                  </span>
                  <span className="text-[10px] text-[#8a847c] font-mono">
                    Lon: {activeChapter.lon ?? 0} | Lat: {activeChapter.lat ?? 0}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {/* Preset Country Selector */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8a847c] mb-1">
                      Choose Country / City Preset
                    </label>
                    <select
                      value={activeChapter.countryKey || ''}
                      onChange={(e) => handleCountryPresetChange(e.target.value)}
                      className="w-full rounded border border-white/10 bg-[#161412] px-3 py-2 text-xs text-paper focus:border-[#8d7043] focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Select Destination --</option>
                      {WORLD_LOCATIONS.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.label} ({loc.note})
                        </option>
                      ))}
                      <option value="custom">⚙️ Custom GPS Coordinates</option>
                    </select>
                  </div>

                  {/* Longitude */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8a847c] mb-1">
                      Longitude (Lon)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={activeChapter.lon ?? ''}
                      onChange={(e) => handleActiveChapterChange('lon', parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 55.27"
                      className="w-full rounded border border-white/10 bg-[#161412] px-3 py-2 text-xs text-paper focus:border-[#8d7043] focus:outline-none font-mono"
                    />
                  </div>

                  {/* Latitude */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8a847c] mb-1">
                      Latitude (Lat)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={activeChapter.lat ?? ''}
                      onChange={(e) => handleActiveChapterChange('lat', parseFloat(e.target.value) || 0)}
                      placeholder="e.g. 25.20"
                      className="w-full rounded border border-white/10 bg-[#161412] px-3 py-2 text-xs text-paper focus:border-[#8d7043] focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8a847c] mb-1">
                      Full Location String
                    </label>
                    <input
                      type="text"
                      value={activeChapter.location || ''}
                      onChange={(e) => handleActiveChapterChange('location', e.target.value)}
                      placeholder="e.g. Dubai, UAE"
                      className="w-full rounded border border-white/10 bg-[#161412] px-3 py-2 text-xs text-paper focus:border-[#8d7043] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#8a847c] mb-1">
                      Map Pin Note / Subtitle
                    </label>
                    <input
                      type="text"
                      value={activeChapter.pinNote || ''}
                      onChange={(e) => handleActiveChapterChange('pinNote', e.target.value)}
                      placeholder="e.g. Base 2016+, Gold Ops, Studies"
                      className="w-full rounded border border-white/10 bg-[#161412] px-3 py-2 text-xs text-paper focus:border-[#8d7043] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Title Field */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Chapter Title
                </label>
                <input
                  type="text"
                  value={activeChapter.title || ''}
                  onChange={(e) => handleActiveChapterChange('title', e.target.value)}
                  placeholder="e.g. Born in Uganda"
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none font-medium"
                />
              </div>

              {/* Narrative Story Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Narrative Story Description
                </label>
                <textarea
                  rows={4}
                  value={activeChapter.description || ''}
                  onChange={(e) => handleActiveChapterChange('description', e.target.value)}
                  placeholder="Detailed narrative for this milestone chapter..."
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Action Button CTA & Link */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={activeChapter.cta || ''}
                    onChange={(e) => handleActiveChapterChange('cta', e.target.value)}
                    placeholder="e.g. Read the profile"
                    className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    CTA Button URL / Link
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-[#8a847c]" />
                    <input
                      type="text"
                      value={activeChapter.href || ''}
                      onChange={(e) => handleActiveChapterChange('href', e.target.value)}
                      placeholder="e.g. /about or /projects"
                      className="w-full rounded border border-white/10 bg-[#0d0c0a] pl-9 pr-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Image Manager Section */}
              <div className="pt-2 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-[#8a847c] font-medium flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-[#8d7043]" />
                    Milestone Portrait / Photo
                  </label>
                  <span className="text-[11px] text-[#8a847c]">Luxury Gold Bezel Frame</span>
                </div>

                {/* File Upload Button + Preset Selector */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="flex items-center justify-center gap-2 rounded border border-[#8d7043]/50 bg-[#8d7043]/10 px-4 py-2.5 text-xs font-semibold text-[#fae8be] hover:bg-[#8d7043]/20 transition-colors shrink-0"
                  >
                    <Upload className="h-4 w-4 text-[#8d7043]" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload New Photo'}</span>
                  </button>

                  <div className="relative flex-1">
                    <select
                      value={
                        PRESET_IMAGES.some((p) => p.path === activeChapter.image)
                          ? activeChapter.image
                          : ''
                      }
                      onChange={(e) => {
                        if (e.target.value) handleActiveChapterChange('image', e.target.value)
                      }}
                      className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2.5 text-xs text-paper focus:border-[#8d7043] focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Or Pick From Photo Presets --</option>
                      {PRESET_IMAGES.map((preset) => (
                        <option key={preset.path} value={preset.path}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Direct Image URL Path */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#8a847c] mb-1">
                    Direct Image URL / Path
                  </label>
                  <input
                    type="text"
                    value={activeChapter.image || ''}
                    onChange={(e) => handleActiveChapterChange('image', e.target.value)}
                    placeholder="/src/assets/images/... or https://..."
                    className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-1.5 text-xs text-paper font-mono focus:border-[#8d7043] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Chapter Card Preview & Map Location Summary */}
        <div className="space-y-6 lg:col-span-5">
          {/* Card: Live Chapter Card Preview */}
          <div className="sticky top-6 rounded-xl border border-white/10 bg-[#161412] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8d7043]">
                <Eye className="h-4 w-4" />
                Live Chapter Card Preview
              </span>
              <span className="text-xs text-[#8a847c] font-mono">
                Index: {activeChapter.index}
              </span>
            </div>

            {/* Rendered Chapter Simulation Card */}
            <div className="rounded-xl border border-[#8d7043]/30 bg-[#0D0D0C] p-5 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                {/* Left details */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono tracking-widest text-[#8d7043]">
                      {activeChapter.index}
                    </span>
                    <span className="h-px w-3 bg-[#8d7043]/40" />
                    <span className="text-[10px] uppercase tracking-widest text-[#8a847c]">
                      {activeChapter.year}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl text-paper leading-snug">
                    {activeChapter.title || 'Chapter Title'}
                  </h3>

                  <p className="text-xs text-[#b7b0a6] leading-relaxed line-clamp-4">
                    {activeChapter.description || 'Chapter narrative description goes here...'}
                  </p>

                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#8d7043] hover:underline cursor-pointer">
                      {activeChapter.cta || 'Read the profile'}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>

                {/* Right Portrait Frame */}
                <div className="shrink-0 w-28 sm:w-32">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[#8d7043]/40 bg-[#161412] p-0.5 shadow-lg">
                    <img
                      src={activeChapter.image || '/src/assets/images/gilbert-kwizera-lounge-armchair.jpg'}
                      alt={activeChapter.title}
                      className="h-full w-full object-cover rounded-[10px]"
                    />
                    <div className="absolute top-1 left-1 flex items-center gap-1 rounded-full border border-[#8d7043]/40 bg-black/80 px-1.5 py-0.5 backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8d7043] animate-pulse" />
                      <span className="text-[8px] font-semibold text-[#8d7043] uppercase tracking-wider">
                        {activeChapter.shortLocation || 'Uganda'}
                      </span>
                    </div>
                    <div className="absolute right-1 bottom-1 rounded border border-white/10 bg-black/70 px-1 py-0.5 text-[8px] text-[#8a847c]">
                      {activeChapter.year || '1971'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GPS Location & Animation Info Banner */}
            <div className="rounded-lg border border-white/5 bg-[#0d0c0a] p-3.5 text-xs text-[#8a847c] space-y-2">
              <div className="flex items-center gap-1.5 font-medium text-[#fae8be]">
                <Navigation className="h-3.5 w-3.5 text-[#C9A15A]" />
                <span>Active Coordinates on 3D World Map:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                <strong className="text-paper">{activeChapter.location || activeChapter.shortLocation}</strong> at GPS coordinates{' '}
                <code className="text-[#C9A15A] bg-black/50 px-1.5 py-0.5 rounded font-mono">
                  [{activeChapter.lon ?? 0}, {activeChapter.lat ?? 0}]
                </code>
                . When published, the map camera and glowing beacon align to this exact location seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
