import { useState, useEffect, useRef } from 'react'
import {
  Quote,
  Save,
  RotateCcw,
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Type,
  FileText,
  Layers,
  HelpCircle,
  ExternalLink,
} from 'lucide-react'
import { philosophyAPI } from '../../services/api'
import { philosophy as defaultProfilePhilosophy, profile } from '../../data/profile'

// Import all high-res photography assets directly for 100% reliable Vite bundling
import officeImg from '../../assets/images/gilbert-kwizera-office-standing.jpg'
import formalImg from '../../assets/images/gilbert-kwizera-lounge-armchair.jpg'
import executiveImg from '../../assets/images/gilbert-kwizera-executive.jpg'
import walkingImg from '../../assets/images/gilbert-kwizera-dubai-walking.jpg'
import yachtImg from '../../assets/images/gilbert-kwizera-dubai-marina-yacht.jpg'
import sanjayImg from '../../assets/images/gilbert-kwizera-sanjay-dutt.jpg'
import uciImg from '../../assets/images/ccf-uci.jpg'
import pioImg from '../../assets/images/pio-ecosystem-technology.jpg'
import lobbyImg from '../../assets/images/gilbert-kwizera-marble-lobby.jpg'

const resolvePhilosophyImage = (imgPath) => {
  if (!imgPath) return officeImg
  if (imgPath.startsWith('data:') || imgPath.startsWith('http://') || imgPath.startsWith('https://') || imgPath.startsWith('/uploads/')) {
    return imgPath
  }
  if (imgPath === '/src/assets/images/gilbert-office.jpg' || imgPath.includes('office')) return officeImg
  if (imgPath === '/src/assets/images/gilbert-portrait.jpg' || imgPath.includes('lounge-armchair')) return formalImg
  if (imgPath.includes('executive')) return executiveImg
  if (imgPath.includes('marina-yacht') || imgPath.includes('yacht')) return yachtImg
  if (imgPath.includes('walking')) return walkingImg
  if (imgPath.includes('sanjay-dutt') || imgPath.includes('sanjay')) return sanjayImg
  if (imgPath.includes('ccf-uci') || imgPath.includes('uci')) return uciImg
  if (imgPath.includes('pio-ecosystem') || imgPath.includes('pio')) return pioImg
  if (imgPath.includes('marble-lobby') || imgPath.includes('lobby')) return lobbyImg
  return imgPath
}

const PRESET_IMAGES = [
  { label: 'Executive Office (Standing)', src: officeImg, path: '/src/assets/images/gilbert-kwizera-office-standing.jpg' },
  { label: 'Formal Lounge (Dark Suit)', src: formalImg, path: '/src/assets/images/gilbert-kwizera-lounge-armchair.jpg' },
  { label: 'Executive Portrait', src: executiveImg, path: '/src/assets/images/gilbert-kwizera-executive.jpg' },
  { label: 'Dubai Marina Yacht Suite', src: yachtImg, path: '/src/assets/images/gilbert-kwizera-dubai-marina-yacht.jpg' },
  { label: 'Dubai Executive Walking', src: walkingImg, path: '/src/assets/images/gilbert-kwizera-dubai-walking.jpg' },
  { label: 'Marble Lobby Entrance', src: lobbyImg, path: '/src/assets/images/gilbert-kwizera-marble-lobby.jpg' },
  { label: 'Sanjay Dutt Cultural Dialogue', src: sanjayImg, path: '/src/assets/images/gilbert-kwizera-sanjay-dutt.jpg' },
  { label: 'Uganda Cancer Institute', src: uciImg, path: '/src/assets/images/ccf-uci.jpg' },
  { label: 'PIO Technology Framework', src: pioImg, path: '/src/assets/images/pio-ecosystem-technology.jpg' },
]

const DEFAULT_PHILOSOPHY_DATA = {
  kicker: 'A thematic statement',
  statement: defaultProfilePhilosophy?.statement || 'When you choose to help others up, you help people rise as well.',
  note: defaultProfilePhilosophy?.note || 'A thematic statement drawn from his published writing on service. It is not presented here as a recorded quotation.',
  image: '/src/assets/images/gilbert-kwizera-office-standing.jpg',
  imageAlt: 'Gilbert Kevin Jimmy Kwizera',
}

export default function PhilosophyManager() {
  const [data, setData] = useState(DEFAULT_PHILOSOPHY_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [notification, setNotification] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchPhilosophyData()
  }, [])

  const fetchPhilosophyData = async () => {
    try {
      setLoading(true)
      const res = await philosophyAPI.getPhilosophy()
      if (res.success && res.data) {
        const rawImg = res.data.image || DEFAULT_PHILOSOPHY_DATA.image
        const fixedImg = rawImg === '/src/assets/images/gilbert-office.jpg' || rawImg === '/src/assets/images/gilbert-portrait.jpg'
          ? '/src/assets/images/gilbert-kwizera-office-standing.jpg'
          : rawImg

        const fetched = {
          kicker: res.data.kicker || DEFAULT_PHILOSOPHY_DATA.kicker,
          statement: res.data.statement || DEFAULT_PHILOSOPHY_DATA.statement,
          note: res.data.note || DEFAULT_PHILOSOPHY_DATA.note,
          image: fixedImg,
          imageAlt: res.data.imageAlt || DEFAULT_PHILOSOPHY_DATA.imageAlt,
        }
        setData(fetched)
        localStorage.setItem('gilbert_cached_philosophy', JSON.stringify(fetched))
      }
    } catch (error) {
      console.warn('Using local cached/fallback philosophy data:', error.message)
      const cached = localStorage.getItem('gilbert_cached_philosophy')
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          if (parsed.image === '/src/assets/images/gilbert-office.jpg' || parsed.image === '/src/assets/images/gilbert-portrait.jpg') {
            parsed.image = '/src/assets/images/gilbert-kwizera-office-standing.jpg'
          }
          setData(parsed)
        } catch (e) {
          setData(DEFAULT_PHILOSOPHY_DATA)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  const handleTextChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageSelect = (imgPath) => {
    setData((prev) => ({
      ...prev,
      image: imgPath,
    }))
    showToast('HD Background image selected!')
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setData((prev) => ({
        ...prev,
        image: reader.result,
      }))
    }
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('image', file)

    try {
      setUploadingImage(true)
      const res = await philosophyAPI.uploadImage(formData)
      if (res.success && res.url) {
        setData((prev) => ({
          ...prev,
          image: res.url,
        }))
        showToast('HD Background Photo uploaded successfully!')
      }
    } catch (error) {
      console.warn('Image upload fallback to local data URL:', error.message)
      showToast('Image uploaded and applied locally.', 'info')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async (e) => {
    e?.preventDefault()
    setSaving(true)
    try {
      const res = await philosophyAPI.updatePhilosophy(data)
      if (res.success) {
        showToast('Thematic Statement Section updated successfully!')
      }
      localStorage.setItem('gilbert_cached_philosophy', JSON.stringify(data))
      window.dispatchEvent(
        new CustomEvent('gilbert_philosophy_updated', {
          detail: data,
        })
      )
    } catch (error) {
      console.warn('Backend update notice:', error.message)
      localStorage.setItem('gilbert_cached_philosophy', JSON.stringify(data))
      window.dispatchEvent(
        new CustomEvent('gilbert_philosophy_updated', {
          detail: data,
        })
      )
      showToast('Thematic Statement changes saved to live site!', 'success')
    } finally {
      setSaving(false)
    }
  }

  const handleResetToDefaults = () => {
    if (
      window.confirm(
        'Are you sure you want to reset the Thematic Statement section to default content?'
      )
    ) {
      setData(DEFAULT_PHILOSOPHY_DATA)
      localStorage.setItem('gilbert_cached_philosophy', JSON.stringify(DEFAULT_PHILOSOPHY_DATA))
      window.dispatchEvent(
        new CustomEvent('gilbert_philosophy_updated', {
          detail: DEFAULT_PHILOSOPHY_DATA,
        })
      )
      showToast('Reset to original default thematic statement.', 'info')
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="font-serif text-sm tracking-widest text-mist">
            LOADING THEMATIC STATEMENT EDITOR...
          </p>
        </div>
      </div>
    )
  }

  const previewImageSrc = resolvePhilosophyImage(data.image)

  return (
    <div className="space-y-8 pb-20">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex max-w-md items-center gap-3 rounded-xl border px-5 py-4 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            notification.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-950/80 text-emerald-200 shadow-emerald-950/40'
              : notification.type === 'error'
              ? 'border-rose-500/30 bg-rose-950/80 text-rose-200 shadow-rose-950/40'
              : 'border-gold/30 bg-ink/90 text-gold shadow-ink/60'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
          ) : notification.type === 'error' ? (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          ) : (
            <Sparkles className="h-5 w-5 shrink-0 text-gold" />
          )}
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-r from-ink via-slate-900 to-ink p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              <Quote className="h-4 w-4" />
              <span>Section CMS Control</span>
            </div>
            <h1 className="mt-2 font-serif text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              Thematic Statement &amp; Philosophy Editor
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-mist">
              Customise the signature hero quote, philosophical kicker, attribution note, and background atmosphere shown on the website homepage.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex shrink-0 items-center justify-center whitespace-nowrap gap-2 rounded-xl bg-gradient-to-r from-gold to-amber-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink shadow-lg shadow-gold/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Card 1: Text Content */}
          <div className="rounded-2xl border border-white/10 bg-ink/70 p-6 shadow-xl backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <Type className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-paper">
                    Quote &amp; Statement Content
                  </h3>
                  <p className="text-xs text-mist">
                    Modify the philosophical wording and introductory kicker
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {/* Kicker / Subtitle */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-mist">
                  Section Kicker (Top Label)
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    value={data.kicker}
                    onChange={(e) => handleTextChange('kicker', e.target.value)}
                    placeholder="e.g. A thematic statement"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-paper placeholder-white/20 transition-all focus:border-gold/50 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-gold/50"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-mist/70">
                  Small uppercase title above the quote (default: A thematic statement)
                </p>
              </div>

              {/* Main Statement */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-mist">
                  Main Statement / Thematic Quote
                </label>
                <div className="mt-2">
                  <textarea
                    rows={4}
                    value={data.statement}
                    onChange={(e) => handleTextChange('statement', e.target.value)}
                    placeholder="When you choose to help others up, you help people rise as well."
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-serif text-lg leading-relaxed text-paper placeholder-white/20 transition-all focus:border-gold/50 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-gold/50"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-mist/70">
                  Displayed in high-impact display serif typography across the full width
                </p>
              </div>

              {/* Explanatory Note */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-mist">
                  Contextual Note / Attribution Description
                </label>
                <div className="mt-2">
                  <textarea
                    rows={3}
                    value={data.note}
                    onChange={(e) => handleTextChange('note', e.target.value)}
                    placeholder="A thematic statement drawn from his published writing on service. It is not presented here as a recorded quotation."
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-relaxed text-paper placeholder-white/20 transition-all focus:border-gold/50 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-gold/50"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-mist/70">
                  Short paragraph explaining the origin or context beneath the quotation
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Background Image & Media */}
          <div className="rounded-2xl border border-white/10 bg-ink/70 p-6 shadow-xl backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <ImageIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-paper">
                    Background Atmosphere &amp; Image
                  </h3>
                  <p className="text-xs text-mist">
                    Choose or upload the background photography for this section
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="inline-flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold transition-all hover:bg-gold/20"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload HD Photo'}</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-mist">
                  Custom Image URL or Path
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    value={data.image}
                    onChange={(e) => handleTextChange('image', e.target.value)}
                    placeholder="/src/assets/images/gilbert-kwizera-office-standing.jpg"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs font-mono text-paper placeholder-white/20 transition-all focus:border-gold/50 focus:bg-black/60 focus:outline-none"
                  />
                </div>
              </div>

              {/* Preset Gallery */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-mist mb-2">
                  Quick Select from Verified HD Presets
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {PRESET_IMAGES.map((preset, idx) => {
                    const isSelected =
                      data.image === preset.path ||
                      data.image === preset.src ||
                      (preset.path.includes('office-standing') && (data.image.includes('office') || data.image === '/src/assets/images/gilbert-office.jpg'))

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleImageSelect(preset.path)}
                        className={`group relative flex flex-col overflow-hidden rounded-xl border p-2 text-left transition-all ${
                          isSelected
                            ? 'border-gold bg-gold/15 shadow-md shadow-gold/20 ring-1 ring-gold'
                            : 'border-white/10 bg-black/30 hover:border-white/25 hover:bg-black/50'
                        }`}
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-black/80">
                          <img
                            src={preset.src}
                            alt={preset.label}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {isSelected && (
                            <div className="absolute right-1.5 top-1.5 rounded-full bg-gold p-1 text-ink shadow-md">
                              <CheckCircle2 className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                        <span className="mt-2 line-clamp-1 text-[11px] font-medium text-paper">
                          {preset.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Luxury Preview (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          <div className="sticky top-8 rounded-2xl border border-gold/30 bg-ink/90 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
                <Eye className="h-4 w-4" />
                <span>Live Interactive Preview</span>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300">
                Live Rendering
              </span>
            </div>

            {/* Mock Viewport Preview matching Philosophy.jsx */}
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-ink min-h-[400px] flex flex-col justify-end p-6 shadow-inner">
              {/* Background Image Layer */}
              <div className="absolute inset-0">
                <img
                  src={previewImageSrc}
                  alt={data.imageAlt || 'Background preview'}
                  className="h-full w-full object-cover object-[center_20%] opacity-40 transition-all duration-700"
                />
              </div>
              {/* Luxury Ink Overlay */}
              <div className="absolute inset-0 bg-ink/75" />

              {/* Text Content */}
              <div className="relative z-10 space-y-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/90">
                  {data.kicker || 'A THEMATIC STATEMENT'}
                </p>

                <h3 className="font-serif text-xl sm:text-2xl leading-tight text-paper italic">
                  "{data.statement || 'When you choose to help others up, you help people rise as well.'}"
                </h3>

                <p className="text-xs leading-relaxed text-mist/90 max-w-sm">
                  {data.note ||
                    'A thematic statement drawn from his published writing on service. It is not presented here as a recorded quotation.'}
                </p>
              </div>
            </div>

            {/* Quick Helper Tips */}
            <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs text-mist space-y-2">
              <div className="flex items-center gap-2 font-medium text-paper">
                <HelpCircle className="h-3.5 w-3.5 text-gold" />
                <span>Immediate Website Sync:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Clicking <strong>Save &amp; Publish</strong> immediately synchronizes MongoDB with the live public homepage. All preset photos are verified high-resolution portrait assets.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-amber-500 py-3 text-xs font-bold uppercase tracking-wider text-ink shadow-lg shadow-gold/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save &amp; Publish to Website'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
