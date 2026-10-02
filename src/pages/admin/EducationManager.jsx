import { useState, useEffect, useRef } from 'react'
import {
  GraduationCap,
  Save,
  RotateCcw,
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  Link as LinkIcon,
  FileText,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react'
import { educationAPI } from '../../services/api'

const PRESET_IMAGES = [
  { label: 'Schoolyard Pupils & Books', path: '/src/assets/images/Supporting-Education-Empowering-Futures.jpg' },
  { label: 'Classroom & Teacher Supplies', path: '/src/assets/images/Gilbert-Kwizera-Charity-Support-for-Uganda-Students-Drive.jpg' },
  { label: 'PIO Ecosystem & Technology', path: '/src/assets/images/pio-ecosystem-technology.jpg' },
  { label: 'Blockchain for Humanity Book', path: '/src/assets/images/Blockchain.jpg' },
  { label: 'Haven Welfare Support', path: '/src/assets/images/havenwelfare.jpg' },
  { label: 'Executive Consultation', path: '/src/assets/images/gilbert-kwizera-executive.jpg' },
]

const DEFAULT_EDUCATION_DATA = {
  eyebrow: 'Knowledge',
  title: 'Education as a Tool for Service',
  paragraphs: [
    'In his published writing, learning was never framed as a private advantage. Business, information technology, and finance were how he learned to see institutions: where resources go, and how a system can help a person or harm them.',
    'That is the bridge into the humanitarian work. Compassion still needs a structure that is transparent and able to last. ISBET Brainery Academy is the education platform in this body of work — practical technology training, guided lessons, and career skills.',
    'The same conviction shows up in direct gifts: books and tools in a classroom, so a child’s day is not stopped by the absence of something basic.',
  ],
  linkText: 'Explore ISBET Brainery',
  linkUrl: '/impact/isbet-brainery',
  image: '/src/assets/images/Supporting-Education-Empowering-Futures.jpg',
  imageAlt: 'Pupils holding new exercise books after a donation of scholastic materials',
}

export default function EducationManager() {
  const [eduData, setEduData] = useState(DEFAULT_EDUCATION_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [notification, setNotification] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchEducationData()
  }, [])

  const fetchEducationData = async () => {
    try {
      setLoading(true)
      const res = await educationAPI.getEducation()
      if (res.success && res.data) {
        const fetched = {
          eyebrow: res.data.eyebrow || DEFAULT_EDUCATION_DATA.eyebrow,
          title: res.data.title || DEFAULT_EDUCATION_DATA.title,
          paragraphs:
            Array.isArray(res.data.paragraphs) && res.data.paragraphs.length > 0
              ? res.data.paragraphs
              : DEFAULT_EDUCATION_DATA.paragraphs,
          linkText: res.data.linkText || DEFAULT_EDUCATION_DATA.linkText,
          linkUrl: res.data.linkUrl || DEFAULT_EDUCATION_DATA.linkUrl,
          image: res.data.image || DEFAULT_EDUCATION_DATA.image,
          imageAlt: res.data.imageAlt || DEFAULT_EDUCATION_DATA.imageAlt,
        }
        setEduData(fetched)
        localStorage.setItem('gilbert_cached_education', JSON.stringify(fetched))
      }
    } catch (error) {
      console.warn('Using local cached/fallback education data:', error.message)
      const cached = localStorage.getItem('gilbert_cached_education')
      if (cached) {
        try {
          setEduData(JSON.parse(cached))
        } catch (e) {
          setEduData(DEFAULT_EDUCATION_DATA)
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

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await educationAPI.updateEducation(eduData)
      if (res.success) {
        localStorage.setItem('gilbert_cached_education', JSON.stringify(eduData))
        window.dispatchEvent(new CustomEvent('gilbert_education_updated', { detail: eduData }))
        showToast('Education section updated successfully! Website updated.')
      } else {
        throw new Error(res.message || 'Save failed')
      }
    } catch (error) {
      localStorage.setItem('gilbert_cached_education', JSON.stringify(eduData))
      window.dispatchEvent(new CustomEvent('gilbert_education_updated', { detail: eduData }))
      showToast('Saved to local session! (Database notice: ' + error.message + ')', 'success')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Reset Education & Knowledge section to original default configuration?')) {
      setEduData(DEFAULT_EDUCATION_DATA)
      showToast('Reset to defaults. Click "Save & Publish" to update.', 'info')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('image', file)

      const res = await educationAPI.uploadImage(formData)
      if (res.success && res.url) {
        setEduData((prev) => ({ ...prev, image: res.url }))
        showToast('Education showcase image uploaded successfully!')
      }
    } catch (error) {
      const reader = new FileReader()
      reader.onload = () => {
        setEduData((prev) => ({ ...prev, image: reader.result }))
        showToast('Image set as local preview.')
      }
      reader.readAsDataURL(file)
    } finally {
      setUploadingImage(false)
    }
  }

  // Paragraph helpers
  const handleAddParagraph = () => {
    setEduData((prev) => ({
      ...prev,
      paragraphs: [
        ...prev.paragraphs,
        'New educational principle or initiative description detailing practical skill building, classrooms, or scholarships.',
      ],
    }))
  }

  const handleUpdateParagraph = (index, value) => {
    const updated = [...eduData.paragraphs]
    updated[index] = value
    setEduData((prev) => ({ ...prev, paragraphs: updated }))
  }

  const handleRemoveParagraph = (index) => {
    if (eduData.paragraphs.length <= 1) {
      showToast('You must keep at least 1 narrative paragraph.', 'error')
      return
    }
    const updated = eduData.paragraphs.filter((_, idx) => idx !== index)
    setEduData((prev) => ({ ...prev, paragraphs: updated }))
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A15A] border-t-transparent" />
          <p className="text-sm text-mist/60">Loading Education Section Editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl transition-all animate-in fade-in slide-in-from-bottom-5 ${
            notification.type === 'error'
              ? 'border-red-500/30 bg-red-950/90 text-red-200'
              : 'border-[#C9A15A]/40 bg-[#161410]/95 text-[#fae8be]'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="h-5 w-5 text-red-400" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-[#C9A15A]" />
          )}
          <span className="text-xs font-medium">{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A15A]">
            <GraduationCap className="h-4 w-4" />
            <span>Interactive Portfolio CMS</span>
          </div>
          <h1 className="mt-1 font-serif text-2xl font-bold text-white sm:text-3xl">
            Education & Knowledge Section Editor
          </h1>
          <p className="mt-1 text-xs text-mist/70">
            Customize the "Education as a Tool for Service" section, narrative paragraphs, ISBET Brainery CTA, and showcase photo.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex shrink-0 items-center justify-center whitespace-nowrap gap-2 rounded-xl bg-gradient-to-r from-[#8d7043] to-[#C9A15A] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-black hover:brightness-110 shadow-lg shadow-[#8d7043]/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Headings */}
          <div className="rounded-2xl border border-white/10 bg-[#14120e] p-6 space-y-4">
            <h3 className="font-serif text-base font-semibold text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#C9A15A]" />
              <span>Section Headings</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                Eyebrow Label
              </label>
              <input
                type="text"
                value={eduData.eyebrow}
                onChange={(e) => setEduData({ ...eduData, eyebrow: e.target.value })}
                placeholder="e.g. Knowledge"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                Section Main Title
              </label>
              <input
                type="text"
                value={eduData.title}
                onChange={(e) => setEduData({ ...eduData, title: e.target.value })}
                placeholder="e.g. Education as a Tool for Service"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none font-serif text-sm"
              />
            </div>
          </div>

          {/* 2. Narrative Paragraphs */}
          <div className="rounded-2xl border border-white/10 bg-[#14120e] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-semibold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#C9A15A]" />
                <span>Narrative Paragraphs ({eduData.paragraphs?.length || 0})</span>
              </h3>
              <button
                type="button"
                onClick={handleAddParagraph}
                className="flex items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-xs text-white hover:bg-white/20 transition-all"
              >
                <Plus className="h-3 w-3" />
                <span>Add Paragraph</span>
              </button>
            </div>

            <div className="space-y-3">
              {(eduData.paragraphs || []).map((pText, pIdx) => (
                <div key={pIdx} className="relative rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[0.65rem] uppercase tracking-wider text-[#C9A15A]">
                      Paragraph #{pIdx + 1}
                    </span>
                    {eduData.paragraphs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveParagraph(pIdx)}
                        className="p-1 text-mist/40 hover:text-red-400 transition-colors"
                        title="Remove paragraph"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={3}
                    value={pText}
                    onChange={(e) => handleUpdateParagraph(pIdx, e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 p-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 3. Link & CTA */}
          <div className="rounded-2xl border border-white/10 bg-[#14120e] p-6 space-y-4">
            <h3 className="font-serif text-base font-semibold text-white flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-[#C9A15A]" />
              <span>Call-to-Action Link</span>
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                  Link Text
                </label>
                <input
                  type="text"
                  value={eduData.linkText}
                  onChange={(e) => setEduData({ ...eduData, linkText: e.target.value })}
                  placeholder="e.g. Explore ISBET Brainery"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                  Target Link URL
                </label>
                <input
                  type="text"
                  value={eduData.linkUrl}
                  onChange={(e) => setEduData({ ...eduData, linkUrl: e.target.value })}
                  placeholder="e.g. /impact/isbet-brainery"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* 4. Showcase Photo */}
          <div className="rounded-2xl border border-white/10 bg-[#14120e] p-6 space-y-4">
            <h3 className="font-serif text-base font-semibold text-white flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-[#C9A15A]" />
              <span>Education Showcase Photo</span>
            </h3>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
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
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-medium text-white hover:bg-white/15 transition-all cursor-pointer"
                >
                  <Upload className="h-4 w-4 text-[#C9A15A]" />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload Image from Computer'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                  Image URL / File Path
                </label>
                <input
                  type="text"
                  value={eduData.image}
                  onChange={(e) => setEduData({ ...eduData, image: e.target.value })}
                  placeholder="/src/assets/images/... or https://..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                  Image Alt Text (SEO)
                </label>
                <input
                  type="text"
                  value={eduData.imageAlt}
                  onChange={(e) => setEduData({ ...eduData, imageAlt: e.target.value })}
                  placeholder="e.g. Pupils holding new exercise books..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <label className="block text-[0.68rem] font-medium text-mist/60 mb-2 uppercase tracking-wider">
                  Or Pick from Existing Assets:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.map((preset) => {
                    const isActive = eduData.image === preset.path
                    return (
                      <button
                        key={preset.path}
                        type="button"
                        onClick={() => setEduData({ ...eduData, image: preset.path })}
                        className={`rounded-lg px-2.5 py-1 text-[0.65rem] transition-all ${
                          isActive
                            ? 'bg-[#C9A15A] text-black font-semibold'
                            : 'bg-white/5 text-mist/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {preset.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Visual Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-28 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A15A] flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span>Live Public Section Simulator</span>
              </span>
              <a
                href="/#education"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[0.68rem] text-mist hover:text-white"
              >
                <span>View on Website</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Public Section Simulator (Ivory Theme) */}
            <div className="rounded-3xl border border-[#e5dfd3] bg-[#f8f5ef] p-6 sm:p-8 text-[#14120e] shadow-2xl space-y-6">
              <div className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8d7043]">
                <span className="h-px w-6 bg-[#8d7043]" />
                <span>{eduData.eyebrow || 'Knowledge'}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal leading-tight text-[#1a1815]">
                {eduData.title || 'Education as a Tool for Service'}
              </h2>

              <div className="space-y-3 text-xs leading-relaxed text-[#5c5850]">
                {(eduData.paragraphs || []).map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a1815]">
                  <span>{eduData.linkText || 'Explore ISBET Brainery'}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#8d7043]" />
                </span>
              </div>

              {/* Photo Frame Simulation */}
              <div className="relative overflow-hidden rounded-2xl bg-[#eae4d7] aspect-[5/4] shadow-inner mt-4">
                <img
                  src={eduData.image}
                  alt={eduData.imageAlt}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/src/assets/images/Supporting-Education-Empowering-Futures.jpg'
                  }}
                />
              </div>
            </div>

            {/* Callout */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs text-mist/70 space-y-2">
              <p className="font-medium text-white flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#C9A15A]" />
                <span>Live Instant Synchronisation</span>
              </p>
              <p className="text-[0.72rem] leading-relaxed">
                Edits published here immediately update the homepage Knowledge section (<code className="text-[#fae8be]">#education</code>) and database without needing a reload.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
