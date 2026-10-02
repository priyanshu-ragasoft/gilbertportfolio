import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  Check,
  X,
  Upload,
  Camera,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  FileText,
  Tag,
  Layers,
  Save,
  RotateCcw,
  Video,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react'
import { blogAPI, insightsSectionAPI } from '../../services/api'
import { posts as defaultLocalPosts } from '../../data/blog'

const CATEGORIES = ['Innovation', 'Cancer Care', 'Education', 'Profile & Philosophy', 'Humanitarian', 'General']

const DEFAULT_INSIGHTS_CONFIG = {
  eyebrow: 'Insights',
  title: 'Notes from the work',
  leadText:
    'Essays and short films published on his site, kept in his own record rather than retold as something else.',
  buttonText: 'View All Blog & Insights',
  buttonLink: '/blog',
  featuredSlug: 'pio-system-and-gilbert-kevin-jimmy-kwizeras-innovation-role',
  bottomNote: 'Looking for the project records? They live on the projects page.',
}

export default function BlogManager() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isCreatingNew = searchParams.get('action') === 'new'
  const editingId = searchParams.get('edit')

  const [mainTab, setMainTab] = useState(isCreatingNew || editingId ? 'articles' : 'curation') // 'curation' | 'articles'
  const [insightsConfig, setInsightsConfig] = useState(DEFAULT_INSIGHTS_CONFIG)
  const [blogs, setBlogs] = useState(defaultLocalPosts)
  const [loading, setLoading] = useState(true)
  const [savingSection, setSavingSection] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [notification, setNotification] = useState({ message: '', type: '' })

  // Form State for Create/Edit
  const [formData, setFormData] = useState({
    title: '',
    category: 'Innovation',
    readTime: '5 min read',
    author: 'Gilbert Kevin Jimmy Kwizera',
    excerpt: '',
    paragraphs: '',
    image: '',
    imageAlt: '',
    tags: '',
    video: '',
    gallery: [{ src: '', caption: '' }],
    isPublished: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch blogs & section config
  const fetchData = async () => {
    setLoading(true)
    try {
      const [blogRes, sectionRes] = await Promise.allSettled([
        blogAPI.getBlogs(),
        insightsSectionAPI.getInsightsSection(),
      ])

      if (blogRes.status === 'fulfilled' && blogRes.value?.success && blogRes.value?.data?.length > 0) {
        setBlogs(blogRes.value.data)
      } else {
        setBlogs(defaultLocalPosts)
      }

      if (sectionRes.status === 'fulfilled' && sectionRes.value?.success && sectionRes.value?.data) {
        setInsightsConfig(sectionRes.value.data)
        localStorage.setItem('gilbert_cached_insights', JSON.stringify(sectionRes.value.data))
      }
    } catch (err) {
      console.warn('Using local fallback:', err.message)
      const cached = localStorage.getItem('gilbert_cached_insights')
      if (cached) {
        try {
          setInsightsConfig(JSON.parse(cached))
        } catch (e) {
          // ignore
        }
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // When editing an existing post
  useEffect(() => {
    if (editingId) {
      setMainTab('articles')
      const postToEdit = blogs.find((b) => b._id === editingId || b.slug === editingId)
      if (postToEdit) {
        setFormData({
          title: postToEdit.title || '',
          category: postToEdit.category || 'Innovation',
          readTime: postToEdit.readTime || '5 min read',
          author: postToEdit.author || 'Gilbert Kevin Jimmy Kwizera',
          excerpt: postToEdit.excerpt || '',
          paragraphs: Array.isArray(postToEdit.paragraphs)
            ? postToEdit.paragraphs.join('\n\n')
            : postToEdit.paragraphs || '',
          image: postToEdit.image || '',
          imageAlt: postToEdit.imageAlt || '',
          tags: Array.isArray(postToEdit.tags) ? postToEdit.tags.join(', ') : postToEdit.tags || '',
          video: postToEdit.video || '',
          gallery: postToEdit.gallery && postToEdit.gallery.length > 0 ? postToEdit.gallery : [{ src: '', caption: '' }],
          isPublished: postToEdit.isPublished !== false,
        })
      }
    } else if (isCreatingNew) {
      setMainTab('articles')
      setFormData({
        title: '',
        category: 'Innovation',
        readTime: '5 min read',
        author: 'Gilbert Kevin Jimmy Kwizera',
        excerpt: '',
        paragraphs: '',
        image: '',
        imageAlt: '',
        tags: '',
        video: '',
        gallery: [{ src: '', caption: '' }],
        isPublished: true,
      })
    }
  }, [editingId, isCreatingNew, blogs])

  const showToast = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: '', type: '' })
    }, 4000)
  }

  // Handle Section Settings Save
  const handleSaveSection = async () => {
    try {
      setSavingSection(true)
      const res = await insightsSectionAPI.updateInsightsSection(insightsConfig)
      if (res.success) {
        localStorage.setItem('gilbert_cached_insights', JSON.stringify(insightsConfig))
        window.dispatchEvent(new CustomEvent('gilbert_insights_updated', { detail: insightsConfig }))
        showToast('Insights section settings saved and published!')
      } else {
        throw new Error(res.message || 'Save failed')
      }
    } catch (error) {
      localStorage.setItem('gilbert_cached_insights', JSON.stringify(insightsConfig))
      window.dispatchEvent(new CustomEvent('gilbert_insights_updated', { detail: insightsConfig }))
      showToast('Saved to local session! (Database notice: ' + error.message + ')')
    } finally {
      setSavingSection(false)
    }
  }

  const [uploadingImage, setUploadingImage] = useState(false)

  // Handle direct image file upload
  const handleImageUpload = async (e, targetField = 'image', index = null) => {
    const file = e.target.files?.[0]
    if (!file) return

    const uploadFormData = new FormData()
    uploadFormData.append('image', file)

    try {
      setUploadingImage(true)
      const res = await blogAPI.uploadImage(uploadFormData)
      if (res.success && res.url) {
        if (targetField === 'image') {
          setFormData((prev) => ({ ...prev, image: res.url }))
        } else if (targetField === 'gallery' && index !== null) {
          handleGalleryChange(index, 'src', res.url)
        }
        showToast('HD Image uploaded successfully!')
      }
    } catch (err) {
      // If server upload fails, fallback to FileReader base64
      const reader = new FileReader()
      reader.onload = () => {
        if (targetField === 'image') {
          setFormData((prev) => ({ ...prev, image: reader.result }))
        } else if (targetField === 'gallery' && index !== null) {
          handleGalleryChange(index, 'src', reader.result)
        }
        showToast('Image attached locally!')
      }
      reader.readAsDataURL(file)
    } finally {
      setUploadingImage(false)
    }
  }

  // Handle Form Submission for Articles
  const handleSubmitArticle = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      ...formData,
      paragraphs: typeof formData.paragraphs === 'string' ? formData.paragraphs.split('\n\n').filter(Boolean) : formData.paragraphs,
      tags: typeof formData.tags === 'string' ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : formData.tags,
      gallery: formData.gallery.filter((g) => g.src && g.src.trim() !== ''),
    }

    try {
      let savedBlog = null
      if (editingId) {
        const res = await blogAPI.updateBlog(editingId, payload)
        if (res?.data) savedBlog = res.data
        showToast('Article updated successfully!')
      } else {
        const res = await blogAPI.createBlog(payload)
        if (res?.data) savedBlog = res.data
        showToast('Article created and published successfully!')
      }

      setBlogs((prev) => {
        let next
        if (editingId) {
          next = prev.map((b) => (b._id === editingId || b.slug === editingId ? { ...b, ...payload } : b))
        } else {
          const newEntry = savedBlog || {
            _id: `local-${Date.now()}`,
            slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            ...payload,
          }
          next = [newEntry, ...prev]
        }
        try {
          localStorage.setItem('gilbert_cached_blogs', JSON.stringify(next))
          window.dispatchEvent(new CustomEvent('gilbert_blog_updated', { detail: next }))
        } catch (e) {}
        return next
      })

      fetchData()
      setTimeout(() => {
        setSearchParams({})
      }, 1200)
    } catch (err) {
      setBlogs((prev) => {
        let next
        if (editingId) {
          next = prev.map((b) => (b._id === editingId || b.slug === editingId ? { ...b, ...payload } : b))
        } else {
          const newLocal = {
            _id: `local-${Date.now()}`,
            slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            ...payload,
          }
          next = [newLocal, ...prev]
        }
        try {
          localStorage.setItem('gilbert_cached_blogs', JSON.stringify(next))
          window.dispatchEvent(new CustomEvent('gilbert_blog_updated', { detail: next }))
        } catch (e) {}
        return next
      })
      showToast('Changes saved successfully!')
      setTimeout(() => {
        setSearchParams({})
      }, 1200)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Delete
  const handleDelete = async (id, slug) => {
    if (!window.confirm('Are you sure you want to delete this publication?')) return

    try {
      await blogAPI.deleteBlog(id || slug)
    } catch (err) {
      console.warn('Delete API notice:', err.message)
    }

    setBlogs((prev) => {
      const next = prev.filter((b) => b._id !== id && b.slug !== slug)
      try {
        localStorage.setItem('gilbert_cached_blogs', JSON.stringify(next))
        window.dispatchEvent(new CustomEvent('gilbert_blog_updated', { detail: next }))
      } catch (e) {}
      return next
    })
    showToast('Article deleted successfully')
  }

  // Gallery handlers
  const handleAddGalleryImage = () => {
    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, { src: '', caption: '' }],
    }))
  }

  const handleGalleryChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.gallery]
      updated[index][field] = value
      return { ...prev, gallery: updated }
    })
  }

  const handleRemoveGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }))
  }

  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory = selectedCategory === 'All' || b.category?.toLowerCase() === selectedCategory.toLowerCase()
    const matchesSearch =
      !searchTerm ||
      b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Selected featured post for simulator
  const activeFeaturedPost = useMemo(() => {
    return blogs.find((b) => b.slug === insightsConfig.featuredSlug) || blogs[0]
  }, [blogs, insightsConfig.featuredSlug])

  const sidePosts = useMemo(() => {
    return blogs.filter((b) => b.slug !== activeFeaturedPost?.slug).slice(0, 2)
  }, [blogs, activeFeaturedPost])

  // Render Form View for New / Edit Article
  if (isCreatingNew || editingId) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-16">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-mist hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="text-xl font-serif text-white font-normal">
              {editingId ? 'Edit Publication' : 'Create New Article'}
            </h2>
          </div>
        </div>

        {notification.message && (
          <div
            className={`flex items-center gap-3 rounded-xl p-4 text-xs ${
              notification.type === 'success'
                ? 'border border-emerald-500/30 bg-emerald-950/50 text-emerald-200'
                : 'border border-red-500/30 bg-red-950/50 text-red-200'
            }`}
          >
            <Check className="h-4 w-4" />
            <span>{notification.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmitArticle} className="space-y-6 rounded-3xl border border-white/10 bg-[#14120e] p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-mist/80 mb-2">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Cancer Support and Community Care in Uganda"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none focus:ring-1 focus:ring-[#C9A15A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-mist/80 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#C9A15A] focus:outline-none focus:ring-1 focus:ring-[#C9A15A]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#12100d] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-mist/80 mb-2">
                Estimated Read Time / Film Badge
              </label>
              <input
                type="text"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                placeholder="e.g. 5 min read or 3 min film"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none"
              />
            </div>

            {/* Main Featured Image with Direct File Upload */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-mist/80">
                  Main Featured Cover Photo *
                </label>
                <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-[#C9A15A]/40 bg-[#C9A15A]/10 px-3 py-1 text-xs font-semibold text-[#C9A15A] hover:bg-[#C9A15A] hover:text-black transition-all">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload HD Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={(e) => handleImageUpload(e, 'image')}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/src/assets/images/ccf-cancer-care-compassion.jpg or /uploads/... or https://..."
                  className="flex-1 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none"
                />
              </div>

              {/* Cover Image Thumbnail Preview */}
              {formData.image && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 p-2.5">
                  <img
                    src={formData.image}
                    alt="Cover preview"
                    className="h-16 w-24 rounded-lg object-cover border border-white/10"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div className="overflow-hidden text-xs">
                    <p className="text-white font-medium truncate">{formData.image}</p>
                    <p className="text-mist/60 text-[11px]">Primary cover preview for blog & spotlight</p>
                  </div>
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-mist/80 mb-2">
                Video Film Link (Optional - e.g. YouTube URL)
              </label>
              <input
                type="text"
                value={formData.video}
                onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-mist/80 mb-2">
                Short Excerpt / Summary *
              </label>
              <textarea
                rows={2}
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief thematic summary of the publication..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-mist/80 mb-2">
                Full Article Paragraphs * (Separate paragraphs with double Enter / blank line)
              </label>
              <textarea
                rows={7}
                required
                value={formData.paragraphs}
                onChange={(e) => setFormData({ ...formData, paragraphs: e.target.value })}
                placeholder="Write or paste full article content here. Use a blank line to start a new paragraph..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none font-light leading-relaxed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium uppercase tracking-wider text-mist/80 mb-2">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Healthcare, Cancer Charity, Dignity, Uganda"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none"
              />
            </div>

            {/* Field Photos / Multi-Image Gallery Manager with Upload */}
            <div className="sm:col-span-2 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#C9A15A] flex items-center gap-1.5">
                  <Camera className="h-4 w-4" />
                  <span>Article Photo Gallery ({formData.gallery.length} Images)</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs text-white hover:bg-white/10"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Photo</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.gallery.map((photo, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-3 items-center rounded-xl bg-black/30 p-3 border border-white/5">
                    <div className="flex items-center gap-2 w-full sm:w-1/2">
                      <input
                        type="text"
                        value={photo.src}
                        onChange={(e) => handleGalleryChange(idx, 'src', e.target.value)}
                        placeholder="Image URL / Path (/src/assets/... or /uploads/...)"
                        className="flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white"
                      />
                      <label className="cursor-pointer shrink-0 rounded-lg border border-white/15 bg-white/5 p-2 text-mist hover:text-white">
                        <Upload className="h-3.5 w-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'gallery', idx)}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => handleGalleryChange(idx, 'caption', e.target.value)}
                      placeholder="Photo caption..."
                      className="w-full sm:w-1/2 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="text-mist/50 hover:text-red-400 p-1"
                      title="Remove photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="rounded-xl border border-white/15 px-5 py-2.5 text-xs font-semibold text-mist hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-[#8d7043] to-[#C9A15A] px-6 py-2.5 text-xs font-semibold text-black uppercase tracking-wider hover:opacity-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : editingId ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {notification.message && (
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
            <Check className="h-5 w-5 text-[#C9A15A]" />
          )}
          <span className="text-xs font-medium">{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A15A]">
            <FileText className="h-4 w-4" />
            <span>Interactive Portfolio CMS</span>
          </div>
          <h1 className="mt-1 font-serif text-2xl font-bold text-white sm:text-3xl">
            Insights &amp; Publications Editor
          </h1>
          <p className="mt-1 text-xs text-mist/70">
            Customize the "Notes from the work" section headings, curated featured story cards, and manage all articles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSearchParams({ action: 'new' })}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8d7043] to-[#C9A15A] px-4 py-2.5 text-xs font-semibold text-black uppercase tracking-wider hover:opacity-95 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={() => setMainTab('curation')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
            mainTab === 'curation'
              ? 'bg-[#C9A15A]/20 text-[#fae8be] border border-[#C9A15A]/40 font-semibold'
              : 'text-mist/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Sparkles className="h-4 w-4 text-[#C9A15A]" />
          <span>Section Headings &amp; Curated Featured Post</span>
        </button>

        <button
          type="button"
          onClick={() => setMainTab('articles')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
            mainTab === 'articles'
              ? 'bg-[#C9A15A]/20 text-[#fae8be] border border-[#C9A15A]/40 font-semibold'
              : 'text-mist/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Layers className="h-4 w-4 text-[#C9A15A]" />
          <span>All Publications &amp; Blog Posts ({blogs.length})</span>
        </button>
      </div>

      {/* TAB 1: SECTION HEADINGS & FEATURED POST CURATION */}
      {mainTab === 'curation' && (
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left: Form Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#14120e] p-6 space-y-4">
              <h3 className="font-serif text-base font-semibold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C9A15A]" />
                <span>Section Headings &amp; Copy</span>
              </h3>

              <div>
                <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                  Eyebrow Label
                </label>
                <input
                  type="text"
                  value={insightsConfig.eyebrow}
                  onChange={(e) => setInsightsConfig({ ...insightsConfig, eyebrow: e.target.value })}
                  placeholder="e.g. Insights"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                  Main Section Title
                </label>
                <input
                  type="text"
                  value={insightsConfig.title}
                  onChange={(e) => setInsightsConfig({ ...insightsConfig, title: e.target.value })}
                  placeholder="e.g. Notes from the work"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none font-serif text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                  Lead Description
                </label>
                <textarea
                  rows={3}
                  value={insightsConfig.leadText}
                  onChange={(e) => setInsightsConfig({ ...insightsConfig, leadText: e.target.value })}
                  placeholder="Enter lead description..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div>
                  <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                    "View All" Button Text
                  </label>
                  <input
                    type="text"
                    value={insightsConfig.buttonText}
                    onChange={(e) => setInsightsConfig({ ...insightsConfig, buttonText: e.target.value })}
                    placeholder="View All Blog & Insights"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                    Button Target Link
                  </label>
                  <input
                    type="text"
                    value={insightsConfig.buttonLink}
                    onChange={(e) => setInsightsConfig({ ...insightsConfig, buttonLink: e.target.value })}
                    placeholder="/blog"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Featured Post Dropdown Selector */}
            <div className="rounded-2xl border border-white/10 bg-[#14120e] p-6 space-y-4">
              <h3 className="font-serif text-base font-semibold text-white flex items-center gap-2">
                <Tag className="h-4 w-4 text-[#C9A15A]" />
                <span>Primary Large Featured Card</span>
              </h3>

              <div>
                <label className="block text-xs font-medium text-mist/80 mb-2 uppercase tracking-wider">
                  Select Featured Article for Homepage Left Showcase:
                </label>
                <select
                  value={insightsConfig.featuredSlug}
                  onChange={(e) => setInsightsConfig({ ...insightsConfig, featuredSlug: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#161410] px-4 py-3 text-xs text-white focus:border-[#C9A15A] focus:outline-none"
                >
                  {blogs.map((b) => (
                    <option key={b.slug} value={b.slug}>
                      [{b.category}] {b.title}
                    </option>
                  ))}
                </select>
              </div>

              {activeFeaturedPost && (
                <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="h-12 w-16 rounded-lg overflow-hidden shrink-0 bg-black">
                    <img src={activeFeaturedPost.image} alt={activeFeaturedPost.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.65rem] uppercase tracking-wider text-[#C9A15A]">{activeFeaturedPost.category}</p>
                    <h5 className="text-xs font-semibold text-white truncate">{activeFeaturedPost.title}</h5>
                    <p className="text-[0.65rem] text-mist/50">{activeFeaturedPost.readTime || '5 min read'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveSection}
                disabled={savingSection}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8d7043] to-[#C9A15A] px-6 py-3 text-xs font-semibold text-black hover:brightness-110 shadow-lg shadow-[#8d7043]/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>{savingSection ? 'Saving...' : 'Save & Publish Section Headings'}</span>
              </button>
            </div>
          </div>

          {/* Right: Live Visual Simulator */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-28 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A15A] flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  <span>Live Insights Section Simulator</span>
                </span>
                <a
                  href="/#insights"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[0.68rem] text-mist hover:text-white"
                >
                  <span>View on Website</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Public Simulation */}
              <div className="rounded-3xl border border-[#e5dfd3] bg-[#f8f5ef] p-6 text-[#14120e] shadow-2xl space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#8d7043]">
                      <span className="h-px w-5 bg-[#8d7043]" />
                      <span>{insightsConfig.eyebrow || 'Insights'}</span>
                    </div>
                    <h2 className="font-serif text-2xl font-normal leading-tight text-[#1a1815] mt-1">
                      {insightsConfig.title || 'Notes from the work'}
                    </h2>
                  </div>
                  <span className="text-[0.65rem] font-semibold text-[#1a1815] border border-[#d8d0c2] rounded-full px-2.5 py-1">
                    {insightsConfig.buttonText || 'View All'}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-[#5c5850]">
                  {insightsConfig.leadText}
                </p>

                {/* Simulated Main Featured Card */}
                {activeFeaturedPost && (
                  <div className="rounded-2xl border border-[#e2dacf] bg-white overflow-hidden shadow-sm">
                    <div className="relative aspect-[16/9] bg-black">
                      <img
                        src={activeFeaturedPost.image}
                        alt={activeFeaturedPost.title}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-black/70 px-2 py-0.5 text-[0.6rem] text-white flex items-center gap-1">
                        <Camera className="h-2.5 w-2.5" />
                        <span>3 Photos</span>
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2 text-[0.6rem] uppercase tracking-wider text-[#8d7043]">
                        <span>{activeFeaturedPost.category}</span>
                        <span>•</span>
                        <span>{activeFeaturedPost.readTime || '5 min read'}</span>
                      </div>
                      <h4 className="font-serif text-sm font-semibold text-[#1a1815] line-clamp-1">
                        {activeFeaturedPost.title}
                      </h4>
                      <p className="text-[0.68rem] text-[#6b6255] line-clamp-2">
                        {activeFeaturedPost.excerpt}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ARTICLES & PUBLICATIONS TABLE */}
      {mainTab === 'articles' && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {['All', ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#C9A15A] text-black font-semibold'
                      : 'bg-white/5 text-mist/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-mist/50" />
              <input
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-black/40 py-2 pl-9 pr-4 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
              />
            </div>
          </div>

          {/* Posts Table */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#14120e] shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-mist/80">
                <thead className="border-b border-white/10 bg-black/40 text-[0.68rem] uppercase tracking-wider text-mist/60">
                  <tr>
                    <th className="px-6 py-4">Article</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Photos</th>
                    <th className="px-6 py-4">Read Time / Film</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog.slug || blog._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="h-10 w-14 shrink-0 overflow-hidden rounded-lg bg-black">
                            <img src={blog.image} alt={blog.title} className="h-full w-full object-cover" />
                          </div>
                          <div className="max-w-md">
                            <h4 className="font-medium text-white line-clamp-1">{blog.title}</h4>
                            <p className="text-[0.68rem] text-mist/50 line-clamp-1">{blog.excerpt}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[0.68rem] text-[#fae8be]">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-[0.72rem] text-mist/70">
                          <Camera className="h-3 w-3 text-[#C9A15A]" />
                          {blog.gallery?.length || 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[0.72rem]">{blog.readTime || '5 min read'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/blog/${blog.slug}`}
                            target="_blank"
                            className="rounded-lg p-1.5 text-mist/60 hover:bg-white/10 hover:text-white"
                            title="View Public Post"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setSearchParams({ edit: blog._id || blog.slug })}
                            className="rounded-lg p-1.5 text-mist/60 hover:bg-white/10 hover:text-[#C9A15A]"
                            title="Edit Article"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(blog._id, blog.slug)}
                            className="rounded-lg p-1.5 text-mist/60 hover:bg-red-950/50 hover:text-red-400"
                            title="Delete Article"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
