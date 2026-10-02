import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Camera,
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
  MapPin,
  Calendar,
  Tag,
  Search,
  Filter,
  ArrowUpRight,
  Maximize2,
  FolderKanban,
  Layers,
} from 'lucide-react'
import { galleryAPI } from '../../services/api'
import { galleryCategories as defaultCategories, galleryItems as defaultStaticItems } from '../../data/gallery'

const PRESET_IMAGES = [
  { label: 'Executive Portrait (Dubai)', path: '/src/assets/images/gilbert-kwizera-executive.jpg' },
  { label: 'Lounge Armchair Reflection', path: '/src/assets/images/gilbert-kwizera-lounge-armchair.jpg' },
  { label: 'Office Standing View', path: '/src/assets/images/gilbert-kwizera-office-standing.jpg' },
  { label: 'Downtown Dubai Walking', path: '/src/assets/images/gilbert-kwizera-dubai-walking.jpg' },
  { label: 'Marble Lobby Governance', path: '/src/assets/images/gilbert-kwizera-marble-lobby.jpg' },
  { label: 'Hotel Entrance Mission', path: '/src/assets/images/gilbert-kwizera-hotel-entrance.jpg' },
  { label: 'Dubai Marina Yacht Talks', path: '/src/assets/images/gilbert-kwizera-dubai-marina-yacht.jpg' },
  { label: 'Sanjay Dutt Cultural Dialogue', path: '/src/assets/images/gilbert-kwizera-sanjay-dutt.jpg' },
  { label: 'CCF Compassionate Care', path: '/src/assets/images/ccf-cancer-care-compassion.jpg' },
  { label: 'Uganda Cancer Institute (UCI)', path: '/src/assets/images/ccf-uci.jpg' },
  { label: 'CCF Care Sanctuary Home', path: '/src/assets/images/ccf-care.jpg' },
  { label: 'Haven Welfare Support', path: '/src/assets/images/havenwelfare.jpg' },
  { label: 'School Education Drive', path: '/src/assets/images/Supporting-Education-Empowering-Futures.jpg' },
  { label: 'Classroom & Students Supplies', path: '/src/assets/images/Gilbert-Kwizera-Charity-Support-for-Uganda-Students-Drive.jpg' },
  { label: 'Salim Bwagu (Cancer Survivor)', path: '/src/assets/images/He-Battled-Cancer-for-24-Years.jpg' },
  { label: 'PIO Tech Ecosystem', path: '/src/assets/images/pio-ecosystem-technology.jpg' },
  { label: 'Employment Initiative Poster', path: '/src/assets/images/kwizera-humanitarian-employment-initiative.jpg' },
  { label: 'Blockchain Humanity Book', path: '/src/assets/images/Blockchain.jpg' },
  { label: 'Cancer Support Documentary', path: '/src/assets/images/Gilbert-Kwizera-Driving-Cancer-Support-and-Awareness-in-Uganda.jpg' },
  { label: 'Life of Hope & Charity', path: '/src/assets/images/Gilbert-Kevin-Jimmy-Kwizera-A-Life-Dedicated-to-Hope-and-Charity.jpg' },
  { label: 'Boardroom Strategic Innovation', path: '/src/assets/images/PIO-System-and-Gilbert-Kevin-Jimmy-Kwizeras-Innovation-Role.jpg' },
  { label: 'Foundational Years Portrait', path: '/src/assets/images/solution-kevin.jpg' },
  { label: 'Diplomatic Headshot', path: '/src/assets/images/about-kevin.jpg' },
]

const DEFAULT_GALLERY_DATA = {
  eyebrow: 'Archival Visuals',
  title: 'Moments of Service, Fieldwork & Leadership',
  leadText:
    'A complete photographic archive documenting over two decades of direct humanitarian fieldwork, cancer care foundations, school initiatives, and international strategic leadership.',
  categories: defaultCategories,
  items: defaultStaticItems.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    location: item.location,
    year: item.year,
    image: typeof item.image === 'string' ? item.image : '/src/assets/images/gilbert-kwizera-executive.jpg',
    position: item.position || 'center 10%',
    caption: item.caption || '',
    tag: item.tag || 'Initiative',
  })),
}

export default function GalleryManager() {
  const [galleryData, setGalleryData] = useState(DEFAULT_GALLERY_DATA)
  const [activeTab, setActiveTab] = useState('items') // 'items' | 'headings' | 'categories'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItemId, setSelectedItemId] = useState(DEFAULT_GALLERY_DATA.items[0]?.id || '')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [notification, setNotification] = useState(null)
  const [newCategoryInput, setNewCategoryInput] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchGalleryData()
  }, [])

  const fetchGalleryData = async () => {
    try {
      setLoading(true)
      const res = await galleryAPI.getGallery()
      if (res.success && res.data) {
        const fetched = {
          eyebrow: res.data.eyebrow || DEFAULT_GALLERY_DATA.eyebrow,
          title: res.data.title || DEFAULT_GALLERY_DATA.title,
          leadText: res.data.leadText || DEFAULT_GALLERY_DATA.leadText,
          categories:
            res.data.categories && res.data.categories.length > 0
              ? res.data.categories
              : DEFAULT_GALLERY_DATA.categories,
          items:
            res.data.items && res.data.items.length > 0
              ? res.data.items
              : DEFAULT_GALLERY_DATA.items,
        }
        setGalleryData(fetched)
        localStorage.setItem('gilbert_cached_gallery', JSON.stringify(fetched))
        if (fetched.items.length > 0 && !selectedItemId) {
          setSelectedItemId(fetched.items[0].id)
        }
      }
    } catch (error) {
      console.warn('Using local cached/fallback gallery data:', error.message)
      const cached = localStorage.getItem('gilbert_cached_gallery')
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          setGalleryData(parsed)
          if (parsed.items?.length > 0) setSelectedItemId(parsed.items[0].id)
        } catch (e) {
          setGalleryData(DEFAULT_GALLERY_DATA)
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
      const res = await galleryAPI.updateGallery(galleryData)
      if (res.success) {
        localStorage.setItem('gilbert_cached_gallery', JSON.stringify(galleryData))
        window.dispatchEvent(new CustomEvent('gilbert_gallery_updated', { detail: galleryData }))
        showToast('Archive & Gallery updated successfully! Website updated.')
      } else {
        throw new Error(res.message || 'Save failed')
      }
    } catch (error) {
      localStorage.setItem('gilbert_cached_gallery', JSON.stringify(galleryData))
      window.dispatchEvent(new CustomEvent('gilbert_gallery_updated', { detail: galleryData }))
      showToast('Saved to local session! (Database notice: ' + error.message + ')', 'success')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Reset all gallery items and archive to original default configuration?')) {
      setGalleryData(DEFAULT_GALLERY_DATA)
      setSelectedItemId(DEFAULT_GALLERY_DATA.items[0]?.id || '')
      showToast('Reset to defaults. Click "Save & Publish" to update.', 'info')
    }
  }

  // Filtered items
  const filteredItems = useMemo(() => {
    return galleryData.items.filter((item) => {
      const matchCat =
        selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter
      const matchSearch =
        searchQuery === '' ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.caption?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }, [galleryData.items, selectedCategoryFilter, searchQuery])

  // Selected item
  const selectedItem =
    galleryData.items.find((i) => i.id === selectedItemId) || galleryData.items[0]

  const updateSelectedItem = (updates) => {
    const updated = galleryData.items.map((item) =>
      item.id === selectedItem?.id ? { ...item, ...updates } : item
    )
    setGalleryData((prev) => ({
      ...prev,
      items: updated,
    }))
  }

  const handleAddNewItem = () => {
    const newId = `moment-${Date.now()}`
    const newItem = {
      id: newId,
      title: 'New Archival Moment',
      category: galleryData.categories[1] || 'Humanitarian & Care',
      location: 'Dubai, UAE',
      year: '2026',
      image: '/src/assets/images/gilbert-kwizera-executive.jpg',
      position: 'center 10%',
      caption: 'Brief description explaining this milestone, field mission, or partnership.',
      tag: 'Initiative',
    }
    const updated = [newItem, ...galleryData.items]
    setGalleryData((prev) => ({
      ...prev,
      items: updated,
    }))
    setSelectedItemId(newId)
    showToast('New archive card added! Customize the details below.')
  }

  const handleDeleteItem = (idToDelete) => {
    if (galleryData.items.length <= 1) {
      showToast('You must keep at least 1 item in the archive.', 'error')
      return
    }
    if (window.confirm('Are you sure you want to delete this archive card?')) {
      const updated = galleryData.items.filter((i) => i.id !== idToDelete)
      setGalleryData((prev) => ({
        ...prev,
        items: updated,
      }))
      if (selectedItemId === idToDelete) {
        setSelectedItemId(updated[0]?.id || '')
      }
      showToast('Archive card deleted.')
    }
  }

  // Image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('image', file)

      const res = await galleryAPI.uploadImage(formData)
      if (res.success && res.url) {
        updateSelectedItem({ image: res.url })
        showToast('Card image uploaded successfully!')
      }
    } catch (error) {
      const reader = new FileReader()
      reader.onload = () => {
        updateSelectedItem({ image: reader.result })
        showToast('Image set as local preview.')
      }
      reader.readAsDataURL(file)
    } finally {
      setUploadingImage(false)
    }
  }

  // Category management
  const handleAddCategory = () => {
    if (!newCategoryInput.trim()) return
    const cat = newCategoryInput.trim()
    if (!galleryData.categories.includes(cat)) {
      setGalleryData((prev) => ({
        ...prev,
        categories: [...prev.categories, cat],
      }))
      setNewCategoryInput('')
      showToast(`Category "${cat}" added!`)
    }
  }

  const handleRemoveCategory = (catToRemove) => {
    if (catToRemove === 'All') {
      showToast('Cannot remove "All" category filter.', 'error')
      return
    }
    setGalleryData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== catToRemove),
    }))
    showToast(`Category "${catToRemove}" removed.`)
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A15A] border-t-transparent" />
          <p className="text-sm text-mist/60">Loading Archive & Gallery Manager...</p>
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
            <Camera className="h-4 w-4" />
            <span>Interactive Portfolio CMS</span>
          </div>
          <h1 className="mt-1 font-serif text-2xl font-bold text-white sm:text-3xl">
            Archive & Photographic Gallery Editor
          </h1>
          <p className="mt-1 text-xs text-mist/70">
            Manage the complete archival visual grid ({galleryData.items.length} moments), categories, tags, and lightbox modals.
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

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('items')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
            activeTab === 'items'
              ? 'bg-[#C9A15A]/20 text-[#fae8be] border border-[#C9A15A]/40 font-semibold'
              : 'text-mist/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Layers className="h-4 w-4 text-[#C9A15A]" />
          <span>Archive Cards ({galleryData.items.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('headings')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
            activeTab === 'headings'
              ? 'bg-[#C9A15A]/20 text-[#fae8be] border border-[#C9A15A]/40 font-semibold'
              : 'text-mist/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Sparkles className="h-4 w-4 text-[#C9A15A]" />
          <span>Section Headings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
            activeTab === 'categories'
              ? 'bg-[#C9A15A]/20 text-[#fae8be] border border-[#C9A15A]/40 font-semibold'
              : 'text-mist/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <FolderKanban className="h-4 w-4 text-[#C9A15A]" />
          <span>Categories ({galleryData.categories.length})</span>
        </button>
      </div>

      {/* TAB 1: ARCHIVE CARDS & ITEMS */}
      {activeTab === 'items' && (
        <div className="space-y-8">
          {/* Controls Bar: Category Filters, Search & Add New Button */}
          <div className="rounded-2xl border border-white/10 bg-[#14120e] p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Category Pills Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-2xl">
                {galleryData.categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`rounded-full px-3 py-1.5 text-[0.68rem] font-medium uppercase tracking-wider transition-all whitespace-nowrap ${
                      selectedCategoryFilter === cat
                        ? 'bg-[#C9A15A] text-black font-semibold'
                        : 'bg-white/5 text-mist/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Add New Button */}
              <button
                type="button"
                onClick={handleAddNewItem}
                className="flex items-center gap-1.5 rounded-xl bg-[#C9A15A]/20 border border-[#C9A15A]/40 px-4 py-2 text-xs font-semibold text-[#fae8be] hover:bg-[#C9A15A] hover:text-black transition-all shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Add Archive Card</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archive items by title, location, tag, or year..."
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
              />
            </div>
          </div>

          {/* Cards Grid Selector */}
          <div className="rounded-2xl border border-white/10 bg-[#14120e] p-4">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-medium text-mist/70 uppercase tracking-wider">
                Showing {filteredItems.length} Archive Moments
              </span>
              <span className="text-[0.68rem] text-mist/40">
                Click any card to edit details
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-h-[380px] overflow-y-auto p-1">
              {filteredItems.map((item) => {
                const isSelected = item.id === selectedItemId
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`group relative flex items-center gap-3 rounded-xl p-2.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#C9A15A] bg-[#C9A15A]/15 text-white shadow-lg'
                        : 'border-white/5 bg-white/[0.02] text-mist/70 hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-black/40 border border-white/10">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/src/assets/images/gilbert-kwizera-executive.jpg'
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-1.5 text-[0.6rem] text-[#C9A15A] uppercase tracking-wider">
                        <span className="truncate">{item.tag || item.category}</span>
                        <span>•</span>
                        <span>{item.year}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                      <p className="text-[0.65rem] text-mist/50 truncate">{item.location}</p>
                    </div>

                    {/* Delete button */}
                    {galleryData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteItem(item.id)
                        }}
                        className="absolute right-2 top-2 p-1 text-mist/40 hover:text-red-400 transition-colors"
                        title="Delete card"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Active Card Editor & Simulator */}
          {selectedItem && (
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Form Controls */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Core Card Meta */}
                <div className="rounded-2xl border border-white/10 bg-[#14120e] p-6 space-y-4">
                  <h3 className="font-serif text-base font-semibold text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-[#C9A15A]" />
                      <span>Card Metadata & Text</span>
                    </span>
                    <span className="text-xs text-mist/50 font-sans">
                      ID: <code className="text-[#fae8be]">{selectedItem.id}</code>
                    </span>
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                        Moment Title
                      </label>
                      <input
                        type="text"
                        value={selectedItem.title}
                        onChange={(e) => updateSelectedItem({ title: e.target.value })}
                        placeholder="e.g. International Executive Consultation"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                        Category
                      </label>
                      <select
                        value={selectedItem.category}
                        onChange={(e) => updateSelectedItem({ category: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[#14120e] px-3.5 py-2.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none"
                      >
                        {galleryData.categories
                          .filter((c) => c !== 'All')
                          .map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                        Tag Badge Label
                      </label>
                      <input
                        type="text"
                        value={selectedItem.tag}
                        onChange={(e) => updateSelectedItem({ tag: e.target.value })}
                        placeholder="e.g. Executive / Healthcare / Outreach"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                        Location
                      </label>
                      <input
                        type="text"
                        value={selectedItem.location}
                        onChange={(e) => updateSelectedItem({ location: e.target.value })}
                        placeholder="e.g. Dubai, UAE or Kampala, Uganda"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                        Year / Period
                      </label>
                      <input
                        type="text"
                        value={selectedItem.year}
                        onChange={(e) => updateSelectedItem({ year: e.target.value })}
                        placeholder="e.g. 2026 or 2006–Present"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                        Caption / Summary Description
                      </label>
                      <textarea
                        rows={3}
                        value={selectedItem.caption}
                        onChange={(e) => updateSelectedItem({ caption: e.target.value })}
                        placeholder="Enter description for card & lightbox modal..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Photo & Image Picker */}
                <div className="rounded-2xl border border-white/10 bg-[#14120e] p-6 space-y-4">
                  <h3 className="font-serif text-base font-semibold text-white flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-[#C9A15A]" />
                    <span>Card Photo & Focal Position</span>
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
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Photo from Computer'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <label className="text-[0.68rem] text-mist/70 uppercase">Position:</label>
                        <select
                          value={selectedItem.position || 'center 10%'}
                          onChange={(e) => updateSelectedItem({ position: e.target.value })}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none"
                        >
                          <option value="center 8%" className="bg-[#14120e]">Top (8%)</option>
                          <option value="center 10%" className="bg-[#14120e]">Upper (10%)</option>
                          <option value="center 20%" className="bg-[#14120e]">Upper-Mid (20%)</option>
                          <option value="center center" className="bg-[#14120e]">Center</option>
                          <option value="center 80%" className="bg-[#14120e]">Bottom</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                        Image URL / File Path
                      </label>
                      <input
                        type="text"
                        value={selectedItem.image}
                        onChange={(e) => updateSelectedItem({ image: e.target.value })}
                        placeholder="/src/assets/images/... or https://..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                      />
                    </div>

                    {/* Quick Presets */}
                    <div>
                      <label className="block text-[0.68rem] font-medium text-mist/60 mb-2 uppercase tracking-wider">
                        Or Pick from Archive Photo Assets:
                      </label>
                      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
                        {PRESET_IMAGES.map((preset) => {
                          const isActive = selectedItem.image === preset.path
                          return (
                            <button
                              key={preset.path}
                              type="button"
                              onClick={() => updateSelectedItem({ image: preset.path })}
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

              {/* Right Column: Live Card Simulator */}
              <div className="lg:col-span-5 space-y-6">
                <div className="sticky top-28 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A15A] flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Live Public Card Simulator</span>
                    </span>
                    <a
                      href="/archive"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[0.68rem] text-mist hover:text-white"
                    >
                      <span>View Archive Page</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Public Card Simulator */}
                  <div className="group rounded-xl border border-white/15 bg-[#141311] overflow-hidden shadow-2xl transition-all">
                    {/* Simulated Image Area with B&W / Hover */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0D0D0C]">
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.title}
                        className="h-full w-full object-cover grayscale contrast-[1.05]"
                        style={{ objectPosition: selectedItem.position || 'center 10%' }}
                        onError={(e) => {
                          e.currentTarget.src = '/src/assets/images/gilbert-kwizera-executive.jpg'
                        }}
                      />
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-block border border-white/20 bg-[#0D0D0C]/80 px-2.5 py-1 text-[0.6rem] font-medium tracking-[0.18em] text-[#C9A15A] uppercase backdrop-blur-sm">
                          {selectedItem.tag || 'Initiative'}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3 z-10">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0D0D0C]/80 text-[#C9A15A] backdrop-blur-sm">
                          <Maximize2 className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Card Meta & Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-[0.62rem] tracking-[0.16em] text-paper/50 uppercase">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3 text-[#C9A15A]" />
                          {selectedItem.location || 'Location'}
                        </span>
                        <span>{selectedItem.year || '2026'}</span>
                      </div>

                      <h3 className="font-serif text-lg font-medium text-paper">
                        {selectedItem.title || 'Moment Title'}
                      </h3>

                      <p className="text-xs leading-relaxed text-paper/70 line-clamp-2">
                        {selectedItem.caption || 'Moment caption description...'}
                      </p>

                      <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[0.65rem] font-medium tracking-[0.18em] text-[#C9A15A] uppercase">
                        <span>View Details</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Helper Callout */}
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs text-mist/70 space-y-2">
                    <p className="font-medium text-white flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#C9A15A]" />
                      <span>Interactive Lightbox Ready</span>
                    </p>
                    <p className="text-[0.72rem] leading-relaxed">
                      On the live site, clicking any card opens a full-screen high-res modal lightbox with arrow key navigation and complete historical details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SECTION HEADINGS */}
      {activeTab === 'headings' && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#14120e] p-6 space-y-4">
              <h3 className="font-serif text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C9A15A]" />
                <span>Archive Section Headings</span>
              </h3>

              <div>
                <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                  Eyebrow Text
                </label>
                <input
                  type="text"
                  value={galleryData.eyebrow}
                  onChange={(e) => setGalleryData({ ...galleryData, eyebrow: e.target.value })}
                  placeholder="e.g. Archival Visuals"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={galleryData.title}
                  onChange={(e) => setGalleryData({ ...galleryData, title: e.target.value })}
                  placeholder="e.g. Moments of Service, Fieldwork & Leadership"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                  Lead Description
                </label>
                <textarea
                  rows={4}
                  value={galleryData.leadText}
                  onChange={(e) => setGalleryData({ ...galleryData, leadText: e.target.value })}
                  placeholder="Enter archival section description..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-[#0c0b09] p-8 text-white shadow-xl space-y-3">
              <span className="text-[0.68rem] uppercase tracking-[0.2em] font-semibold text-[#C9A15A]">
                {galleryData.eyebrow || 'Archival Visuals'}
              </span>
              <h2 className="font-serif text-2xl font-bold leading-tight text-white">
                {galleryData.title || 'Moments of Service'}
              </h2>
              <p className="text-xs leading-relaxed text-mist/70">
                {galleryData.leadText}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES MANAGER */}
      {activeTab === 'categories' && (
        <div className="max-w-2xl space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#14120e] p-6 space-y-6">
            <h3 className="font-serif text-base font-semibold text-white flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-[#C9A15A]" />
              <span>Archive Filter Categories</span>
            </h3>

            <div className="space-y-2">
              {galleryData.categories.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3"
                >
                  <span className="text-xs font-medium text-white">{cat}</span>
                  {cat !== 'All' ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(cat)}
                      className="p-1 text-mist/40 hover:text-red-400 transition-colors"
                      title="Remove Category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : (
                    <span className="text-[0.65rem] text-mist/40 uppercase">Default</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <input
                type="text"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCategory()
                  }
                }}
                placeholder="Enter new category name..."
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="rounded-xl bg-[#C9A15A] px-5 py-2.5 text-xs font-semibold text-black hover:brightness-110 transition-all"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
