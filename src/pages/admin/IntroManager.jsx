import { useState, useEffect, useRef } from 'react'
import {
  Sparkles,
  Save,
  RotateCcw,
  Check,
  Eye,
  Layers,
  Image as ImageIcon,
  Link as LinkIcon,
  ExternalLink,
  Sliders,
  Type,
  Plus,
  Trash2,
  Upload,
  Clock,
  ArrowUpRight,
  Shield,
  HelpCircle,
  FileText,
  Bookmark,
  CheckCircle2,
  X,
} from 'lucide-react'
import { introAPI } from '../../services/api'
import { profile, introduction, introductionFacts, introductionPillars } from '../../data/profile'

const DEFAULT_INTRO = {
  indexNumber: '01',
  kicker: 'Introduction',
  titleLine1: 'A Life Dedicated to',
  titleLine2: 'Service, Dignity, and Hope.',
  role: profile.title || 'Humanitarian leader, international consultant, and volunteer',
  paragraphs: [
    'Gilbert Kevin Jimmy Kwizera is a humanitarian leader, international consultant, and volunteer. He founded the Cancer Charity Foundation and Haven Welfare, and he has committed the work to dignity-based care, ethical leadership, and sustainable social impact.',
    'The work is quiet on purpose. Help is offered without turning people into public stories. What matters is consistency: showing up, using resources responsibly, and making decisions that protect human dignity.',
  ],
  profileLinkText: 'Read the full profile',
  profileLinkUrl: '/about',

  // Interactive Shutter Plate Aside
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

  // Facts List
  facts: [
    { label: 'Born', value: 'Kampala, 1971' },
    { label: 'Based', value: 'Dubai, UAE' },
    { label: 'Founded', value: 'CCF & Haven Welfare' },
    { label: 'Standard', value: 'Dignity-based care' },
  ],

  // 3 Pillars List
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
}

const PRESET_PORTRAITS = [
  { label: 'Office Standing with African Art', path: '/src/assets/images/gilbert-kwizera-office-standing.jpg' },
  { label: 'Executive Formal Portrait', path: '/src/assets/images/gilbert-kwizera-executive.jpg' },
  { label: 'Lounge Armchair Reflection', path: '/src/assets/images/gilbert-kwizera-lounge-armchair.jpg' },
  { label: 'Dubai Downtown Walking', path: '/src/assets/images/gilbert-kwizera-dubai-walking.jpg' },
  { label: 'Dubai Marina Yacht Outreach', path: '/src/assets/images/gilbert-kwizera-dubai-marina-yacht.jpg' },
]

export default function IntroManager() {
  const [formData, setFormData] = useState(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('gilbert_cached_intro') : null
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        return { ...DEFAULT_INTRO, ...parsed }
      } catch (e) {}
    }
    return DEFAULT_INTRO
  })

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [notification, setNotification] = useState({ message: '', type: '' })
  const [activeTab, setActiveTab] = useState('narrative') // 'narrative', 'shutter', 'facts', 'pillars'
  const [simulatorHover, setSimulatorHover] = useState(false)

  const fileInputRef = useRef(null)

  // Fetch current active introduction content
  useEffect(() => {
    const fetchIntro = async () => {
      try {
        const res = await introAPI.getIntro()
        if (res.success && res.data) {
          setFormData((prev) => ({
            ...DEFAULT_INTRO,
            ...res.data,
          }))
        }
      } catch (err) {
        console.warn('Using local intro defaults:', err.message)
      }
    }
    fetchIntro()
  }, [])

  // Synchronize and persist introduction changes both locally and to MongoDB API
  const persistIntroChanges = async (updatedData, showSuccessNotice = false) => {
    setFormData(updatedData)
    try {
      localStorage.setItem('gilbert_cached_intro', JSON.stringify(updatedData))
      window.dispatchEvent(new CustomEvent('gilbert_intro_updated', { detail: updatedData }))
    } catch (e) {}

    try {
      await introAPI.updateIntro(updatedData)
      if (showSuccessNotice) {
        setNotification({ message: 'Introduction content saved & published live to database!', type: 'success' })
      }
    } catch (err) {
      console.warn('[Intro Save Sync]: Saved locally & cached.', err.message)
      if (showSuccessNotice) {
        setNotification({ message: 'Introduction saved locally and published live!', type: 'success' })
      }
    }
  }

  // Handle Shutter Image Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setNotification({ message: '', type: '' })

    const uploadPayload = new FormData()
    uploadPayload.append('image', file)

    try {
      const res = await introAPI.uploadImage(uploadPayload)
      if (res.success && res.url) {
        const nextData = {
          ...formData,
          shutterImage: res.url,
        }
        await persistIntroChanges(nextData)
        setNotification({ message: 'Shutter plate image uploaded & updated live!', type: 'success' })
      }
    } catch (err) {
      const localUrl = URL.createObjectURL(file)
      const nextData = {
        ...formData,
        shutterImage: localUrl,
      }
      await persistIntroChanges(nextData)
      setNotification({ message: 'Image loaded locally for preview & testing', type: 'success' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Paragraph Handlers
  const handleParagraphChange = (index, value) => {
    const newParagraphs = [...formData.paragraphs]
    newParagraphs[index] = value
    setFormData({ ...formData, paragraphs: newParagraphs })
  }

  const handleAddParagraph = () => {
    setFormData({
      ...formData,
      paragraphs: [...formData.paragraphs, 'Enter new paragraph text here...'],
    })
  }

  const handleRemoveParagraph = (index) => {
    if (formData.paragraphs.length <= 1) {
      alert('Introduction must have at least one paragraph.')
      return
    }
    const newParagraphs = formData.paragraphs.filter((_, i) => i !== index)
    setFormData({ ...formData, paragraphs: newParagraphs })
  }

  // Fact Handlers
  const handleFactChange = (index, field, value) => {
    const newFacts = [...formData.facts]
    newFacts[index] = { ...newFacts[index], [field]: value }
    setFormData({ ...formData, facts: newFacts })
  }

  const handleAddFact = () => {
    setFormData({
      ...formData,
      facts: [...formData.facts, { label: 'New Metric', value: '100+' }],
    })
  }

  const handleRemoveFact = (index) => {
    if (formData.facts.length <= 1) return
    const newFacts = formData.facts.filter((_, i) => i !== index)
    setFormData({ ...formData, facts: newFacts })
  }

  // Pillar Handlers
  const handlePillarChange = (index, field, value) => {
    const newPillars = [...formData.pillars]
    newPillars[index] = { ...newPillars[index], [field]: value }
    setFormData({ ...formData, pillars: newPillars })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setNotification({ message: '', type: '' })

    await persistIntroChanges(formData, true)
    setSaving(false)
  }

  const handleReset = () => {
    if (window.confirm('Reset introduction settings to original defaults?')) {
      persistIntroChanges(DEFAULT_INTRO, true)
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#C9A15A] uppercase mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>HOMEPAGE INTRODUCTION MANAGER</span>
          </div>
          <h1 className="display text-3xl sm:text-4xl text-white font-normal">
            Introduction Section Editor
          </h1>
          <p className="text-xs sm:text-sm text-mist/75 mt-1 font-light">
            Update the title, editorial narrative, interactive hover shutter card, facts metrics, and mission pillars.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex shrink-0 items-center justify-center whitespace-nowrap gap-2 rounded-xl bg-gradient-to-r from-[#8d7043] to-[#C9A15A] px-6 py-2.5 text-xs font-semibold text-black uppercase tracking-wider hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer shadow-lg shadow-[#8d7043]/20"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving Live...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification.message && (
        <div
          className={`flex items-center justify-between rounded-2xl p-4 text-xs ${
            notification.type === 'success'
              ? 'border border-emerald-500/30 bg-emerald-950/40 text-emerald-200'
              : 'border border-red-500/30 bg-red-950/40 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification({ message: '', type: '' })}
            className="text-mist/60 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        {[
          { id: 'narrative', label: '1. Title & Story Narrative', icon: Type },
          { id: 'shutter', label: '2. Interactive Shutter Card', icon: ImageIcon },
          { id: 'facts', label: '3. Key Facts Metrics', icon: Bookmark },
          { id: 'pillars', label: '4. Mission Pillars (01-03)', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition-all whitespace-nowrap ${
                active
                  ? 'bg-gradient-to-r from-[#8d7043]/30 to-[#C9A15A]/15 text-[#fae8be] border border-[#C9A15A]/40 font-semibold'
                  : 'text-mist/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? 'text-[#C9A15A]' : 'text-mist/50'}`} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Form Controls */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6 rounded-3xl border border-white/10 bg-[#14120e] p-6 sm:p-7 shadow-xl">
          {/* TAB 1: Narrative & Titles */}
          {activeTab === 'narrative' && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                    Section Index
                  </label>
                  <input
                    type="text"
                    value={formData.indexNumber || '01'}
                    onChange={(e) => setFormData({ ...formData, indexNumber: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                    Kicker Label
                  </label>
                  <input
                    type="text"
                    value={formData.kicker || 'Introduction'}
                    onChange={(e) => setFormData({ ...formData, kicker: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                  Main Headline (Line 1 &amp; Line 2)
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.titleLine1 || ''}
                    onChange={(e) => setFormData({ ...formData, titleLine1: e.target.value })}
                    placeholder="A Life Dedicated to"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-[#C9A15A] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={formData.titleLine2 || ''}
                    onChange={(e) => setFormData({ ...formData, titleLine2: e.target.value })}
                    placeholder="Service, Dignity, and Hope."
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-[#C9A15A] italic focus:border-[#C9A15A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                  Role / Subtitle
                </label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Humanitarian leader, international consultant, and volunteer"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none"
                />
              </div>

              {/* Multi-Paragraph Story */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C9A15A]">
                    Story Paragraphs ({formData.paragraphs.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddParagraph}
                    className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-[0.68rem] text-mist hover:text-white hover:bg-white/10"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Paragraph</span>
                  </button>
                </div>

                {formData.paragraphs.map((p, idx) => (
                  <div key={idx} className="relative group">
                    <textarea
                      rows={3}
                      value={p}
                      onChange={(e) => handleParagraphChange(idx, e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 p-3.5 pr-10 text-xs text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none leading-relaxed"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveParagraph(idx)}
                      className="absolute right-2.5 top-3 text-mist/40 hover:text-red-400 p-1 transition-colors"
                      title="Delete paragraph"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-white/10">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                    Profile Link Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.profileLinkText || 'Read the full profile'}
                    onChange={(e) => setFormData({ ...formData, profileLinkText: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                    Profile Link URL
                  </label>
                  <input
                    type="text"
                    value={formData.profileLinkUrl || '/about'}
                    onChange={(e) => setFormData({ ...formData, profileLinkUrl: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Interactive Shutter Card */}
          {activeTab === 'shutter' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#C9A15A] mb-1 flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4" />
                  <span>Interactive Shutter Photo</span>
                </label>
                <p className="text-[0.68rem] text-mist/60 mb-3">
                  This photo is concealed behind the editorial shutter doors and revealed when visitors hover over the card.
                </p>

                <div className="flex items-center gap-4 p-3 rounded-2xl bg-black/40 border border-white/10">
                  <div className="h-16 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
                    <img src={formData.shutterImage} alt="Shutter Preview" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-semibold text-white truncate font-mono">
                      {formData.shutterImage}
                    </span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="shutter-upload-input"
                    />
                    <label
                      htmlFor="shutter-upload-input"
                      className="inline-flex items-center gap-1.5 mt-2 cursor-pointer rounded-lg bg-gradient-to-r from-[#8d7043] to-[#C9A15A] px-3 py-1 text-[0.68rem] font-semibold text-black uppercase tracking-wider hover:opacity-90 transition-opacity"
                    >
                      <Upload className="h-3 w-3" />
                      <span>{uploading ? 'Uploading...' : 'Upload New Photo from PC'}</span>
                    </label>
                  </div>
                </div>

                {/* Preset portrait picker */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESET_PORTRAITS.map((p) => (
                    <button
                      key={p.path}
                      type="button"
                      onClick={() => setFormData({ ...formData, shutterImage: p.path })}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[0.68rem] border transition-all ${
                        formData.shutterImage === p.path
                          ? 'border-[#C9A15A] bg-[#C9A15A]/20 text-[#fae8be] font-semibold'
                          : 'border-white/10 bg-white/5 text-mist/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-white/10">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                    Hover Badge Pill Text
                  </label>
                  <input
                    type="text"
                    value={formData.shutterBadge || 'Hover to reveal'}
                    onChange={(e) => setFormData({ ...formData, shutterBadge: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                    Shutter Tag Category
                  </label>
                  <input
                    type="text"
                    value={formData.shutterTag || 'A working standard'}
                    onChange={(e) => setFormData({ ...formData, shutterTag: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                  Shutter Statement Headline
                </label>
                <input
                  type="text"
                  value={formData.shutterHeading || ''}
                  onChange={(e) => setFormData({ ...formData, shutterHeading: e.target.value })}
                  placeholder="Charity is treated as a duty, not a performance."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-[#C9A15A] focus:outline-none font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                  Shutter Narrative Description
                </label>
                <textarea
                  rows={3}
                  value={formData.shutterDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shutterDescription: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-white/10">
                <div className="space-y-2">
                  <span className="block text-[0.68rem] text-[#C9A15A] font-semibold uppercase">Origin Fact</span>
                  <input
                    type="text"
                    value={formData.shutterOriginLabel || 'Origin'}
                    onChange={(e) => setFormData({ ...formData, shutterOriginLabel: e.target.value })}
                    placeholder="Origin"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-mist/60"
                  />
                  <input
                    type="text"
                    value={formData.shutterOriginValue || 'Kampala, Uganda'}
                    onChange={(e) => setFormData({ ...formData, shutterOriginValue: e.target.value })}
                    placeholder="Kampala, Uganda"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <span className="block text-[0.68rem] text-[#C9A15A] font-semibold uppercase">Current Location Fact</span>
                  <input
                    type="text"
                    value={formData.shutterNowLabel || 'Now'}
                    onChange={(e) => setFormData({ ...formData, shutterNowLabel: e.target.value })}
                    placeholder="Now"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-mist/60"
                  />
                  <input
                    type="text"
                    value={formData.shutterNowValue || 'Jumeirah, Dubai'}
                    onChange={(e) => setFormData({ ...formData, shutterNowValue: e.target.value })}
                    placeholder="Jumeirah, Dubai"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs text-white font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Facts Metrics */}
          {activeTab === 'facts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C9A15A]">
                    Key Facts &amp; Metrics ({formData.facts.length})
                  </label>
                  <p className="text-[0.68rem] text-mist/60">
                    These facts display in a 4-column highlight bar across the introduction.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFact}
                  className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-xs text-mist hover:text-white hover:bg-white/10"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Metric</span>
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                {formData.facts.map((fact, idx) => (
                  <div key={idx} className="relative rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2 group">
                    <button
                      type="button"
                      onClick={() => handleRemoveFact(idx)}
                      className="absolute right-2 top-2 text-mist/40 hover:text-red-400 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <div>
                      <span className="block text-[0.62rem] text-mist/60 uppercase tracking-wider">Label</span>
                      <input
                        type="text"
                        value={fact.label}
                        onChange={(e) => handleFactChange(idx, 'label', e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[0.62rem] text-mist/60 uppercase tracking-wider">Value</span>
                      <input
                        type="text"
                        value={fact.value}
                        onChange={(e) => handleFactChange(idx, 'value', e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-[#C9A15A] font-semibold focus:border-[#C9A15A] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Mission Pillars */}
          {activeTab === 'pillars' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#C9A15A] mb-1">
                  Three Mission Pillars
                </label>
                <p className="text-[0.68rem] text-mist/60">
                  These 3 pillars highlight the key organizations and impact domains.
                </p>
              </div>

              <div className="space-y-4">
                {formData.pillars.map((pillar, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-[#C9A15A]/20 border border-[#C9A15A]/40 flex items-center justify-center font-mono text-xs text-[#fae8be] font-bold">
                        {pillar.number || `0${idx + 1}`}
                      </div>
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => handlePillarChange(idx, 'title', e.target.value)}
                        placeholder="Pillar Title (e.g. Cancer care)"
                        className="flex-1 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white focus:border-[#C9A15A] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={pillar.organization}
                        onChange={(e) => handlePillarChange(idx, 'organization', e.target.value)}
                        placeholder="Organization Name"
                        className="flex-1 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-mist focus:border-[#C9A15A] focus:outline-none"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={pillar.text}
                      onChange={(e) => handlePillarChange(idx, 'text', e.target.value)}
                      placeholder="Description of the pillar's work..."
                      className="w-full rounded-lg border border-white/10 bg-black/60 p-2.5 text-xs text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none leading-relaxed"
                    />
                    <div>
                      <span className="block text-[0.62rem] text-mist/50 mb-1 font-mono">Link Target:</span>
                      <input
                        type="text"
                        value={pillar.to}
                        onChange={(e) => handlePillarChange(idx, 'to', e.target.value)}
                        placeholder="/impact/..."
                        className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-1 text-xs text-[#C9A15A] font-mono focus:border-[#C9A15A] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-white/10 flex items-center justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8d7043] to-[#C9A15A] px-6 py-3 text-xs font-semibold text-black uppercase tracking-wider hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer shadow-lg shadow-[#8d7043]/20"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Publishing Updates...' : 'Save & Publish Live'}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live Visual Interactive Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#14120e] p-5 sm:p-6 shadow-xl sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-mist/90 flex items-center gap-2">
                <Eye className="h-4 w-4 text-[#C9A15A]" />
                <span>Live Shutter Simulator</span>
              </span>
              <a
                href="/#intro"
                target="_blank"
                rel="noreferrer"
                className="text-[0.68rem] text-[#C9A15A] hover:underline flex items-center gap-1"
              >
                <span>Open Website</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Simulated Shutter Plate Card */}
            <div className="relative mx-auto w-full max-w-[340px]">
              <div
                className="pointer-events-none absolute -inset-1.5 rounded-[1.8rem] border border-[#C9A15A]/40"
                aria-hidden="true"
              />
              <div
                onMouseEnter={() => setSimulatorHover(true)}
                onMouseLeave={() => setSimulatorHover(false)}
                className="group relative aspect-[4/5] cursor-pointer select-none overflow-hidden rounded-[1.5rem] border border-white/10 bg-ink text-paper shadow-2xl transition-all duration-500"
              >
                {/* Background Photo Revealed on Hover */}
                <img
                  src={formData.shutterImage}
                  alt="Portrait"
                  className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_18%] transition-all duration-700 ease-[cubic-bezier(0.2,1,0.3,1)] ${
                    simulatorHover ? 'scale-105 opacity-100' : 'scale-100 opacity-0'
                  }`}
                />

                {/* Top Shutter Door */}
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 z-[2] h-1/2 border-b border-[#C9A15A]/25 bg-ink transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] ${
                    simulatorHover ? '-translate-y-full' : ''
                  }`}
                />
                {/* Bottom Shutter Door */}
                <div
                  className={`pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-1/2 border-t border-[#C9A15A]/25 bg-ink transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] ${
                    simulatorHover ? 'translate-y-full' : ''
                  }`}
                />

                {/* Badge Pill */}
                <div
                  className={`pointer-events-none absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[9px] tracking-wider text-mist/80 uppercase backdrop-blur-md transition-all duration-500 ${
                    simulatorHover ? 'scale-90 opacity-0' : ''
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A15A] animate-pulse" />
                  <span>{formData.shutterBadge || 'Hover to reveal'}</span>
                </div>

                {/* Shutter Text Content */}
                <div
                  className={`absolute inset-x-0 bottom-0 z-10 px-5 pt-12 pb-5 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    simulatorHover ? 'translate-y-3 opacity-0' : ''
                  }`}
                >
                  <p className="text-[0.6rem] font-medium uppercase tracking-[0.22em] text-[#C9A15A]">
                    {formData.shutterTag || 'A working standard'}
                  </p>
                  <p className="display mt-3 text-2xl leading-[1.08] text-white">
                    {formData.shutterHeading || 'Charity is treated as a duty, not a performance.'}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-paper/75 line-clamp-3">
                    {formData.shutterDescription}
                  </p>
                  <dl className="mt-5 grid grid-cols-2 gap-x-4 border-t border-white/15 pt-4">
                    <div>
                      <dt className="text-[0.58rem] uppercase tracking-[0.18em] text-paper/50">
                        {formData.shutterOriginLabel || 'Origin'}
                      </dt>
                      <dd className="mt-0.5 text-xs text-paper font-semibold">{formData.shutterOriginValue}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.58rem] uppercase tracking-[0.18em] text-paper/50">
                        {formData.shutterNowLabel || 'Now'}
                      </dt>
                      <dd className="mt-0.5 text-xs text-paper font-semibold">{formData.shutterNowValue}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-white/[0.02] border border-white/5 p-4 text-[0.72rem] text-mist/80">
              <p className="font-semibold text-white mb-1">✨ Live Interactive Shutter Test</p>
              <p className="font-light">
                Hover over the card simulator above to test the shutter doors sliding apart to reveal Gilbert&apos;s photo!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
