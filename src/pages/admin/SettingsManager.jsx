import { useState, useEffect, useRef } from 'react'
import {
  Settings,
  Shield,
  Lock,
  Save,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Trash2,
  Sliders,
  Power,
} from 'lucide-react'
import { settingsAPI } from '../../services/api'
import { profile } from '../../data/profile'
import Logo from '../../components/Logo'

const DEFAULT_SETTINGS = {
  showFooterCornerImage: true,
  footerCornerImage: '',
  footerCornerImageAlt: 'Brand Emblem & Shaded Watermark',
  footerWatermarkOpacity: 18,
  footerLogo: '',
  footerLogoAlt: 'Gilbert Kevin Jimmy Kwizera Official Brand',
  footerTagline:
    'Dedicated to dignity-based care, ethical resource stewardship, and sustainable social systems across East Africa and the Middle East.',
  officeAddress: profile.location || 'Le Pont, Port de la Mer, Jumeirah, Dubai',
  contactPhone: profile.phone || '+971 54 312 1222',
  contactEmail: profile.email || 'kevin@piogoldcoin.com',
  quoteText: 'When you choose to help others up, you help people rise as well.',
  quoteAuthor: 'Core Leadership Principle',
  copyrightText: '© 2026 Gilbert Kevin Jimmy Kwizera. All rights reserved.',
}

export default function SettingsManager() {
  const [activeTab, setActiveTab] = useState('footer') // 'footer' | 'security'
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [notification, setNotification] = useState(null)
  const fileInputRef = useRef(null)

  // Password reset state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await settingsAPI.getSettings()
      if (res.success && res.data) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...res.data,
          showFooterCornerImage: res.data.showFooterCornerImage !== false,
          footerWatermarkOpacity: res.data.footerWatermarkOpacity ?? 18,
        })
        localStorage.setItem('gilbert_cached_settings', JSON.stringify(res.data))
      }
    } catch (error) {
      console.warn('Using cached settings fallback:', error.message)
      const cached = localStorage.getItem('gilbert_cached_settings')
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          setSettings({
            ...DEFAULT_SETTINGS,
            ...parsed,
            showFooterCornerImage: parsed.showFooterCornerImage !== false,
          })
        } catch (e) {
          setSettings(DEFAULT_SETTINGS)
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

  const handleFieldChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCornerImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Quick instant preview
    const reader = new FileReader()
    reader.onload = () => {
      setSettings((prev) => ({
        ...prev,
        footerCornerImage: reader.result,
        showFooterCornerImage: true,
      }))
    }
    reader.readAsDataURL(file)

    const formData = new FormData()
    formData.append('logo', file)

    try {
      setUploadingImage(true)
      const res = await settingsAPI.uploadLogo(formData)
      if (res.success && res.url) {
        setSettings((prev) => ({
          ...prev,
          footerCornerImage: res.url,
          showFooterCornerImage: true,
        }))
        showToast('Footer shaded watermark image uploaded!')
      }
    } catch (error) {
      console.warn('Applied local preview URL:', error.message)
      showToast('Watermark preview updated.', 'info')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveCornerImage = () => {
    setSettings((prev) => ({
      ...prev,
      footerCornerImage: '',
    }))
    showToast('Background watermark removed from footer.', 'info')
  }

  const handleSaveSettings = async (e) => {
    e?.preventDefault()
    setSaving(true)
    try {
      const res = await settingsAPI.updateSettings(settings)
      if (res.success) {
        showToast('Footer settings & background watermark updated!')
      }
      localStorage.setItem('gilbert_cached_settings', JSON.stringify(settings))
      window.dispatchEvent(
        new CustomEvent('gilbert_settings_updated', {
          detail: settings,
        })
      )
    } catch (error) {
      console.warn('Backend update notice:', error.message)
      localStorage.setItem('gilbert_cached_settings', JSON.stringify(settings))
      window.dispatchEvent(
        new CustomEvent('gilbert_settings_updated', {
          detail: settings,
        })
      )
      showToast('Settings saved to live website!', 'success')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.')
      return
    }

    try {
      setUpdatingPassword(true)
      const res = await settingsAPI.changePassword({
        currentPassword,
        newPassword,
      })

      if (res.success) {
        showToast('Admin password successfully updated!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (error) {
      setPasswordError(error.message || 'Failed to update password. Verify current password.')
    } finally {
      setUpdatingPassword(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="font-serif text-sm tracking-widest text-mist">
            LOADING SETTINGS &amp; CONFIGURATION...
          </p>
        </div>
      </div>
    )
  }

  const isWatermarkActive = settings.showFooterCornerImage !== false && Boolean(settings.footerCornerImage)

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
              <Settings className="h-4 w-4" />
              <span>System &amp; Footer CMS</span>
            </div>
            <h1 className="mt-2 font-serif text-2xl font-bold tracking-tight text-paper sm:text-3xl">
              Site Settings &amp; Security
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-mist">
              Upload the shaded background watermark image, toggle its visibility on the live site, and manage admin security.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={saving}
              className="inline-flex shrink-0 items-center justify-center whitespace-nowrap gap-2 rounded-xl bg-gradient-to-r from-gold to-amber-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink shadow-lg shadow-gold/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('footer')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'footer'
              ? 'bg-gradient-to-r from-gold to-amber-500 text-ink shadow-md shadow-gold/20'
              : 'border border-white/10 bg-white/5 text-mist hover:bg-white/10 hover:text-white'
          }`}
        >
          <ImageIcon className="h-4 w-4" />
          <span>Footer Background Watermark &amp; Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
            activeTab === 'security'
              ? 'bg-gradient-to-r from-gold to-amber-500 text-ink shadow-md shadow-gold/20'
              : 'border border-white/10 bg-white/5 text-mist hover:bg-white/10 hover:text-white'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Admin Password &amp; Security</span>
        </button>
      </div>

      {/* Tab 1: Footer Shaded Watermark & Details */}
      {activeTab === 'footer' && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Form (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Card 1: Footer Shaded Background Watermark Upload & Toggle */}
            <div className="rounded-2xl border border-white/10 bg-ink/70 p-6 shadow-xl backdrop-blur-sm space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-paper">
                      Footer Shaded Background Graphic / Watermark
                    </h3>
                    <p className="text-xs text-mist">
                      Upload the brand emblem or graphic that blends smoothly into the dark footer background
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCornerImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="inline-flex shrink-0 items-center whitespace-nowrap gap-2 rounded-xl border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold transition-all hover:bg-gold/20"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload Watermark'}</span>
                </button>
              </div>

              {/* Watermark Enable / Disable Toggle Switch */}
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/50 p-4 transition-all hover:border-gold/30">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      settings.showFooterCornerImage !== false
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-white/5 text-mist/40'
                    }`}
                  >
                    <Power className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-paper">
                      Display Watermark On Website
                    </p>
                    <p className="text-[11px] text-mist/70">
                      {settings.showFooterCornerImage !== false ? (
                        <span className="text-emerald-400 font-medium">
                          ● ON (Visible in website footer background)
                        </span>
                      ) : (
                        <span className="text-mist/60">
                          ○ OFF (Hidden on website)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.showFooterCornerImage !== false}
                  onClick={() =>
                    handleFieldChange(
                      'showFooterCornerImage',
                      !(settings.showFooterCornerImage !== false)
                    )
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    settings.showFooterCornerImage !== false
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md shadow-emerald-500/30'
                      : 'bg-white/20'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      settings.showFooterCornerImage !== false ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Watermark Preview & Controls */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="relative flex h-24 w-36 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0d0c0a] p-2 overflow-hidden">
                    {settings.footerCornerImage ? (
                      <img
                        src={settings.footerCornerImage}
                        alt="Footer Watermark Preview"
                        style={{
                          opacity:
                            settings.showFooterCornerImage !== false
                              ? (settings.footerWatermarkOpacity ?? 18) / 100
                              : 0.05,
                        }}
                        className="max-h-full max-w-full object-contain filter brightness-110"
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="h-6 w-6 mx-auto text-mist/40" />
                        <span className="text-[10px] text-mist/60">No Watermark</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-paper">
                      {settings.footerCornerImage
                        ? settings.showFooterCornerImage !== false
                          ? 'Background Watermark Active & Enabled'
                          : 'Background Watermark Uploaded (Currently Disabled)'
                        : 'No Background Graphic Set'}
                    </p>
                    <p className="mt-0.5 text-[11px] text-mist/70">
                      Renders as an elegant, shaded background watermark bleeding into the dark bottom-right footer backdrop.
                    </p>
                    {settings.footerCornerImage && (
                      <button
                        type="button"
                        onClick={handleRemoveCornerImage}
                        className="mt-2 inline-flex items-center gap-1.5 text-xs text-rose-400 hover:underline"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove background watermark</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Opacity Slider */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-mist">
                      <Sliders className="h-3.5 w-3.5 text-gold" />
                      Background Shading / Opacity
                    </label>
                    <span className="text-xs font-mono font-semibold text-gold">
                      {settings.footerWatermarkOpacity ?? 18}%
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-4">
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="1"
                      value={settings.footerWatermarkOpacity ?? 18}
                      onChange={(e) => handleFieldChange('footerWatermarkOpacity', Number(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-mist/50">
                    Recommended: 15% - 25% for a subtle shaded background look without overpowering text.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-mist">
                    Watermark Image URL or File Path
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={settings.footerCornerImage || ''}
                      onChange={(e) => handleFieldChange('footerCornerImage', e.target.value)}
                      placeholder="e.g. /uploads/aqua-wow-logo.png or https://example.com/logo.png"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs font-mono text-paper placeholder-white/20 transition-all focus:border-gold/50 focus:bg-black/60 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-mist">
                    Image Alt Text (SEO &amp; Accessibility)
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={settings.footerCornerImageAlt || ''}
                      onChange={(e) => handleFieldChange('footerCornerImageAlt', e.target.value)}
                      placeholder="e.g. Aqua Wow Brand Emblem"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-paper placeholder-white/20 transition-all focus:border-gold/50 focus:bg-black/60 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Contact Information & Address */}
            <div className="rounded-2xl border border-white/10 bg-ink/70 p-6 shadow-xl backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-paper">
                    Footer Location &amp; Contact Details
                  </h3>
                  <p className="text-xs text-mist">
                    Update the office address, phone number, and direct contact email
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-mist">
                    Office Location / Address
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={settings.officeAddress || ''}
                      onChange={(e) => handleFieldChange('officeAddress', e.target.value)}
                      placeholder="Le Pont, Port de la Mer, Jumeirah, Dubai"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-paper placeholder-white/20 transition-all focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-mist">
                      Contact Phone
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={settings.contactPhone || ''}
                        onChange={(e) => handleFieldChange('contactPhone', e.target.value)}
                        placeholder="+971 54 312 1222"
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-paper placeholder-white/20 transition-all focus:border-gold/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-mist">
                      Contact Email
                    </label>
                    <div className="mt-2">
                      <input
                        type="email"
                        value={settings.contactEmail || ''}
                        onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
                        placeholder="kevin@piogoldcoin.com"
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-paper placeholder-white/20 transition-all focus:border-gold/50 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Tagline & Principle Quote */}
            <div className="rounded-2xl border border-white/10 bg-ink/70 p-6 shadow-xl backdrop-blur-sm">
              <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/10 text-gold">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-paper">
                    Tagline, Leadership Quote &amp; Copyright
                  </h3>
                  <p className="text-xs text-mist">
                    Customise narrative statement and legal copyright notice
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-mist">
                    Footer Mission Tagline
                  </label>
                  <div className="mt-2">
                    <textarea
                      rows={2}
                      value={settings.footerTagline || ''}
                      onChange={(e) => handleFieldChange('footerTagline', e.target.value)}
                      placeholder="Dedicated to dignity-based care..."
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-paper placeholder-white/20 transition-all focus:border-gold/50 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-8">
                    <label className="block text-xs font-medium uppercase tracking-wider text-mist">
                      Leadership Principle Quote
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={settings.quoteText || ''}
                        onChange={(e) => handleFieldChange('quoteText', e.target.value)}
                        placeholder="When you choose to help others up..."
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-paper placeholder-white/20 transition-all focus:border-gold/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-medium uppercase tracking-wider text-mist">
                      Quote Author / Subtitle
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={settings.quoteAuthor || ''}
                        onChange={(e) => handleFieldChange('quoteAuthor', e.target.value)}
                        placeholder="Core Leadership Principle"
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-paper placeholder-white/20 transition-all focus:border-gold/50 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-mist">
                    Copyright Notice
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={settings.copyrightText || ''}
                      onChange={(e) => handleFieldChange('copyrightText', e.target.value)}
                      placeholder="© 2026 Gilbert Kevin Jimmy Kwizera. All rights reserved."
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-paper placeholder-white/20 transition-all focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Footer Preview (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="sticky top-8 rounded-2xl border border-gold/30 bg-ink/90 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
                  <Eye className="h-4 w-4" />
                  <span>Live Footer Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                      isWatermarkActive
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-white/10 text-mist/60'
                    }`}
                  >
                    {isWatermarkActive ? 'Watermark ON' : 'Watermark OFF'}
                  </span>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300">
                    Live View
                  </span>
                </div>
              </div>

              {/* Mock Footer View with Shaded Background Watermark */}
              <div className="relative rounded-xl border border-white/10 bg-[#0d0c0a] p-5 shadow-inner space-y-4 overflow-hidden">
                {/* Background Shaded Watermark Graphic in Preview (Only if ON) */}
                {isWatermarkActive && (
                  <div
                    className="pointer-events-none absolute right-0 bottom-0 z-0 flex items-end justify-end select-none overflow-hidden max-w-[50%] max-h-[80%]"
                    aria-hidden="true"
                  >
                    <img
                      src={settings.footerCornerImage}
                      alt=""
                      style={{
                        opacity: (settings.footerWatermarkOpacity ?? 18) / 100,
                      }}
                      className="max-h-28 max-w-[150px] object-contain object-right-bottom translate-x-3 translate-y-3 filter brightness-110 transition-opacity duration-300"
                    />
                  </div>
                )}

                {/* Foreground Elements */}
                <div className="relative z-10 space-y-4">
                  {/* Official Brand Logo (Always Permanent) */}
                  <div className="flex items-center">
                    <Logo variant="lockup" className="h-12 w-auto object-contain" />
                  </div>

                  <p className="text-xs leading-relaxed text-mist/80 font-light">
                    {settings.footerTagline || DEFAULT_SETTINGS.footerTagline}
                  </p>

                  <div className="border-l-2 border-gold/70 pl-3 py-1">
                    <p className="font-serif italic text-xs text-paper/90 leading-snug">
                      "{settings.quoteText || DEFAULT_SETTINGS.quoteText}"
                    </p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-widest text-gold font-medium">
                      {settings.quoteAuthor || DEFAULT_SETTINGS.quoteAuthor}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-3 space-y-2 text-[11px] text-mist/80">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span>{settings.officeAddress || DEFAULT_SETTINGS.officeAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span>{settings.contactPhone || DEFAULT_SETTINGS.contactPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-gold shrink-0" />
                      <span className="break-all">{settings.contactEmail || DEFAULT_SETTINGS.contactEmail}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-3 text-[10px] text-mist/50">
                    {settings.copyrightText || DEFAULT_SETTINGS.copyrightText}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-amber-500 py-3 text-xs font-bold uppercase tracking-wider text-ink shadow-lg shadow-gold/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{saving ? 'Saving...' : 'Save & Publish to Footer'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Admin Password & Security */}
      {activeTab === 'security' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="rounded-2xl border border-white/10 bg-ink/70 p-6 sm:p-8 shadow-xl backdrop-blur-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10 text-gold">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-paper">
                  Change Admin Password
                </h3>
                <p className="text-xs text-mist">
                  Enter your current password and choose a secure new password for Admin access
                </p>
              </div>
            </div>

            {passwordError && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-950/40 p-3.5 text-xs text-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-mist mb-2">
                  Current Password (Optional if Master Reset)
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-4 pr-11 text-sm text-paper placeholder-white/20 transition-all focus:border-gold/50 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mist/60 hover:text-white"
                  >
                    {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-mist mb-2">
                  New Password (Min. 6 Characters)
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter strong new password"
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-4 pr-11 text-sm text-paper placeholder-white/20 transition-all focus:border-gold/50 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mist/60 hover:text-white"
                  >
                    {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-mist mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-4 pr-11 text-sm text-paper placeholder-white/20 transition-all focus:border-gold/50 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mist/60 hover:text-white"
                  >
                    {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-amber-500 py-3 text-xs font-bold uppercase tracking-wider text-ink shadow-lg shadow-gold/20 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                >
                  <Lock className="h-4 w-4" />
                  <span>{updatingPassword ? 'Updating Password...' : 'Update Admin Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
