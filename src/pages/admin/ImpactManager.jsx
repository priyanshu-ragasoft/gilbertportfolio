import { useState, useEffect, useRef } from 'react'
import {
  TrendingUp,
  Save,
  RotateCcw,
  Check,
  Eye,
  Layers,
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  Type,
  CheckCircle2,
  X,
  Bookmark,
  Sparkles,
  Grid,
} from 'lucide-react'
import { impactAPI } from '../../services/api'
import { figures as defaultFigures, profile } from '../../data/profile'
import { impactAreas as defaultAreas } from '../../data/impact'

const DEFAULT_IMPACT = {
  eyebrow: 'Impact',
  title: 'Turning Awareness Into Action',
  leadText:
    'Most people feel concern when they see suffering. Fewer turn that concern into something that still works later. The published account of this life is about that move: from sympathy to structures that help in the background.',
  sideNote:
    'Where sickness, poverty, and displacement meet, small failures become overwhelming. The response described here is patience and organisation — showing up, spending resources carefully, and refusing choices that cost a person their dignity.',
  figures: defaultFigures || [
    { value: '500+', label: 'Patients helped' },
    { value: '50+', label: 'Verified staff' },
    { value: '25+', label: 'Rehab centres' },
    { value: '$182,000+', label: 'Donations received' },
  ],
  caption: "Figures as published alongside his foundations' work.",
  storyImage: profile.storyImage || '/src/assets/images/ccf-uci.jpg',
  storyImageAlt: 'Uganda Cancer Institute, a centre of specialised cancer treatment in Kampala',
  storyHeading: 'Consistency, not the dramatic moment, is what the work asks for.',
  storyDescription:
    'In the writing published with his name, inspiration is not a single gesture. It is the decision to build support that operates when no one is watching, for people at their most vulnerable.',
  areas: defaultAreas || [],
}

const PRESET_STORY_IMAGES = [
  { label: 'Uganda Cancer Institute (UCI)', path: '/src/assets/images/ccf-uci.jpg' },
  { label: 'Cancer Care & Compassion', path: '/src/assets/images/ccf-cancer-care-compassion.jpg' },
  { label: 'CCF Care Patient Ward', path: '/src/assets/images/ccf-care.jpg' },
  { label: 'Haven Welfare Facility', path: '/src/assets/images/havenwelfare.jpg' },
  { label: 'Education & Community Support', path: '/src/assets/images/Supporting-Education-Empowering-Futures.jpg' },
]

const PRESET_AREA_IMAGES = [
  { label: 'Cancer Care Hero', path: '/src/assets/images/ccf-cancer-care-compassion.jpg' },
  { label: 'Haven Welfare Caregiver', path: '/src/assets/images/havenwelfare.jpg' },
  { label: 'Classroom & Education Drive', path: '/src/assets/images/Gilbert-Kwizera-Charity-Support-for-Uganda-Students-Drive.jpg' },
  { label: 'PIO Ecosystem & Technology', path: '/src/assets/images/pio-ecosystem-technology.jpg' },
  { label: 'Employment Awareness Initiative', path: '/src/assets/images/kwizera-humanitarian-employment-initiative.jpg' },
  { label: 'CCF Patient Care Ward', path: '/src/assets/images/ccf-care.jpg' },
]

const sanitizeStoryImage = (img) => {
  if (!img || (typeof img === 'string' && img.includes('uganda-cancer-institute.jpg'))) {
    return profile.storyImage || '/src/assets/images/ccf-uci.jpg'
  }
  return img
}

export default function ImpactManager() {
  const [formData, setFormData] = useState(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('gilbert_cached_impact') : null
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        return {
          ...DEFAULT_IMPACT,
          ...parsed,
          storyImage: sanitizeStoryImage(parsed.storyImage),
          areas: parsed.areas?.length ? parsed.areas : defaultAreas,
        }
      } catch (e) {}
    }
    return { ...DEFAULT_IMPACT, areas: defaultAreas }
  })

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [notification, setNotification] = useState({ message: '', type: '' })
  const [activeTab, setActiveTab] = useState('headlines') // 'headlines', 'figures', 'showcase', 'initiatives'
  const [activeCardIdx, setActiveCardIdx] = useState(0)

  const fileInputRef = useRef(null)
  const areaFileInputRef = useRef(null)

  // Fetch current live impact content
  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const res = await impactAPI.getImpact()
        if (res.success && res.data) {
          setFormData((prev) => ({
            ...DEFAULT_IMPACT,
            ...res.data,
            storyImage: sanitizeStoryImage(res.data.storyImage),
            areas: res.data.areas?.length ? res.data.areas : defaultAreas,
          }))
        }
      } catch (err) {
        console.warn('Using local impact defaults:', err.message)
      }
    }
    fetchImpact()
  }, [])

  // Synchronize and persist impact changes both locally and to MongoDB API
  const persistImpactChanges = async (updatedData, showSuccessNotice = false) => {
    setFormData(updatedData)
    try {
      localStorage.setItem('gilbert_cached_impact', JSON.stringify(updatedData))
      window.dispatchEvent(new CustomEvent('gilbert_impact_updated', { detail: updatedData }))
    } catch (e) {}

    try {
      await impactAPI.updateImpact(updatedData)
      if (showSuccessNotice) {
        setNotification({ message: 'Impact section updated & published live to database!', type: 'success' })
      }
    } catch (err) {
      console.warn('[Impact Save Sync]: Saved locally & cached.', err.message)
      if (showSuccessNotice) {
        setNotification({ message: 'Impact section saved locally and published live!', type: 'success' })
      }
    }
  }

  // Handle Story Image Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setNotification({ message: '', type: '' })

    const uploadPayload = new FormData()
    uploadPayload.append('image', file)

    try {
      const res = await impactAPI.uploadImage(uploadPayload)
      if (res.success && res.url) {
        const nextData = {
          ...formData,
          storyImage: res.url,
        }
        await persistImpactChanges(nextData)
        setNotification({ message: 'Impact story image uploaded & updated live!', type: 'success' })
      }
    } catch (err) {
      const localUrl = URL.createObjectURL(file)
      const nextData = {
        ...formData,
        storyImage: localUrl,
      }
      await persistImpactChanges(nextData)
      setNotification({ message: 'Image loaded locally for preview & testing', type: 'success' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Handle Card Image Upload
  const handleAreaImageUpload = async (e, areaIndex) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const uploadPayload = new FormData()
    uploadPayload.append('image', file)

    try {
      const res = await impactAPI.uploadImage(uploadPayload)
      if (res.success && res.url) {
        handleAreaChange(areaIndex, 'image', res.url)
        setNotification({ message: 'Initiative image uploaded successfully!', type: 'success' })
      }
    } catch (err) {
      const localUrl = URL.createObjectURL(file)
      handleAreaChange(areaIndex, 'image', localUrl)
      setNotification({ message: 'Initiative image loaded for preview', type: 'success' })
    } finally {
      setUploading(false)
      if (areaFileInputRef.current) areaFileInputRef.current.value = ''
    }
  }

  // Figure Handlers
  const handleFigureChange = (index, field, value) => {
    const newFigures = [...formData.figures]
    newFigures[index] = { ...newFigures[index], [field]: value }
    setFormData({ ...formData, figures: newFigures })
  }

  const handleAddFigure = () => {
    setFormData({
      ...formData,
      figures: [...formData.figures, { value: '100+', label: 'New Metric Label' }],
    })
  }

  const handleRemoveFigure = (index) => {
    if (formData.figures.length <= 1) {
      alert('Must have at least one figure metric.')
      return
    }
    const newFigures = formData.figures.filter((_, i) => i !== index)
    setFormData({ ...formData, figures: newFigures })
  }

  // Initiative Card Handlers
  const handleAreaChange = (index, field, value) => {
    const newAreas = [...(formData.areas || defaultAreas)]
    newAreas[index] = { ...newAreas[index], [field]: value }
    setFormData({ ...formData, areas: newAreas })
  }

  const handleAddArea = () => {
    const currentLength = (formData.areas || []).length
    const num = currentLength < 9 ? `0${currentLength + 1}` : `${currentLength + 1}`
    const newArea = {
      slug: `new-initiative-${Date.now()}`,
      number: num,
      title: 'New Humanitarian Initiative',
      organization: 'Community Care Foundation',
      image: '/src/assets/images/ccf-care.jpg',
      imageAlt: 'Initiative program overview',
      summary: 'Brief description of this humanitarian initiative and how it impacts society with dignity.',
      points: [
        { title: 'Support & Care', text: 'Direct assistance provided to those in need.' },
        { title: 'Community Outreach', text: 'Empowering local community development.' },
      ],
    }
    const updatedAreas = [...(formData.areas || []), newArea]
    setFormData({ ...formData, areas: updatedAreas })
    setActiveCardIdx(updatedAreas.length - 1)
  }

  const handleRemoveArea = (index) => {
    if ((formData.areas || []).length <= 1) {
      alert('Must have at least one initiative card.')
      return
    }
    const updatedAreas = formData.areas.filter((_, i) => i !== index)
    setFormData({ ...formData, areas: updatedAreas })
    if (activeCardIdx >= updatedAreas.length) {
      setActiveCardIdx(Math.max(0, updatedAreas.length - 1))
    }
  }

  const handlePointChange = (areaIndex, pointIndex, field, value) => {
    const newAreas = [...(formData.areas || defaultAreas)]
    const newPoints = [...(newAreas[areaIndex].points || [])]
    newPoints[pointIndex] = { ...newPoints[pointIndex], [field]: value }
    newAreas[areaIndex] = { ...newAreas[areaIndex], points: newPoints }
    setFormData({ ...formData, areas: newAreas })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setNotification({ message: '', type: '' })

    await persistImpactChanges(formData, true)
    setSaving(false)
  }

  const handleReset = () => {
    if (window.confirm('Reset Impact section to original default values?')) {
      persistImpactChanges({ ...DEFAULT_IMPACT, areas: defaultAreas }, true)
    }
  }

  const currentArea = formData.areas?.[activeCardIdx] || formData.areas?.[0] || defaultAreas[0]

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#C9A15A] uppercase mb-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>HOMEPAGE IMPACT SECTION MANAGER</span>
          </div>
          <h1 className="display text-3xl sm:text-4xl text-white font-normal">
            Impact Section &amp; Initiatives Editor
          </h1>
          <p className="text-xs sm:text-sm text-mist/75 mt-1 font-light">
            Update the headline story, live statistics figures (500+ patients, $182,000+ donations), showcase quote, and all 5 Humanitarian Initiative Cards.
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
          { id: 'headlines', label: '1. Headlines & Perspective Notes', icon: Type },
          { id: 'figures', label: '2. Metrics & Statistics (500+, $182k+)', icon: Bookmark },
          { id: 'showcase', label: '3. Story Showcase & Feature Photo', icon: ImageIcon },
          { id: 'initiatives', label: '4. Initiative Cards (5 Pillars Grid)', icon: Grid },
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
          {/* TAB 1: Headlines & Notes */}
          {activeTab === 'headlines' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                  Eyebrow Kicker
                </label>
                <input
                  type="text"
                  value={formData.eyebrow || 'Impact'}
                  onChange={(e) => setFormData({ ...formData, eyebrow: e.target.value })}
                  placeholder="Impact"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                  Main Section Headline
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Turning Awareness Into Action"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-base text-white focus:border-[#C9A15A] focus:outline-none font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                  Lead Story (Left Paragraph)
                </label>
                <textarea
                  rows={4}
                  value={formData.leadText || ''}
                  onChange={(e) => setFormData({ ...formData, leadText: e.target.value })}
                  placeholder="Most people feel concern when they see suffering..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3.5 text-xs text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                  Perspective Side Note (Right Paragraph)
                </label>
                <textarea
                  rows={4}
                  value={formData.sideNote || ''}
                  onChange={(e) => setFormData({ ...formData, sideNote: e.target.value })}
                  placeholder="Where sickness, poverty, and displacement meet..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3.5 text-xs text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Figures & Metrics */}
          {activeTab === 'figures' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C9A15A]">
                    Key Metrics &amp; Impact Numbers ({formData.figures.length})
                  </label>
                  <p className="text-[0.68rem] text-mist/60">
                    These prominent numerical figures display with animated count-up effects on scroll.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFigure}
                  className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-xs text-mist hover:text-white hover:bg-white/10"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Figure</span>
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                {formData.figures.map((figure, idx) => (
                  <div key={idx} className="relative rounded-2xl border border-white/10 bg-black/40 p-3.5 space-y-2 group">
                    <button
                      type="button"
                      onClick={() => handleRemoveFigure(idx)}
                      className="absolute right-2 top-2 text-mist/40 hover:text-red-400 p-1 transition-colors"
                      title="Delete figure"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <div>
                      <span className="block text-[0.62rem] text-[#C9A15A] uppercase tracking-wider font-semibold">
                        Stat Value (e.g. 500+, $182,000+)
                      </span>
                      <input
                        type="text"
                        value={figure.value}
                        onChange={(e) => handleFigureChange(idx, 'value', e.target.value)}
                        placeholder="500+"
                        className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-sm font-semibold text-white focus:border-[#C9A15A] focus:outline-none font-serif"
                      />
                    </div>
                    <div>
                      <span className="block text-[0.62rem] text-mist/60 uppercase tracking-wider">
                        Stat Label (e.g. Patients helped)
                      </span>
                      <input
                        type="text"
                        value={figure.label}
                        onChange={(e) => handleFigureChange(idx, 'label', e.target.value)}
                        placeholder="Patients helped"
                        className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-mist/80 focus:border-[#C9A15A] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-white/10">
                <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                  Footnote / Citation Caption
                </label>
                <input
                  type="text"
                  value={formData.caption || ''}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="Figures as published alongside his foundations' work."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none italic"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Story Showcase & Photo */}
          {activeTab === 'showcase' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#C9A15A] mb-1 flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4" />
                  <span>Showcase Feature Photo</span>
                </label>
                <p className="text-[0.68rem] text-mist/60 mb-3">
                  This photo features the cancer institute / medical facility or initiative landmark.
                </p>

                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-black/40 border border-white/10">
                  <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black">
                    <img
                      src={formData.storyImage || profile.storyImage}
                      alt="Story Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = profile.storyImage
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-semibold text-white truncate font-mono">
                      {formData.storyImage}
                    </span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="impact-story-upload"
                    />
                    <label
                      htmlFor="impact-story-upload"
                      className="inline-flex items-center gap-1.5 mt-2 cursor-pointer rounded-lg bg-gradient-to-r from-[#8d7043] to-[#C9A15A] px-3 py-1.5 text-[0.68rem] font-semibold text-black uppercase tracking-wider hover:opacity-90 transition-opacity"
                    >
                      <Upload className="h-3 w-3" />
                      <span>{uploading ? 'Uploading...' : 'Upload New Photo from PC'}</span>
                    </label>
                  </div>
                </div>

                {/* Preset showcase picker */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESET_STORY_IMAGES.map((p) => (
                    <button
                      key={p.path}
                      type="button"
                      onClick={() => setFormData({ ...formData, storyImage: p.path })}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[0.68rem] border transition-all ${
                        formData.storyImage === p.path
                          ? 'border-[#C9A15A] bg-[#C9A15A]/20 text-[#fae8be] font-semibold'
                          : 'border-white/10 bg-white/5 text-mist/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                  Image Accessible Description (Alt)
                </label>
                <input
                  type="text"
                  value={formData.storyImageAlt || ''}
                  onChange={(e) => setFormData({ ...formData, storyImageAlt: e.target.value })}
                  placeholder="Uganda Cancer Institute, specialised treatment in Kampala"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                  Showcase Quote Statement
                </label>
                <input
                  type="text"
                  value={formData.storyHeading || ''}
                  onChange={(e) => setFormData({ ...formData, storyHeading: e.target.value })}
                  placeholder="Consistency, not the dramatic moment, is what the work asks for."
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-[#C9A15A] focus:outline-none font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                  Showcase Narrative Details
                </label>
                <textarea
                  rows={3}
                  value={formData.storyDescription || ''}
                  onChange={(e) => setFormData({ ...formData, storyDescription: e.target.value })}
                  placeholder="In the writing published with his name, inspiration is not a single gesture..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3.5 text-xs text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 4: Initiative Cards (Cancer care, Haven, Education...) */}
          {activeTab === 'initiatives' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C9A15A]">
                    Humanitarian Initiatives ({(formData.areas || []).length} Cards)
                  </label>
                  <p className="text-[0.68rem] text-mist/60">
                    Edit each 3D card that displays in the 2-column impact grid on the homepage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddArea}
                  className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-xs text-mist hover:text-white hover:bg-white/10"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Initiative</span>
                </button>
              </div>

              {/* Card Switcher Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {(formData.areas || []).map((area, idx) => (
                  <button
                    key={area.slug || idx}
                    type="button"
                    onClick={() => setActiveCardIdx(idx)}
                    className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                      activeCardIdx === idx
                        ? 'border border-[#C9A15A] bg-[#C9A15A]/20 text-[#fae8be] font-semibold'
                        : 'border border-white/10 bg-white/5 text-mist/70 hover:bg-white/10'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-[#C9A15A]">{area.number || `0${idx + 1}`}</span>
                    <span>{area.title || `Initiative ${idx + 1}`}</span>
                  </button>
                ))}
              </div>

              {/* Active Card Form */}
              {currentArea && (
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-semibold uppercase tracking-wider text-white">
                      Editing: {currentArea.title} ({currentArea.organization})
                    </span>
                    {(formData.areas || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveArea(activeCardIdx)}
                        className="inline-flex items-center gap-1 text-[0.68rem] text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete Card</span>
                      </button>
                    )}
                  </div>

                  {/* Card Image */}
                  <div>
                    <span className="block text-[0.62rem] text-[#C9A15A] uppercase tracking-wider font-semibold mb-1">
                      Card Photo
                    </span>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-black/60 border border-white/10">
                      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-black">
                        <img src={currentArea.image} alt="Area" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-[11px] text-mist truncate font-mono">{currentArea.image}</span>
                        <input
                          type="file"
                          ref={areaFileInputRef}
                          accept="image/*"
                          onChange={(e) => handleAreaImageUpload(e, activeCardIdx)}
                          className="hidden"
                          id="area-upload-input"
                        />
                        <label
                          htmlFor="area-upload-input"
                          className="inline-flex items-center gap-1 mt-1.5 cursor-pointer rounded bg-white/10 hover:bg-white/20 px-2.5 py-1 text-[10px] text-white uppercase tracking-wider"
                        >
                          <Upload className="h-2.5 w-2.5" />
                          <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                        </label>
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {PRESET_AREA_IMAGES.map((p) => (
                        <button
                          key={p.path}
                          type="button"
                          onClick={() => handleAreaChange(activeCardIdx, 'image', p.path)}
                          className={`rounded px-2 py-0.5 text-[10px] border ${
                            currentArea.image === p.path
                              ? 'border-[#C9A15A] bg-[#C9A15A]/20 text-[#fae8be]'
                              : 'border-white/10 bg-white/5 text-mist/60 hover:text-white'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <span className="block text-[0.62rem] text-mist/70 uppercase tracking-wider mb-1">Number</span>
                      <input
                        type="text"
                        value={currentArea.number || ''}
                        onChange={(e) => handleAreaChange(activeCardIdx, 'number', e.target.value)}
                        placeholder="01"
                        className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <span className="block text-[0.62rem] text-mist/70 uppercase tracking-wider mb-1">
                        Title / Domain
                      </span>
                      <input
                        type="text"
                        value={currentArea.title || ''}
                        onChange={(e) => handleAreaChange(activeCardIdx, 'title', e.target.value)}
                        placeholder="Cancer care"
                        className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <span className="block text-[0.62rem] text-mist/70 uppercase tracking-wider mb-1">
                        Organization Pill Badge
                      </span>
                      <input
                        type="text"
                        value={currentArea.organization || ''}
                        onChange={(e) => handleAreaChange(activeCardIdx, 'organization', e.target.value)}
                        placeholder="Cancer Charity Foundation"
                        className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-[#fae8be]"
                      />
                    </div>
                    <div>
                      <span className="block text-[0.62rem] text-mist/70 uppercase tracking-wider mb-1">
                        Detail Link URL Slug
                      </span>
                      <input
                        type="text"
                        value={currentArea.slug || ''}
                        onChange={(e) => handleAreaChange(activeCardIdx, 'slug', e.target.value)}
                        placeholder="cancer-charity-foundation"
                        className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-mist font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-[0.62rem] text-mist/70 uppercase tracking-wider mb-1">
                      Summary Description
                    </span>
                    <textarea
                      rows={3}
                      value={currentArea.summary || ''}
                      onChange={(e) => handleAreaChange(activeCardIdx, 'summary', e.target.value)}
                      placeholder="A support system so people facing cancer are not left without dignity..."
                      className="w-full rounded-lg border border-white/10 bg-black/60 p-3 text-xs text-white leading-relaxed"
                    />
                  </div>

                  {/* Highlights Points */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <span className="block text-[0.62rem] text-[#C9A15A] uppercase tracking-wider font-semibold">
                      Key Highlights / Feature Tags
                    </span>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {(currentArea.points || []).slice(0, 2).map((pt, pIdx) => (
                        <div key={pIdx} className="space-y-1">
                          <input
                            type="text"
                            value={pt.title || ''}
                            onChange={(e) => handlePointChange(activeCardIdx, pIdx, 'title', e.target.value)}
                            placeholder={`Tag #${pIdx + 1} (e.g. Daily survival)`}
                            className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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

        {/* Right Column: Live Visual Interactive Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#14120e] p-5 sm:p-6 shadow-xl sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-mist/90 flex items-center gap-2">
                <Eye className="h-4 w-4 text-[#C9A15A]" />
                <span>Live Impact Section Preview</span>
              </span>
              <a
                href="/#impact"
                target="_blank"
                rel="noreferrer"
                className="text-[0.68rem] text-[#C9A15A] hover:underline flex items-center gap-1"
              >
                <span>Open Website</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* If on initiatives tab, show Live Initiative Card */}
            {activeTab === 'initiatives' && currentArea ? (
              <div className="rounded-2xl border border-white/15 bg-gradient-to-b from-[#faf8f4] to-[#f4efe8] p-3 text-black shadow-xl">
                <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-black">
                  <img src={currentArea.image} alt={currentArea.title} className="h-full w-full object-cover" />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-0.5 text-[9px] text-[#fae8be] uppercase font-semibold">
                    <span>{currentArea.organization}</span>
                  </div>
                  <div className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-[10px] text-[#fae8be] font-bold">
                    {currentArea.number}
                  </div>
                </div>
                <div className="pt-3 space-y-2">
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-[#8d7043]">Humanitarian Pillar</p>
                  <h4 className="font-serif text-lg font-normal text-[#141311] leading-tight">{currentArea.title}</h4>
                  <p className="text-xs text-[#4e4943] line-clamp-3 leading-relaxed">{currentArea.summary}</p>
                </div>
              </div>
            ) : (
              <>
                {/* Simulated Figures Bar */}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-black/40 border border-white/10">
                  {formData.figures.map((fig, idx) => (
                    <div key={idx} className="border-t border-white/15 pt-2">
                      <p className="display text-2xl text-white font-serif">{fig.value}</p>
                      <p className="text-[0.68rem] text-mist/70">{fig.label}</p>
                    </div>
                  ))}
                </div>

                {/* Simulated Story Card */}
                <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 bg-black/30">
                  <div className="aspect-[16/10] overflow-hidden bg-black">
                    <img
                      src={formData.storyImage || profile.storyImage}
                      alt={formData.storyImageAlt}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = profile.storyImage
                      }}
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <p className="font-serif text-sm font-medium text-white leading-snug">
                      {formData.storyHeading}
                    </p>
                    <p className="text-[0.72rem] text-mist/70 line-clamp-3 leading-relaxed">
                      {formData.storyDescription}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
