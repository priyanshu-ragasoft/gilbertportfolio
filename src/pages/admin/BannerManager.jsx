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
  ChevronLeft,
  ChevronRight,
  Clock,
  Play,
  CheckCircle2,
  X,
} from 'lucide-react'
import { bannerAPI } from '../../services/api'
import { profile } from '../../data/profile'

const DEFAULT_BANNER = {
  kicker: 'HUMANITARIAN • CONSULTANT • SOCIAL IMPACT',
  heading: 'Turning Purpose Into Meaningful Impact.',
  lines: ['Turning Purpose', 'Into Meaningful', 'Impact.'],
  description:
    'Gilbert Kevin Jimmy Kwizera builds practical support for people at their most vulnerable — in cancer care, recovery, education, and the quiet work of protecting dignity.',
  primaryButtonText: 'Explore My Journey',
  primaryButtonLink: '/#journey',
  secondaryButtonText: "Let's Connect",
  secondaryButtonLink: '/contact',
  image: '/src/assets/images/gilbert-kwizera-executive.jpg',
  images: [
    '/src/assets/images/gilbert-kwizera-executive.jpg',
    '/src/assets/images/gilbert-kwizera-lounge-armchair.jpg',
    '/src/assets/images/gilbert-kwizera-office-standing.jpg',
  ],
  autoSlideInterval: 5000,
}

const PRESET_IMAGES = [
  { label: 'Executive Formal Portrait', path: '/src/assets/images/gilbert-kwizera-executive.jpg' },
  { label: 'Lounge Armchair Reflection', path: '/src/assets/images/gilbert-kwizera-lounge-armchair.jpg' },
  { label: 'Office Standing with African Art', path: '/src/assets/images/gilbert-kwizera-office-standing.jpg' },
  { label: 'Dubai Downtown Walking', path: '/src/assets/images/gilbert-kwizera-dubai-walking.jpg' },
  { label: 'Dubai Marina Yacht Outreach', path: '/src/assets/images/gilbert-kwizera-dubai-marina-yacht.jpg' },
  { label: 'Hotel Marble Entrance', path: '/src/assets/images/gilbert-kwizera-hotel-entrance.jpg' },
]

export default function BannerManager() {
  const [formData, setFormData] = useState(() => {
    const cached = typeof window !== 'undefined' ? (localStorage.getItem('gilbert_cached_banner') || localStorage.getItem('krinova_cached_banner')) : null
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        return {
          ...DEFAULT_BANNER,
          ...parsed,
          images: parsed.images?.length ? parsed.images : [parsed.image || DEFAULT_BANNER.image],
        }
      } catch (e) {}
    }
    return DEFAULT_BANNER
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [customImageUrl, setCustomImageUrl] = useState('')
  const [notification, setNotification] = useState({ message: '', type: '' })
  const [activeSlide, setActiveSlide] = useState(0)

  const fileInputRef = useRef(null)
  const lastTapRef = useRef({})

  // Fetch current active banner
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await bannerAPI.getBanner()
        if (res.success && res.data) {
          const bannerData = res.data
          const imagesList =
            bannerData.images?.length > 0
              ? bannerData.images
              : bannerData.image
              ? [bannerData.image]
              : DEFAULT_BANNER.images

          setFormData({
            ...DEFAULT_BANNER,
            ...bannerData,
            images: imagesList,
            image: imagesList[0] || DEFAULT_BANNER.image,
            lines: bannerData.lines?.length ? bannerData.lines : DEFAULT_BANNER.lines,
            autoSlideInterval: bannerData.autoSlideInterval || 5000,
          })
        }
      } catch (err) {
        console.warn('Using local banner defaults:', err.message)
        const cached = localStorage.getItem('gilbert_cached_banner') || localStorage.getItem('krinova_cached_banner')
        if (cached) {
          try {
            const parsed = JSON.parse(cached)
            setFormData({
              ...DEFAULT_BANNER,
              ...parsed,
              images: parsed.images?.length ? parsed.images : [parsed.image || DEFAULT_BANNER.image],
            })
          } catch (e) {}
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBanner()
  }, [])

  // Auto rotate preview slider
  useEffect(() => {
    if (!formData.images || formData.images.length <= 1) return undefined
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % formData.images.length)
    }, formData.autoSlideInterval || 5000)
    return () => clearInterval(timer)
  }, [formData.images, formData.autoSlideInterval])

  // Handle heading change
  const handleHeadingChange = (newHeading) => {
    const words = newHeading.trim().split(' ')
    let computedLines = [newHeading]
    if (words.length >= 3) {
      const mid1 = Math.ceil(words.length / 3)
      const mid2 = Math.ceil((words.length * 2) / 3)
      computedLines = [
        words.slice(0, mid1).join(' '),
        words.slice(mid1, mid2).join(' '),
        words.slice(mid2).join(' '),
      ].filter(Boolean)
    }
    setFormData((prev) => ({
      ...prev,
      heading: newHeading,
      lines: computedLines,
    }))
  }

  // Handle manual line change
  const handleLineChange = (index, value) => {
    const newLines = [...formData.lines]
    newLines[index] = value
    setFormData((prev) => ({
      ...prev,
      lines: newLines,
      heading: newLines.join(' '),
    }))
  }

  // Synchronize and persist banner changes both locally and to MongoDB API
  const persistBannerChanges = async (updatedData, showSuccessNotice = false) => {
    const payload = {
      ...updatedData,
      image: updatedData.images?.[0] || updatedData.image || DEFAULT_BANNER.image,
    }

    setFormData(payload)
    try {
      localStorage.setItem('gilbert_cached_banner', JSON.stringify(payload))
      window.dispatchEvent(new CustomEvent('gilbert_banner_updated', { detail: payload }))
    } catch (e) {}

    try {
      await bannerAPI.updateBanner(payload)
      if (showSuccessNotice) {
        setNotification({ message: 'Banner saved & published live to database!', type: 'success' })
      }
    } catch (err) {
      console.warn('[Banner Save Sync]: Saved locally & cached.', err.message)
      if (showSuccessNotice) {
        setNotification({ message: 'Banner saved locally and published live!', type: 'success' })
      }
    }
  }

  // Handle File Upload from Local PC
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setNotification({ message: '', type: '' })

    const uploadPayload = new FormData()
    uploadPayload.append('image', file)

    try {
      const res = await bannerAPI.uploadImage(uploadPayload)
      if (res.success && res.url) {
        const newImages = [...formData.images, res.url]
        const nextData = {
          ...formData,
          images: newImages,
          image: newImages[0],
        }
        await persistBannerChanges(nextData)
        setNotification({ message: 'Image uploaded & added to live slider!', type: 'success' })
      }
    } catch (err) {
      const localUrl = URL.createObjectURL(file)
      const newImages = [...formData.images, localUrl]
      const nextData = {
        ...formData,
        images: newImages,
        image: newImages[0],
      }
      await persistBannerChanges(nextData)
      setNotification({ message: 'Image loaded locally for preview & testing', type: 'success' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Add custom URL
  const handleAddCustomUrl = () => {
    if (!customImageUrl.trim()) return
    if (!formData.images.includes(customImageUrl.trim())) {
      const newImages = [...formData.images, customImageUrl.trim()]
      const nextData = {
        ...formData,
        images: newImages,
        image: newImages[0],
      }
      persistBannerChanges(nextData)
    }
    setCustomImageUrl('')
  }

  // Toggle or deselect preset image (single click, double click, double tap)
  const handleTogglePreset = (presetPath, forceAction = null) => {
    const isCurrentlyAdded = formData.images.includes(presetPath)
    
    // If forceAction is 'remove' or it's currently added and we're toggling:
    if (forceAction === 'remove' || (forceAction === null && isCurrentlyAdded)) {
      if (formData.images.length <= 1) {
        alert('Banner must have at least one background image in the slider.')
        return
      }
      const newImages = formData.images.filter((img) => img !== presetPath)
      const nextData = {
        ...formData,
        images: newImages,
        image: newImages[0] || formData.image,
      }
      if (activeSlide >= newImages.length) {
        setActiveSlide(0)
      }
      persistBannerChanges(nextData)
      return
    }

    // Otherwise add if not present
    if (!isCurrentlyAdded) {
      const newImages = [...formData.images, presetPath]
      const nextData = {
        ...formData,
        images: newImages,
        image: newImages[0],
      }
      persistBannerChanges(nextData)
    }
  }

  // Handle touch double-tap
  const handleTouchPreset = (presetPath) => {
    const now = Date.now()
    const lastTap = lastTapRef.current[presetPath] || 0
    if (now - lastTap < 350) {
      handleTogglePreset(presetPath)
      lastTapRef.current[presetPath] = 0
    } else {
      lastTapRef.current[presetPath] = now
      handleTogglePreset(presetPath)
    }
  }

  // Remove image from slider and immediately persist to DB & LocalStorage
  const handleRemoveImage = (index) => {
    if (formData.images.length <= 1) {
      alert('Banner must have at least one background image.')
      return
    }
    const newImages = formData.images.filter((_, i) => i !== index)
    const nextData = {
      ...formData,
      images: newImages,
      image: newImages[0],
    }
    if (activeSlide >= newImages.length) {
      setActiveSlide(0)
    }
    persistBannerChanges(nextData)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setNotification({ message: '', type: '' })

    await persistBannerChanges(formData, true)
    setSaving(false)
  }

  const handleReset = () => {
    if (window.confirm('Reset banner settings to original executive default?')) {
      persistBannerChanges(DEFAULT_BANNER, true)
      setActiveSlide(0)
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#C9A15A] uppercase mb-1">
            <Sliders className="h-3.5 w-3.5" />
            <span>Homepage Hero &amp; Multi-Image Slider</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-white font-normal">
            Hero Banner &amp; Image Slider Manager
          </h1>
          <p className="mt-1 text-xs text-mist/70 font-light">
            Upload custom banner images from PC, manage background slider carousel, and update headlines in real-time.
          </p>
        </div>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8d7043] to-[#C9A15A] px-6 py-2.5 text-xs font-semibold text-black uppercase tracking-wider hover:opacity-95 disabled:opacity-50 transition-opacity shadow-lg sm:w-auto"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification.message && (
        <div
          className={`flex items-center gap-3 rounded-2xl p-4 text-xs ${
            notification.type === 'success'
              ? 'border border-emerald-500/40 bg-emerald-950/60 text-emerald-200'
              : 'border border-red-500/40 bg-red-950/60 text-red-200'
          }`}
        >
          <Check className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Grid: Editor Form & Live Simulator */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Form Controls */}
        <form onSubmit={handleSave} className="lg:col-span-6 min-w-0 space-y-6 rounded-3xl border border-white/10 bg-[#14120e] p-4 sm:p-7 shadow-xl">
          <div className="space-y-6">
            {/* Multi-Image Slider & Upload Section */}
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#C9A15A] flex items-start gap-1.5">
                    <Layers className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>Banner images ({formData.images.length} in slider)</span>
                  </label>
                  <p className="text-[0.68rem] text-mist/60 mt-0.5">
                    Website par background images automatically smooth crossfade slider me chalengi.
                  </p>
                </div>

                {/* Upload from PC Button */}
                <div className="w-full sm:w-auto">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="banner-file-input"
                  />
                  <label
                    htmlFor="banner-file-input"
                    className={`inline-flex w-full items-center justify-center gap-1.5 cursor-pointer rounded-xl bg-gradient-to-r from-[#8d7043] to-[#C9A15A] px-3.5 py-2 text-xs font-semibold text-black uppercase tracking-wider hover:opacity-90 transition-opacity sm:w-auto ${
                      uploading ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{uploading ? 'Uploading...' : 'Upload from PC'}</span>
                  </label>
                </div>
              </div>

              {/* Slider Images List */}
              <div className="grid gap-2.5 sm:grid-cols-2 pt-2">
                {formData.images.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className={`group relative flex items-center gap-2.5 rounded-xl border p-2 transition-all ${
                      activeSlide === idx
                        ? 'border-[#C9A15A] bg-[#C9A15A]/15 shadow-md'
                        : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <div className="h-12 w-14 shrink-0 overflow-hidden rounded-lg bg-black">
                      <img src={imgSrc} alt={`Slide ${idx + 1}`} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <span className="block text-[0.68rem] font-semibold text-white">Slide {idx + 1}</span>
                      <span className="block text-[0.62rem] text-mist/50 truncate font-mono">{imgSrc}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-mist/40 hover:text-red-400 p-1"
                      title="Remove image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Slider Interval Selector */}
              <div className="flex flex-col gap-2 pt-3 border-t border-white/5 text-xs sm:flex-row sm:items-center sm:justify-between">
                <span className="text-mist/70 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-[#C9A15A]" />
                  <span>Auto-slide speed</span>
                </span>
                <select
                  value={formData.autoSlideInterval || 5000}
                  onChange={(e) => setFormData({ ...formData, autoSlideInterval: Number(e.target.value) })}
                  className="w-full rounded-lg border border-white/10 bg-black/60 px-3 py-2 text-xs text-white focus:border-[#C9A15A] focus:outline-none sm:w-auto"
                >
                  <option value={3000}>3 Seconds (Fast)</option>
                  <option value={5000}>5 Seconds (Standard)</option>
                  <option value={7000}>7 Seconds (Smooth Luxury)</option>
                  <option value={10000}>10 Seconds (Slow Ambient)</option>
                </select>
              </div>

              {/* Preset Image Picker Quick Buttons */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="block text-[0.68rem] text-mist/70 uppercase tracking-wider font-semibold">
                    Available Portrait Presets:
                  </span>
                  <span className="text-[0.62rem] text-[#C9A15A] font-medium">
                    Tap to select or remove
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PRESET_IMAGES.map((preset) => {
                    const isAdded = formData.images.includes(preset.path)
                    return (
                      <div
                        key={preset.path}
                        onClick={() => handleTogglePreset(preset.path)}
                        onDoubleClick={(e) => {
                          e.preventDefault()
                          handleTogglePreset(preset.path, isAdded ? 'remove' : null)
                        }}
                        onTouchEnd={() => handleTouchPreset(preset.path)}
                        className={`group inline-flex items-center gap-1.5 cursor-pointer rounded-lg px-2.5 py-1 text-[0.68rem] border select-none transition-all duration-200 ${
                          isAdded
                            ? 'border-emerald-500/70 bg-emerald-950/40 text-emerald-300 hover:border-red-500/60 hover:bg-red-950/40 hover:text-red-200 shadow-sm'
                            : 'border-white/10 bg-white/5 text-mist/80 hover:border-[#C9A15A] hover:bg-[#C9A15A]/10 hover:text-white'
                        }`}
                        title={
                          isAdded
                            ? 'Selected (Click or Double-Tap to Deselect / Remove)'
                            : 'Click / Tap to Add to Slider'
                        }
                      >
                        {isAdded ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 group-hover:hidden" />
                            <X className="h-3.5 w-3.5 text-red-400 hidden group-hover:inline" />
                          </>
                        ) : (
                          <Plus className="h-3.5 w-3.5 text-mist/60 group-hover:text-white" />
                        )}
                        <span>{preset.label}</span>
                        {isAdded && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTogglePreset(preset.path, 'remove')
                            }}
                            title="Remove / Deselect"
                            className="ml-1 rounded-full p-0.5 hover:bg-red-500/30 text-emerald-300 group-hover:text-red-300 transition-colors"
                          >
                            <X className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Kicker / Eyebrow */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-mist/80 mb-2">
                Eyebrow / Kicker (Top Text)
              </label>
              <input
                type="text"
                required
                value={formData.kicker}
                onChange={(e) => setFormData({ ...formData, kicker: e.target.value })}
                placeholder="HUMANITARIAN • CONSULTANT • SOCIAL IMPACT"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none"
              />
            </div>

            {/* Main Heading Input */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-mist/80 mb-2">
                Main Hero Headline
              </label>
              <input
                type="text"
                required
                value={formData.heading}
                onChange={(e) => handleHeadingChange(e.target.value)}
                placeholder="Turning Purpose Into Meaningful Impact."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none"
              />
            </div>

            {/* Line-by-Line Break Configuration */}
            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 space-y-3">
              <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-[#C9A15A]">
                Animated Text Lines (3 Rows)
              </label>
              {formData.lines?.map((line, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[0.65rem] font-mono text-mist/50 w-12 shrink-0">Line {idx + 1}:</span>
                  <input
                    type="text"
                    value={line}
                    onChange={(e) => handleLineChange(idx, e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white"
                  />
                </div>
              ))}
            </div>

            {/* Hero Description */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-mist/80 mb-2">
                Hero Subtitle / Description
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Gilbert Kevin Jimmy Kwizera builds practical support..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none leading-relaxed"
              />
            </div>

            {/* Action Buttons Section */}
            <div className="grid gap-4 sm:grid-cols-2 p-4 rounded-2xl bg-black/30 border border-white/5">
              <div>
                <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-[#fae8be] mb-1.5">
                  Primary Button
                </label>
                <input
                  type="text"
                  value={formData.primaryButtonText}
                  onChange={(e) => setFormData({ ...formData, primaryButtonText: e.target.value })}
                  placeholder="Label (e.g. Explore My Journey)"
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white mb-2"
                />
                <input
                  type="text"
                  value={formData.primaryButtonLink}
                  onChange={(e) => setFormData({ ...formData, primaryButtonLink: e.target.value })}
                  placeholder="Link (e.g. /#journey)"
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white/80 font-mono"
                />
              </div>

              <div>
                <label className="block text-[0.68rem] font-semibold uppercase tracking-wider text-[#fae8be] mb-1.5">
                  Secondary Button
                </label>
                <input
                  type="text"
                  value={formData.secondaryButtonText}
                  onChange={(e) => setFormData({ ...formData, secondaryButtonText: e.target.value })}
                  placeholder="Label (e.g. Let's Connect)"
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white mb-2"
                />
                <input
                  type="text"
                  value={formData.secondaryButtonLink}
                  onChange={(e) => setFormData({ ...formData, secondaryButtonLink: e.target.value })}
                  placeholder="Link (e.g. /contact)"
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white/80 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8d7043] to-[#C9A15A] px-6 py-2.5 text-xs font-semibold text-black uppercase tracking-wider hover:opacity-95 disabled:opacity-50 transition-opacity"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save & Publish Live'}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live Visual Simulator Preview */}
        <div className="lg:col-span-6 min-w-0 space-y-4 lg:sticky lg:top-28">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif text-white font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#C9A15A]" />
              <span>Live Visual Slider Simulator</span>
            </h3>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-[0.68rem] font-semibold text-[#C9A15A] hover:underline flex items-center gap-1"
            >
              <span>Open Website</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Simulated Hero Slider Card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#0d0c0a] aspect-[16/11] sm:aspect-[16/10] shadow-2xl flex flex-col justify-end p-6 sm:p-8 text-paper select-none">
            {/* Background Images Crossfade */}
            {formData.images.map((src, i) => (
              <img
                key={src + i}
                src={src}
                alt={`Hero Slide ${i + 1}`}
                className={`absolute inset-0 h-full w-full object-cover object-[66%_14%] transition-opacity duration-1000 ease-in-out ${
                  activeSlide === i ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

            {/* Slider Badges & Controls */}
            <div className="absolute top-4 inset-x-4 z-10 flex items-center justify-between">
              <div className="rounded-full bg-black/60 px-3 py-1 text-[0.6rem] font-semibold text-[#fae8be] border border-white/10 backdrop-blur-md flex items-center gap-1.5">
                <Play className="h-2.5 w-2.5 fill-[#fae8be]" />
                <span>Slider Active (Slide {activeSlide + 1} of {formData.images.length})</span>
              </div>

              {/* Slider Dot Indicators */}
              <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
                {formData.images.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setActiveSlide(dotIdx)}
                    className={`h-2 rounded-full transition-all ${
                      activeSlide === dotIdx ? 'w-5 bg-[#C9A15A]' : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Simulated Hero Text Content */}
            <div className="relative z-10 space-y-3">
              <p className="text-[0.55rem] sm:text-[0.65rem] font-semibold tracking-[0.2em] text-paper/85 uppercase">
                {formData.kicker}
              </p>

              <h2 className="display text-2xl sm:text-4xl text-white font-normal leading-[1.08]">
                {formData.lines?.map((line, idx) => (
                  <span key={idx} className="block">
                    {line}
                  </span>
                ))}
              </h2>

              <p className="text-[0.7rem] sm:text-xs text-paper/80 font-light max-w-sm line-clamp-3 leading-relaxed">
                {formData.description}
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-paper px-3.5 py-1.5 text-[0.65rem] font-semibold text-ink shadow">
                  {formData.primaryButtonText}
                </span>
                <span className="rounded-full border border-paper/60 px-3.5 py-1.5 text-[0.65rem] font-semibold text-paper">
                  {formData.secondaryButtonText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
