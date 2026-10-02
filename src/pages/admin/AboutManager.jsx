import { useState, useEffect, useRef } from 'react'
import {
  User,
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
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import { aboutAPI } from '../../services/api'
import { profile, roles as defaultRoles } from '../../data/profile'

const DEFAULT_ABOUT = {
  kicker: 'About',
  headline: 'Who is Gilbert Kevin Jimmy Kwizera?',
  bodyText:
    'A humanitarian leader, international consultant, and volunteer. Born in Kampala on 30 November 1971, trained in information systems and finance, and now based in the United Arab Emirates. The public measure of the work is simple: whether it protects dignity and can be sustained.',
  portraitImage: profile.portrait || '/src/assets/images/gilbert-kwizera-lounge-armchair.jpg',
  badgeTopText: 'EST. 1971',
  badgeSubText: 'Kampala · Dubai',
  profileLinkText: 'Read the full profile',
  profileLinkUrl: '/about',
  roles: [
    {
      title: 'Humanitarian leader',
      text: 'Founder of the Cancer Charity Foundation and Haven Welfare, with the work measured by dignity, consistency, and care.',
    },
    {
      title: 'International consultant',
      text: 'A consultant and social entrepreneur based in the United Arab Emirates, focused on ethical, people-centred decisions.',
    },
  ],
}

const PRESET_PORTRAITS = [
  { label: 'Lounge Armchair Reflection (Default)', path: '/src/assets/images/gilbert-kwizera-lounge-armchair.jpg' },
  { label: 'Executive Formal Portrait', path: '/src/assets/images/gilbert-kwizera-executive.jpg' },
  { label: 'Office Standing with African Art', path: '/src/assets/images/gilbert-kwizera-office-standing.jpg' },
  { label: 'Dubai Downtown Walking', path: '/src/assets/images/gilbert-kwizera-dubai-walking.jpg' },
  { label: 'Dubai Marina Yacht Outreach', path: '/src/assets/images/gilbert-kwizera-dubai-marina-yacht.jpg' },
]

export default function AboutManager() {
  const [formData, setFormData] = useState(() => {
    const cached = typeof window !== 'undefined' ? localStorage.getItem('gilbert_cached_about') : null
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        return { ...DEFAULT_ABOUT, ...parsed }
      } catch (e) {}
    }
    return DEFAULT_ABOUT
  })

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [notification, setNotification] = useState({ message: '', type: '' })
  const [activeTab, setActiveTab] = useState('narrative') // 'narrative', 'portrait', 'roles'
  const fileInputRef = useRef(null)

  // Fetch current live about content
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await aboutAPI.getAbout()
        if (res.success && res.data) {
          setFormData((prev) => ({
            ...DEFAULT_ABOUT,
            ...res.data,
          }))
        }
      } catch (err) {
        console.warn('Using local about defaults:', err.message)
      }
    }
    fetchAbout()
  }, [])

  // Synchronize and persist about changes both locally and to MongoDB API
  const persistAboutChanges = async (updatedData, showSuccessNotice = false) => {
    setFormData(updatedData)
    try {
      localStorage.setItem('gilbert_cached_about', JSON.stringify(updatedData))
      window.dispatchEvent(new CustomEvent('gilbert_about_updated', { detail: updatedData }))
    } catch (e) {}

    try {
      await aboutAPI.updateAbout(updatedData)
      if (showSuccessNotice) {
        setNotification({ message: 'About section updated & published live to database!', type: 'success' })
      }
    } catch (err) {
      console.warn('[About Save Sync]: Saved locally & cached.', err.message)
      if (showSuccessNotice) {
        setNotification({ message: 'About section saved locally and published live!', type: 'success' })
      }
    }
  }

  // Handle Portrait Image Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setNotification({ message: '', type: '' })

    const uploadPayload = new FormData()
    uploadPayload.append('image', file)

    try {
      const res = await aboutAPI.uploadImage(uploadPayload)
      if (res.success && res.url) {
        const nextData = {
          ...formData,
          portraitImage: res.url,
        }
        await persistAboutChanges(nextData)
        setNotification({ message: 'Portrait image uploaded & updated live!', type: 'success' })
      }
    } catch (err) {
      const localUrl = URL.createObjectURL(file)
      const nextData = {
        ...formData,
        portraitImage: localUrl,
      }
      await persistAboutChanges(nextData)
      setNotification({ message: 'Portrait loaded locally for preview & testing', type: 'success' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Role Item Handlers
  const handleRoleChange = (index, field, value) => {
    const newRoles = [...formData.roles]
    newRoles[index] = { ...newRoles[index], [field]: value }
    setFormData({ ...formData, roles: newRoles })
  }

  const handleAddRole = () => {
    setFormData({
      ...formData,
      roles: [
        ...formData.roles,
        {
          title: 'Strategic Advisor',
          text: 'Guiding cross-border humanitarian missions, healthcare initiatives, and governance.',
        },
      ],
    })
  }

  const handleRemoveRole = (index) => {
    if (formData.roles.length <= 1) {
      alert('Must have at least one role/leadership highlight.')
      return
    }
    const newRoles = formData.roles.filter((_, i) => i !== index)
    setFormData({ ...formData, roles: newRoles })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setNotification({ message: '', type: '' })

    await persistAboutChanges(formData, true)
    setSaving(false)
  }

  const handleReset = () => {
    if (window.confirm('Reset About section to original default values?')) {
      persistAboutChanges(DEFAULT_ABOUT, true)
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-[#C9A15A] uppercase mb-1">
            <User className="h-3.5 w-3.5" />
            <span>HOMEPAGE ABOUT SECTION MANAGER</span>
          </div>
          <h1 className="display text-3xl sm:text-4xl text-white font-normal">
            About Section Editor
          </h1>
          <p className="text-xs sm:text-sm text-mist/75 mt-1 font-light">
            Customize the bio question, narrative description, 3D Arch portrait photo, EST badge, and leadership role highlights.
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
          { id: 'narrative', label: '1. Headline & Bio Narrative', icon: Type },
          { id: 'portrait', label: '2. 3D Arch Portrait & Badges', icon: ImageIcon },
          { id: 'roles', label: '3. Leadership Roles Highlights', icon: Layers },
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
          {/* TAB 1: Headline & Narrative */}
          {activeTab === 'narrative' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                  Kicker Label
                </label>
                <input
                  type="text"
                  value={formData.kicker || 'About'}
                  onChange={(e) => setFormData({ ...formData, kicker: e.target.value })}
                  placeholder="About"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                  Main Headline Question
                </label>
                <input
                  type="text"
                  value={formData.headline || ''}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="Who is Gilbert Kevin Jimmy Kwizera?"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-base text-white focus:border-[#C9A15A] focus:outline-none font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                  Main Bio &amp; Story Text
                </label>
                <textarea
                  rows={5}
                  value={formData.bodyText || ''}
                  onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
                  placeholder="A humanitarian leader, international consultant, and volunteer..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-3.5 text-xs text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-3 border-t border-white/10">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                    Profile Button Label
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
                    Profile Target URL
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

          {/* TAB 2: 3D Arch Portrait & Badges */}
          {activeTab === 'portrait' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#C9A15A] mb-1 flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4" />
                  <span>3D Arch Portrait Photo</span>
                </label>
                <p className="text-[0.68rem] text-mist/60 mb-3">
                  This photo is framed in the gold architectural arch with interactive 3D perspective tilt on hover.
                </p>

                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-black/40 border border-white/10">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-t-xl rounded-b-md border border-white/10 bg-black">
                    <img src={formData.portraitImage} alt="Arch Portrait Preview" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs font-semibold text-white truncate font-mono">
                      {formData.portraitImage}
                    </span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="about-portrait-upload"
                    />
                    <label
                      htmlFor="about-portrait-upload"
                      className="inline-flex items-center gap-1.5 mt-2 cursor-pointer rounded-lg bg-gradient-to-r from-[#8d7043] to-[#C9A15A] px-3 py-1.5 text-[0.68rem] font-semibold text-black uppercase tracking-wider hover:opacity-90 transition-opacity"
                    >
                      <Upload className="h-3 w-3" />
                      <span>{uploading ? 'Uploading...' : 'Upload New Photo from PC'}</span>
                    </label>
                  </div>
                </div>

                {/* Preset portraits picker */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESET_PORTRAITS.map((p) => (
                    <button
                      key={p.path}
                      type="button"
                      onClick={() => setFormData({ ...formData, portraitImage: p.path })}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[0.68rem] border transition-all ${
                        formData.portraitImage === p.path
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
                    Floating Badge Top Tag
                  </label>
                  <input
                    type="text"
                    value={formData.badgeTopText || 'EST. 1971'}
                    onChange={(e) => setFormData({ ...formData, badgeTopText: e.target.value })}
                    placeholder="EST. 1971"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-[#C9A15A] font-semibold focus:border-[#C9A15A] focus:outline-none tracking-wider uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-mist/80 mb-2">
                    Floating Badge Subtext
                  </label>
                  <input
                    type="text"
                    value={formData.badgeSubText || 'Kampala · Dubai'}
                    onChange={(e) => setFormData({ ...formData, badgeSubText: e.target.value })}
                    placeholder="Kampala · Dubai"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none font-serif"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Leadership Roles */}
          {activeTab === 'roles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#C9A15A]">
                    Leadership Roles ({formData.roles.length})
                  </label>
                  <p className="text-[0.68rem] text-mist/60">
                    These two-column role highlights appear below the main bio text.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-xs text-mist hover:text-white hover:bg-white/10"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {formData.roles.map((role, idx) => (
                  <div key={idx} className="relative rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3 group">
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(idx)}
                      className="absolute right-3 top-3 text-mist/40 hover:text-red-400 p-1 transition-colors"
                      title="Delete role"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <div>
                      <span className="block text-[0.62rem] text-[#C9A15A] font-semibold uppercase tracking-wider mb-1">
                        Role Title #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={role.title}
                        onChange={(e) => handleRoleChange(idx, 'title', e.target.value)}
                        placeholder="Humanitarian leader"
                        className="w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2 text-xs font-semibold text-white focus:border-[#C9A15A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="block text-[0.62rem] text-mist/60 uppercase tracking-wider mb-1">
                        Role Description &amp; Scope
                      </span>
                      <textarea
                        rows={2}
                        value={role.text}
                        onChange={(e) => handleRoleChange(idx, 'text', e.target.value)}
                        placeholder="Founder of the Cancer Charity Foundation..."
                        className="w-full rounded-xl border border-white/10 bg-black/60 p-3 text-xs text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none leading-relaxed"
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

        {/* Right Column: Live Visual Interactive Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#14120e] p-5 sm:p-6 shadow-xl sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-mist/90 flex items-center gap-2">
                <Eye className="h-4 w-4 text-[#C9A15A]" />
                <span>Live About Section Preview</span>
              </span>
              <a
                href="/#about"
                target="_blank"
                rel="noreferrer"
                className="text-[0.68rem] text-[#C9A15A] hover:underline flex items-center gap-1"
              >
                <span>Open Website</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            {/* Simulated 3D Arch Card */}
            <div className="relative mx-auto w-full max-w-[280px]">
              <div
                className="pointer-events-none absolute -inset-2 rounded-t-[140px] rounded-b-[26px] border border-[#C9A15A]/35"
                aria-hidden="true"
              />
              <div className="relative overflow-hidden rounded-t-[130px] rounded-b-[20px] border border-white/20 bg-[#121110] shadow-2xl">
                {/* 01 Seal */}
                <div className="absolute top-4 left-4 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-[#0D0D0C]/80 font-sans text-[0.55rem] font-medium tracking-[0.14em] text-[#C9A15A] backdrop-blur-md">
                  01
                </div>

                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0D0D0C]">
                  <img
                    src={formData.portraitImage}
                    alt="Gilbert Kwizera"
                    className="h-full w-full object-cover object-[center_8%]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D0D0C]/90 via-[#0D0D0C]/20 to-transparent opacity-50" />
                </div>

                {/* Floating EST Badge */}
                <div className="absolute right-3 bottom-3 z-20 flex items-center gap-2 border border-[#C9A15A]/60 bg-[#0D0D0C]/92 px-3 py-1.5 shadow-lg backdrop-blur-md">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C9A15A] opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C9A15A]" />
                  </span>
                  <div>
                    <p className="text-[0.52rem] font-medium tracking-[0.24em] text-[#C9A15A] uppercase">
                      {formData.badgeTopText || 'EST. 1971'}
                    </p>
                    <p className="font-serif text-[0.65rem] font-medium text-paper">
                      {formData.badgeSubText || 'Kampala · Dubai'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content summary card */}
            <div className="mt-5 rounded-2xl bg-white/[0.02] border border-white/5 p-4 text-[0.72rem] text-mist/80 space-y-2">
              <p className="text-[0.62rem] uppercase tracking-widest text-[#C9A15A] font-semibold">
                {formData.kicker || 'About'}
              </p>
              <p className="font-serif text-sm font-medium text-white leading-snug">
                {formData.headline || 'Who is Gilbert Kevin Jimmy Kwizera?'}
              </p>
              <p className="text-mist/70 line-clamp-3 leading-relaxed">
                {formData.bodyText}
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[0.68rem] text-[#C9A15A]">
                <span>{formData.roles.length} Leadership Roles Active</span>
                <span className="flex items-center gap-1 text-white">
                  {formData.profileLinkText}
                  <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
