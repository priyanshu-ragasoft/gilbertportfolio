import { useState, useEffect, useRef } from 'react'
import {
  Bookmark,
  Save,
  RotateCcw,
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Link as LinkIcon,
  FileText,
  ExternalLink,
} from 'lucide-react'
import { featuredStoryAPI } from '../../services/api'

const PRESET_IMAGES = [
  { label: 'Uganda Cancer Institute (UCI)', path: '/src/assets/images/ccf-uci.jpg' },
  { label: 'CCF Compassionate Cancer Care', path: '/src/assets/images/ccf-cancer-care-compassion.jpg' },
  { label: 'Salim Bwagu Portrait', path: '/src/assets/images/He-Battled-Cancer-for-24-Years.jpg' },
  { label: 'School Education Drive', path: '/src/assets/images/Supporting-Education-Empowering-Futures.jpg' },
  { label: 'Haven Welfare Support', path: '/src/assets/images/havenwelfare.jpg' },
]

const DEFAULT_STORY_DATA = {
  eyebrow: 'Featured story · Cancer care',
  title: 'He Battled Cancer for 24 Years',
  image: '/src/assets/images/ccf-uci.jpg',
  imageAlt: 'Uganda Cancer Institute, where specialised cancer treatment is centred in Kampala',
  leadParagraph:
    'Salim Bwagu was a child when Hodgkin’s lymphoma entered his life. Nearly twenty years later, in 2006, support from Gilbert’s charity made it possible to finish treatment. In 2007 he was cleared. He went on to help other patients face the same two barriers: cost, and a lack of clear information.',
  secondaryParagraph:
    'The account is published in full on this site without added drama. What it insists on is ordinary and serious: stay with the treatment, and do not leave people to carry it alone.',
  buttonText: 'Read the Story',
  buttonLink: '/projects/he-battled-cancer-for-24-years',
  sideNote:
    'Told with Salim’s name, his family’s, and the dates in the original record — from Mulago in 1987 to the National Cancer Institute in 2007.',
  sideLinkText: 'The full story',
  sideLinkUrl: '/projects/he-battled-cancer-for-24-years',
}

export default function FeaturedStoryManager() {
  const [storyData, setStoryData] = useState(DEFAULT_STORY_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [notification, setNotification] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchStoryData()
  }, [])

  const fetchStoryData = async () => {
    try {
      setLoading(true)
      const res = await featuredStoryAPI.getFeaturedStory()
      if (res.success && res.data) {
        const fetched = {
          eyebrow: res.data.eyebrow || DEFAULT_STORY_DATA.eyebrow,
          title: res.data.title || DEFAULT_STORY_DATA.title,
          image: res.data.image || DEFAULT_STORY_DATA.image,
          imageAlt: res.data.imageAlt || DEFAULT_STORY_DATA.imageAlt,
          leadParagraph: res.data.leadParagraph || DEFAULT_STORY_DATA.leadParagraph,
          secondaryParagraph: res.data.secondaryParagraph || DEFAULT_STORY_DATA.secondaryParagraph,
          buttonText: res.data.buttonText || DEFAULT_STORY_DATA.buttonText,
          buttonLink: res.data.buttonLink || DEFAULT_STORY_DATA.buttonLink,
          sideNote: res.data.sideNote || DEFAULT_STORY_DATA.sideNote,
          sideLinkText: res.data.sideLinkText || DEFAULT_STORY_DATA.sideLinkText,
          sideLinkUrl: res.data.sideLinkUrl || DEFAULT_STORY_DATA.sideLinkUrl,
        }
        setStoryData(fetched)
        localStorage.setItem('gilbert_cached_featured_story', JSON.stringify(fetched))
      }
    } catch (error) {
      console.warn('Using local cached/fallback featured story data:', error.message)
      const cached = localStorage.getItem('gilbert_cached_featured_story')
      if (cached) {
        try {
          setStoryData(JSON.parse(cached))
        } catch (e) {
          setStoryData(DEFAULT_STORY_DATA)
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

  const handleChange = (field, value) => {
    setStoryData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('image', file)

      const res = await featuredStoryAPI.uploadImage(formData)
      if (res.success && res.url) {
        handleChange('image', res.url)
        showToast('Image uploaded successfully!')
      }
    } catch (err) {
      const reader = new FileReader()
      reader.onload = (loadEvt) => {
        handleChange('image', loadEvt.target.result)
        showToast('Image preview updated!')
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
      const res = await featuredStoryAPI.updateFeaturedStory(storyData)
      if (res.success) {
        localStorage.setItem('gilbert_cached_featured_story', JSON.stringify(storyData))
        window.dispatchEvent(new CustomEvent('gilbert_featured_story_updated', { detail: storyData }))
        showToast('Featured Story updated and published successfully!')
      }
    } catch (err) {
      localStorage.setItem('gilbert_cached_featured_story', JSON.stringify(storyData))
      window.dispatchEvent(new CustomEvent('gilbert_featured_story_updated', { detail: storyData }))
      showToast('Saved locally and updated on live view!')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Reset Featured Story to default values?')) {
      setStoryData(DEFAULT_STORY_DATA)
      showToast('Reset to default values.')
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#8d7043] border-t-transparent" />
          <p className="text-xs uppercase tracking-widest text-[#8a847c]">Loading Featured Story...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20">
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
            <Bookmark className="h-4 w-4" />
            <span>Featured Spotlight Narrative</span>
          </div>
          <h1 className="mt-1 font-serif text-3xl text-paper">Featured Story Editor</h1>
          <p className="mt-1 text-sm text-[#8a847c]">
            Edit the 24-Year Cancer Survivor spotlight narrative (Salim Bwagu story) and media.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 rounded border border-white/15 px-3 py-2 text-xs font-medium text-[#b7b0a6] transition-colors hover:border-white/30 hover:bg-white/5 hover:text-paper"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded bg-gradient-to-r from-[#8d7043] to-[#a68652] px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition-all hover:opacity-95 disabled:opacity-50 whitespace-nowrap shrink-0"
          >
            <Save className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">{saving ? 'Publishing...' : 'SAVE & PUBLISH LIVE'}</span>
          </button>
        </div>
      </div>

      {/* 2 Column Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          {/* Main Story Content Card */}
          <div className="rounded-xl border border-white/10 bg-[#161412] p-6 shadow-xl space-y-5">
            <h2 className="flex items-center gap-2 font-serif text-lg text-paper pb-2 border-b border-white/5">
              <Sparkles className="h-4 w-4 text-[#8d7043]" />
              Story Content &amp; Headlines
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={storyData.eyebrow}
                  onChange={(e) => handleChange('eyebrow', e.target.value)}
                  placeholder="e.g. Featured story · Cancer care"
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Main Headline Title
                </label>
                <input
                  type="text"
                  value={storyData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. He Battled Cancer for 24 Years"
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none font-serif"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Lead Paragraph
                </label>
                <textarea
                  rows={4}
                  value={storyData.leadParagraph}
                  onChange={(e) => handleChange('leadParagraph', e.target.value)}
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                  Secondary Paragraph
                </label>
                <textarea
                  rows={3}
                  value={storyData.secondaryParagraph}
                  onChange={(e) => handleChange('secondaryParagraph', e.target.value)}
                  className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Action Button */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2 border-t border-white/5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={storyData.buttonText}
                    onChange={(e) => handleChange('buttonText', e.target.value)}
                    placeholder="Read the Story"
                    className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#8a847c] mb-1.5 font-medium">
                    Button URL Link
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-[#8a847c]" />
                    <input
                      type="text"
                      value={storyData.buttonLink}
                      onChange={(e) => handleChange('buttonLink', e.target.value)}
                      placeholder="/projects/he-battled-cancer-for-24-years"
                      className="w-full rounded border border-white/10 bg-[#0d0c0a] pl-9 pr-3 py-2 text-sm text-paper focus:border-[#8d7043] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="pt-2 border-t border-white/5 space-y-3">
                <label className="text-xs uppercase tracking-wider text-[#8a847c] font-medium flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-[#8d7043]" />
                  Featured Story Photo
                </label>

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
                    className="flex items-center justify-center gap-2 rounded border border-[#8d7043]/50 bg-[#8d7043]/10 px-4 py-2 text-xs font-semibold text-[#fae8be] hover:bg-[#8d7043]/20 transition-colors shrink-0"
                  >
                    <Upload className="h-4 w-4 text-[#8d7043]" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                  </button>

                  <div className="relative flex-1">
                    <select
                      value={
                        PRESET_IMAGES.some((p) => p.path === storyData.image)
                          ? storyData.image
                          : ''
                      }
                      onChange={(e) => {
                        if (e.target.value) handleChange('image', e.target.value)
                      }}
                      className="w-full rounded border border-white/10 bg-[#0d0c0a] px-3 py-2 text-xs text-paper focus:border-[#8d7043] focus:outline-none cursor-pointer"
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
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Card Preview */}
        <div className="space-y-6 lg:col-span-5">
          <div className="sticky top-6 rounded-xl border border-white/10 bg-[#161412] p-6 shadow-xl space-y-4">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8d7043]">
              <Eye className="h-4 w-4" />
              Live Story Card Preview
            </span>

            <div className="rounded-xl border border-[#8d7043]/40 bg-[#0D0D0C] p-5 shadow-2xl space-y-4">
              <span className="text-[10px] font-semibold text-[#8d7043] uppercase tracking-widest">
                {storyData.eyebrow}
              </span>
              <h3 className="font-serif text-2xl text-paper leading-snug">{storyData.title}</h3>

              <div className="aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-black">
                <img src={storyData.image} alt={storyData.title} className="h-full w-full object-cover" />
              </div>

              <p className="text-xs text-[#b7b0a6] leading-relaxed line-clamp-4">{storyData.leadParagraph}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
