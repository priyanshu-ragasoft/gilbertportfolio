import { useState, useEffect, useRef } from 'react'
import {
  Briefcase,
  Save,
  RotateCcw,
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ChevronRight,
  Eye,
  Layers,
  ArrowUpRight,
  Calendar,
  Tag,
  FileText,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { projectAPI } from '../../services/api'
import { projects as defaultStaticProjects } from '../../data/projects'

const PRESET_IMAGES = [
  { label: 'School Education Drive', path: '/src/assets/images/Supporting-Education-Empowering-Futures.jpg' },
  { label: 'Classroom & Students', path: '/src/assets/images/Gilbert-Kwizera-Charity-Support-for-Uganda-Students-Drive.jpg' },
  { label: 'Salim Bwagu (Cancer Survivor)', path: '/src/assets/images/He-Battled-Cancer-for-24-Years.jpg' },
  { label: 'CCF Compassionate Care', path: '/src/assets/images/ccf-cancer-care-compassion.jpg' },
  { label: 'Uganda Cancer Institute', path: '/src/assets/images/ccf-uci.jpg' },
  { label: 'Gladys Nsereko Portrait', path: '/src/assets/images/pa.jpeg' },
  { label: 'Gladys Nsereko Full View', path: '/src/assets/images/pe.jpeg' },
  { label: 'Apple Jackie Portrait', path: '/src/assets/images/jack1.jpg' },
  { label: 'Apple Jackie Recovery', path: '/src/assets/images/jack2.jpg' },
  { label: 'Employment Initiative Poster', path: '/src/assets/images/kwizera-humanitarian-employment-initiative.jpg' },
  { label: 'Sanjay Dutt Cultural Dialogue', path: '/src/assets/images/gilbert-kwizera-sanjay-dutt.jpg' },
  { label: 'International Consultancy', path: '/src/assets/images/gilbert-kwizera-hotel-entrance.jpg' },
  { label: 'Dubai Marina Yacht', path: '/src/assets/images/gilbert-kwizera-dubai-marina-yacht.jpg' },
  { label: 'Haven Welfare Support', path: '/src/assets/images/havenwelfare.jpg' },
]

const DEFAULT_SECTION_DATA = {
  eyebrow: 'Selected work',
  title: 'Projects That Impact Lives',
  leadText:
    'Documented initiatives spanning education in Fort Portal, cancer care advocacy, pan-African employment awareness, and global cultural dialogue.',
  projects: defaultStaticProjects.map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    date: p.date,
    image: typeof p.image === 'string' ? p.image : '/src/assets/images/Supporting-Education-Empowering-Futures.jpg',
    heroImage: typeof p.heroImage === 'string' ? p.heroImage : '',
    imageAlt: p.imageAlt || '',
    imageFit: p.imageFit || 'cover',
    summary: p.summary || '',
    paragraphs: Array.isArray(p.paragraphs) ? [...p.paragraphs] : [],
    tags: Array.isArray(p.tags) ? [...p.tags] : [],
    gallery: Array.isArray(p.gallery)
      ? p.gallery.map((g) => ({
          src: typeof g.src === 'string' ? g.src : '',
          alt: g.alt || '',
          position: g.position || 'center top',
          className: g.className || 'aspect-[4/3]',
          parallax: !!g.parallax,
          fit: g.fit || 'cover',
        }))
      : [],
  })),
}

export default function ProjectManager() {
  const [sectionData, setSectionData] = useState(DEFAULT_SECTION_DATA)
  const [activeTab, setActiveTab] = useState('projects') // 'projects' | 'header'
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [notification, setNotification] = useState(null)
  const fileInputRef = useRef(null)
  const galleryFileInputRef = useRef(null)
  const [newTagInput, setNewTagInput] = useState('')

  useEffect(() => {
    fetchProjectsData()
  }, [])

  const fetchProjectsData = async () => {
    try {
      setLoading(true)
      const res = await projectAPI.getProjects()
      if (res.success && res.data) {
        const fetched = {
          eyebrow: res.data.eyebrow || DEFAULT_SECTION_DATA.eyebrow,
          title: res.data.title || DEFAULT_SECTION_DATA.title,
          leadText: res.data.leadText || DEFAULT_SECTION_DATA.leadText,
          projects:
            res.data.projects && res.data.projects.length > 0
              ? res.data.projects
              : DEFAULT_SECTION_DATA.projects,
        }
        setSectionData(fetched)
        localStorage.setItem('gilbert_cached_projects', JSON.stringify(fetched))
      }
    } catch (error) {
      console.warn('Using local cached/fallback projects data:', error.message)
      const cached = localStorage.getItem('gilbert_cached_projects')
      if (cached) {
        try {
          setSectionData(JSON.parse(cached))
        } catch (e) {
          setSectionData(DEFAULT_SECTION_DATA)
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
      const res = await projectAPI.updateProjects(sectionData)
      if (res.success) {
        localStorage.setItem('gilbert_cached_projects', JSON.stringify(sectionData))
        window.dispatchEvent(new CustomEvent('gilbert_projects_updated', { detail: sectionData }))
        showToast('Projects section updated successfully! Website is now updated.')
      } else {
        throw new Error(res.message || 'Save failed')
      }
    } catch (error) {
      // Fallback: save to local cache
      localStorage.setItem('gilbert_cached_projects', JSON.stringify(sectionData))
      window.dispatchEvent(new CustomEvent('gilbert_projects_updated', { detail: sectionData }))
      showToast('Saved to local session successfully! (Database sync notice: ' + error.message + ')', 'success')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('Reset all projects and headings to initial original configuration?')) {
      setSectionData(DEFAULT_SECTION_DATA)
      setSelectedProjectIndex(0)
      showToast('Reset to default values. Click "Save Changes" to publish.', 'info')
    }
  }

  // Selected project helpers
  const currentProject = sectionData.projects[selectedProjectIndex] || sectionData.projects[0]

  const updateCurrentProject = (updates) => {
    const updatedList = [...sectionData.projects]
    updatedList[selectedProjectIndex] = {
      ...updatedList[selectedProjectIndex],
      ...updates,
    }
    setSectionData((prev) => ({
      ...prev,
      projects: updatedList,
    }))
  }

  const handleAddNewProject = () => {
    const newSlug = `new-project-${Date.now()}`
    const newProjectItem = {
      slug: newSlug,
      title: 'New Featured Project',
      category: 'Community Initiative',
      date: '2026',
      image: '/src/assets/images/Supporting-Education-Empowering-Futures.jpg',
      heroImage: '',
      imageAlt: 'Project showcase photo',
      imageFit: 'cover',
      summary: 'Enter a concise summary highlighting the purpose, impact, and beneficiaries of this project.',
      paragraphs: [
        'Detailed narrative of the project initiative, explaining how it was planned, implemented, and the tangible positive changes created.',
      ],
      tags: ['Initiative', 'Community', 'Empowerment'],
      gallery: [],
    }
    const updatedList = [...sectionData.projects, newProjectItem]
    setSectionData((prev) => ({
      ...prev,
      projects: updatedList,
    }))
    setSelectedProjectIndex(updatedList.length - 1)
    showToast('New project card added! Fill in the details below.')
  }

  const handleDeleteProject = (indexToDelete) => {
    if (sectionData.projects.length <= 1) {
      showToast('You must keep at least 1 project in the section.', 'error')
      return
    }
    if (window.confirm(`Delete project "${sectionData.projects[indexToDelete].title}"?`)) {
      const updatedList = sectionData.projects.filter((_, idx) => idx !== indexToDelete)
      setSectionData((prev) => ({
        ...prev,
        projects: updatedList,
      }))
      setSelectedProjectIndex(Math.max(0, indexToDelete - 1))
      showToast('Project deleted.')
    }
  }

  // Image Upload handler
  const handleImageUpload = async (e, isGallery = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const formData = new FormData()
      formData.append('image', file)

      const res = await projectAPI.uploadImage(formData)
      if (res.success && res.url) {
        if (isGallery) {
          const newGalleryItem = {
            src: res.url,
            alt: currentProject.title + ' gallery photo',
            position: 'center top',
            className: 'aspect-[4/3]',
            parallax: false,
            fit: 'cover',
          }
          updateCurrentProject({
            gallery: [...(currentProject.gallery || []), newGalleryItem],
          })
          showToast('Gallery image uploaded and added!')
        } else {
          updateCurrentProject({ image: res.url })
          showToast('Main project image uploaded successfully!')
        }
      }
    } catch (error) {
      // Local preview fallback if backend storage is offline
      const reader = new FileReader()
      reader.onload = () => {
        if (isGallery) {
          const newGalleryItem = {
            src: reader.result,
            alt: currentProject.title + ' gallery photo',
            position: 'center top',
            className: 'aspect-[4/3]',
            parallax: false,
            fit: 'cover',
          }
          updateCurrentProject({
            gallery: [...(currentProject.gallery || []), newGalleryItem],
          })
          showToast('Gallery image loaded as local preview.')
        } else {
          updateCurrentProject({ image: reader.result })
          showToast('Main image set as local preview.')
        }
      }
      reader.readAsDataURL(file)
    } finally {
      setUploadingImage(false)
    }
  }

  // Tag Helpers
  const handleAddTag = () => {
    if (!newTagInput.trim()) return
    const tags = currentProject.tags || []
    if (!tags.includes(newTagInput.trim())) {
      updateCurrentProject({ tags: [...tags, newTagInput.trim()] })
      setNewTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    const tags = (currentProject.tags || []).filter((t) => t !== tagToRemove)
    updateCurrentProject({ tags })
  }

  // Paragraph Helpers
  const handleAddParagraph = () => {
    const paragraphs = currentProject.paragraphs || []
    updateCurrentProject({
      paragraphs: [...paragraphs, 'New paragraph content detailing milestones, quotes, or historical facts.'],
    })
  }

  const handleUpdateParagraph = (index, value) => {
    const paragraphs = [...(currentProject.paragraphs || [])]
    paragraphs[index] = value
    updateCurrentProject({ paragraphs })
  }

  const handleRemoveParagraph = (index) => {
    const paragraphs = (currentProject.paragraphs || []).filter((_, idx) => idx !== index)
    updateCurrentProject({ paragraphs })
  }

  // Gallery Helpers
  const handleRemoveGalleryItem = (galleryIdx) => {
    const gallery = (currentProject.gallery || []).filter((_, idx) => idx !== galleryIdx)
    updateCurrentProject({ gallery })
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C9A15A] border-t-transparent" />
          <p className="text-sm text-mist/60">Loading Projects Configuration...</p>
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
            <Briefcase className="h-4 w-4" />
            <span>Interactive Portfolio CMS</span>
          </div>
          <h1 className="mt-1 font-serif text-2xl font-bold text-white sm:text-3xl">
            Projects Section Editor
          </h1>
          <p className="mt-1 text-xs text-mist/70">
            Customize the "Projects That Impact Lives" section, story cards, images, full case studies, and gallery.
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

      {/* Main Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
            activeTab === 'projects'
              ? 'bg-[#C9A15A]/20 text-[#fae8be] border border-[#C9A15A]/40 font-semibold'
              : 'text-mist/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Layers className="h-4 w-4 text-[#C9A15A]" />
          <span>Project Cards & Case Studies ({sectionData.projects.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('header')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
            activeTab === 'header'
              ? 'bg-[#C9A15A]/20 text-[#fae8be] border border-[#C9A15A]/40 font-semibold'
              : 'text-mist/70 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Sparkles className="h-4 w-4 text-[#C9A15A]" />
          <span>Section Headings & Intro</span>
        </button>
      </div>

      {/* TAB 1: SECTION HEADINGS */}
      {activeTab === 'header' && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#14120e] p-6 space-y-5">
              <h3 className="font-serif text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#C9A15A]" />
                <span>Section Header Content</span>
              </h3>

              <div>
                <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                  Eyebrow Label
                </label>
                <input
                  type="text"
                  value={sectionData.eyebrow}
                  onChange={(e) => setSectionData({ ...sectionData, eyebrow: e.target.value })}
                  placeholder="e.g. Selected work"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                  Section Main Title
                </label>
                <input
                  type="text"
                  value={sectionData.title}
                  onChange={(e) => setSectionData({ ...sectionData, title: e.target.value })}
                  placeholder="e.g. Projects That Impact Lives"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                  Lead Description / Overview
                </label>
                <textarea
                  rows={4}
                  value={sectionData.leadText}
                  onChange={(e) => setSectionData({ ...sectionData, leadText: e.target.value })}
                  placeholder="Enter introductory summary for the projects section..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Header Preview */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-[#f8f5ef] p-8 text-[#14120e] shadow-xl space-y-4">
              <span className="inline-block text-[0.68rem] uppercase tracking-[0.2em] font-semibold text-[#8d7043]">
                {sectionData.eyebrow || 'Selected work'}
              </span>
              <h2 className="font-serif text-3xl font-normal leading-tight text-[#1a1815]">
                {sectionData.title || 'Projects That Impact Lives'}
              </h2>
              <p className="text-xs leading-relaxed text-[#5c5850]">
                {sectionData.leadText || 'Documented initiatives overview...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTS CARDS MANAGER */}
      {activeTab === 'projects' && (
        <div className="space-y-8">
          {/* Project List Selector Bar */}
          <div className="rounded-2xl border border-white/10 bg-[#14120e] p-4">
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-medium text-mist/70 uppercase tracking-wider">
                Select Project to Edit ({sectionData.projects.length})
              </span>
              <button
                type="button"
                onClick={handleAddNewProject}
                className="flex items-center gap-1.5 rounded-lg bg-[#C9A15A]/20 px-3 py-1.5 text-xs font-semibold text-[#fae8be] hover:bg-[#C9A15A] hover:text-black transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add New Project</span>
              </button>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {sectionData.projects.map((proj, idx) => {
                const isSelected = idx === selectedProjectIndex
                return (
                  <div
                    key={proj.slug || idx}
                    onClick={() => setSelectedProjectIndex(idx)}
                    className={`group relative flex items-center gap-3 rounded-xl p-3 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#C9A15A] bg-[#C9A15A]/15 text-white shadow-md'
                        : 'border-white/5 bg-white/[0.02] text-mist/70 hover:border-white/20 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 bg-black/40 border border-white/10">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/src/assets/images/Supporting-Education-Empowering-Futures.jpg'
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <p className="text-[0.65rem] uppercase tracking-wider text-[#C9A15A] truncate">
                        {proj.category || 'Initiative'}
                      </p>
                      <h4 className="text-xs font-semibold text-white truncate">{proj.title}</h4>
                      <p className="text-[0.65rem] text-mist/50">{proj.date}</p>
                    </div>

                    {/* Delete button */}
                    {sectionData.projects.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteProject(idx)
                        }}
                        className="absolute right-2 top-2 p-1 text-mist/40 hover:text-red-400 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Active Project Editor Grid */}
          {currentProject && (
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Core Card Details */}
                <div className="rounded-2xl border border-white/10 bg-[#14120e] p-6 space-y-4">
                  <h3 className="font-serif text-base font-semibold text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#C9A15A]" />
                      <span>Card Details & Metadata</span>
                    </span>
                    <span className="text-xs text-mist/50 font-sans">
                      Editing Card #{selectedProjectIndex + 1}
                    </span>
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                        Project Title
                      </label>
                      <input
                        type="text"
                        value={currentProject.title}
                        onChange={(e) => updateCurrentProject({ title: e.target.value })}
                        placeholder="e.g. Supporting Education, Empowering Futures"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                        Category
                      </label>
                      <input
                        type="text"
                        value={currentProject.category}
                        onChange={(e) => updateCurrentProject({ category: e.target.value })}
                        placeholder="e.g. Community development / Cancer care"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                        Date / Period
                      </label>
                      <input
                        type="text"
                        value={currentProject.date}
                        onChange={(e) => updateCurrentProject({ date: e.target.value })}
                        placeholder="e.g. 19 March 2026 or 2009–Present"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                        URL Slug (Unique Key)
                      </label>
                      <input
                        type="text"
                        value={currentProject.slug}
                        onChange={(e) => updateCurrentProject({ slug: e.target.value })}
                        placeholder="e.g. supporting-education-empowering-futures"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                        Card Summary (Brief Overview on Main Page)
                      </label>
                      <textarea
                        rows={3}
                        value={currentProject.summary}
                        onChange={(e) => updateCurrentProject({ summary: e.target.value })}
                        placeholder="Scholastic materials for Divine Mercy Nursery..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Main Image Configuration */}
                <div className="rounded-2xl border border-white/10 bg-[#14120e] p-6 space-y-4">
                  <h3 className="font-serif text-base font-semibold text-white flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-[#C9A15A]" />
                    <span>Main Project Showcase Image</span>
                  </h3>

                  {/* Upload + URL Controls */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleImageUpload(e, false)}
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

                      <div className="flex items-center gap-2">
                        <label className="text-[0.68rem] text-mist/70 uppercase">Image Fit:</label>
                        <select
                          value={currentProject.imageFit || 'cover'}
                          onChange={(e) => updateCurrentProject({ imageFit: e.target.value })}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white focus:border-[#C9A15A] focus:outline-none"
                        >
                          <option value="cover" className="bg-[#14120e]">Cover (Fill)</option>
                          <option value="contain" className="bg-[#14120e]">Contain (Fit Poster)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                        Image URL / File Path
                      </label>
                      <input
                        type="text"
                        value={currentProject.image}
                        onChange={(e) => updateCurrentProject({ image: e.target.value })}
                        placeholder="/src/assets/images/... or https://..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-mist/80 mb-1.5 uppercase tracking-wider">
                        Image Alt Text (Accessibility & SEO)
                      </label>
                      <input
                        type="text"
                        value={currentProject.imageAlt || ''}
                        onChange={(e) => updateCurrentProject({ imageAlt: e.target.value })}
                        placeholder="e.g. Primary pupils holding new exercise books..."
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                      />
                    </div>

                    {/* Quick Preset Picker */}
                    <div>
                      <label className="block text-[0.68rem] font-medium text-mist/60 mb-2 uppercase tracking-wider">
                        Or Pick from Gilbert Asset Library:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_IMAGES.map((preset) => {
                          const isActive = currentProject.image === preset.path
                          return (
                            <button
                              key={preset.path}
                              type="button"
                              onClick={() => updateCurrentProject({ image: preset.path })}
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

                {/* 3. Full Story Paragraphs */}
                <div className="rounded-2xl border border-white/10 bg-[#14120e] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-semibold text-white flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#C9A15A]" />
                      <span>Full Case Study Narrative ({currentProject.paragraphs?.length || 0} Paragraphs)</span>
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
                    {(currentProject.paragraphs || []).map((pText, pIdx) => (
                      <div key={pIdx} className="relative rounded-xl border border-white/5 bg-white/[0.02] p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[0.65rem] uppercase tracking-wider text-[#C9A15A]">
                            Paragraph #{pIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveParagraph(pIdx)}
                            className="p-1 text-mist/40 hover:text-red-400 transition-colors"
                            title="Remove paragraph"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
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

                {/* 4. Tags / Taxonomy Badges */}
                <div className="rounded-2xl border border-white/10 bg-[#14120e] p-6 space-y-4">
                  <h3 className="font-serif text-base font-semibold text-white flex items-center gap-2">
                    <Tag className="h-4 w-4 text-[#C9A15A]" />
                    <span>Project Tags</span>
                  </h3>

                  <div className="flex flex-wrap gap-2 items-center">
                    {(currentProject.tags || []).map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A15A]/30 bg-[#C9A15A]/10 px-3 py-1 text-xs text-[#fae8be]"
                      >
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="text-[#C9A15A] hover:text-red-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                      placeholder="Add a new tag (e.g. Health, CCF Foundation)..."
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white placeholder:text-mist/40 focus:border-[#C9A15A] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* 5. Gallery Images */}
                <div className="rounded-2xl border border-white/10 bg-[#14120e] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-base font-semibold text-white flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-[#C9A15A]" />
                      <span>Case Study Gallery ({currentProject.gallery?.length || 0} Photos)</span>
                    </h3>
                    <div>
                      <input
                        type="file"
                        ref={galleryFileInputRef}
                        onChange={(e) => handleImageUpload(e, true)}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => galleryFileInputRef.current?.click()}
                        className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20 transition-all"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Upload Gallery Photo</span>
                      </button>
                    </div>
                  </div>

                  {currentProject.gallery?.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {currentProject.gallery.map((gItem, gIdx) => (
                        <div
                          key={gIdx}
                          className="relative rounded-xl border border-white/10 bg-white/5 overflow-hidden group"
                        >
                          <img
                            src={gItem.src}
                            alt={gItem.alt}
                            className="h-32 w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/src/assets/images/Supporting-Education-Empowering-Futures.jpg'
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryItem(gIdx)}
                            className="absolute top-2 right-2 rounded-full bg-black/70 p-1 text-white hover:bg-red-600 transition-colors"
                            title="Remove photo"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                          <div className="p-2">
                            <p className="text-[0.65rem] text-mist/70 truncate">{gItem.alt || 'Gallery photo'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-mist/40 italic">
                      No supplementary gallery photos added for this project yet.
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Live Card Simulation (Exact Public Website Representation) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="sticky top-28 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A15A] flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Live Website Card Preview</span>
                    </span>
                    <a
                      href={`/projects/${currentProject.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[0.68rem] text-mist hover:text-white"
                    >
                      <span>Preview Detail Page</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Public Project Card Simulator */}
                  <div className="rounded-3xl border border-[#e5dfd3] bg-[#f8f5ef] p-6 sm:p-8 text-[#14120e] shadow-2xl space-y-6">
                    {/* Simulated Image */}
                    <div className="relative overflow-hidden rounded-2xl bg-[#eae4d7] aspect-[4/3] shadow-inner">
                      <img
                        src={currentProject.image}
                        alt={currentProject.imageAlt || currentProject.title}
                        className={`h-full w-full ${
                          currentProject.imageFit === 'contain' ? 'object-contain' : 'object-cover'
                        }`}
                        onError={(e) => {
                          e.currentTarget.src = '/src/assets/images/Supporting-Education-Empowering-Futures.jpg'
                        }}
                      />
                    </div>

                    {/* Meta & Title */}
                    <div className="space-y-2">
                      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#8d7043]">
                        {currentProject.category || 'Category'} <span className="text-[#a0907d]">/</span> {currentProject.date || 'Date'}
                      </div>
                      <h3 className="font-serif text-2xl font-normal leading-tight text-[#1a1815]">
                        {currentProject.title || 'Project Title'}
                      </h3>
                      <p className="text-xs leading-relaxed text-[#5c5850]">
                        {currentProject.summary || 'Project card summary narrative...'}
                      </p>
                    </div>

                    {/* View project simulated CTA */}
                    <div className="pt-2 border-t border-[#e2dacf] flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1a1815] flex items-center gap-1 group">
                        <span>View project</span>
                        <ArrowUpRight className="h-3.5 w-3.5 text-[#8d7043]" />
                      </span>
                      <div className="flex gap-1">
                        {(currentProject.tags || []).slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="rounded bg-[#e8e1d3] px-2 py-0.5 text-[0.65rem] text-[#6b6255]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Helper Box */}
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-xs text-mist/70 space-y-2">
                    <p className="font-medium text-white flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-[#C9A15A]" />
                      <span>Instant Dynamic Updates</span>
                    </p>
                    <p className="text-[0.72rem] leading-relaxed">
                      Changes saved here automatically update both the <strong>Homepage Projects Section</strong> and each dedicated <strong>Project Detail Case Study</strong> page (<code className="text-[#fae8be]">/projects/:slug</code>).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
