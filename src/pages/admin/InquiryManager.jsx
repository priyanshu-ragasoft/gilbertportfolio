import { useState, useEffect, useMemo } from 'react'
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  Trash2,
  CheckCircle2,
  Search,
  RefreshCw,
  Send,
  Archive,
  Inbox,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import { inquiryAPI } from '../../services/api'

export default function InquiryManager() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [notification, setNotification] = useState('')

  const loadAllInquiries = async () => {
    setLoading(true)
    let apiData = []
    try {
      const res = await inquiryAPI.getInquiries()
      if (res.success && Array.isArray(res.data)) {
        apiData = res.data
      }
    } catch (err) {
      console.warn('Backend inquiries fetch notice:', err.message)
    }

    // Merge with local storage cached submissions
    let localData = []
    try {
      localData = JSON.parse(localStorage.getItem('gilbert_cached_inquiries') || '[]')
    } catch (e) {
      localData = []
    }

    const mergedMap = new Map()

    // Add local cached inquiries (excluding any old mock inq-1, inq-2, inq-3)
    localData.forEach((item) => {
      if (item && item._id && !item._id.startsWith('inq-')) {
        mergedMap.set(item._id, item)
      }
    })

    // Add backend api inquiries (which overwrite or supplement)
    apiData.forEach((item) => {
      if (item && item._id && !item._id.startsWith('inq-')) {
        mergedMap.set(item._id, item)
      }
    })

    const sortedList = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )

    setInquiries(sortedList)
    setLoading(false)
  }

  useEffect(() => {
    loadAllInquiries()

    // Listen for live inquiry submissions from website
    const handleLiveInquiry = (e) => {
      if (e.detail) {
        const newInq = e.detail
        setInquiries((prev) => [newInq, ...prev.filter((item) => item._id !== newInq._id)])
        setNotification(`New inquiry received from ${newInq.name}!`)
        setTimeout(() => setNotification(''), 4000)
      }
    }

    window.addEventListener('gilbert_inquiry_received', handleLiveInquiry)
    return () => window.removeEventListener('gilbert_inquiry_received', handleLiveInquiry)
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    try {
      await inquiryAPI.updateStatus(id, newStatus)
    } catch (err) {
      console.warn('Status update API error:', err.message)
    }

    setInquiries((prev) => {
      const updated = prev.map((inq) => (inq._id === id ? { ...inq, status: newStatus } : inq))
      // Update local storage
      try {
        localStorage.setItem('gilbert_cached_inquiries', JSON.stringify(updated))
      } catch (e) {}
      return updated
    })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently remove this message?')) return
    try {
      await inquiryAPI.deleteInquiry(id)
    } catch (err) {
      console.warn('Delete inquiry API notice:', err.message)
    }

    setInquiries((prev) => {
      const updated = prev.filter((inq) => inq._id !== id)
      try {
        localStorage.setItem('gilbert_cached_inquiries', JSON.stringify(updated))
      } catch (e) {}
      return updated
    })

    if (selectedInquiry?._id === id) {
      setSelectedInquiry(null)
    }
  }

  // Count stats
  const stats = useMemo(() => {
    const total = inquiries.length
    const newCount = inquiries.filter((i) => i.status === 'new').length
    const respondedCount = inquiries.filter((i) => i.status === 'responded').length
    const archivedCount = inquiries.filter((i) => i.status === 'archived').length
    return { total, newCount, respondedCount, archivedCount }
  }, [inquiries])

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesFilter =
        statusFilter === 'All'
          ? true
          : inq.status === statusFilter.toLowerCase()

      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        (inq.name && inq.name.toLowerCase().includes(q)) ||
        (inq.email && inq.email.toLowerCase().includes(q)) ||
        (inq.subject && inq.subject.toLowerCase().includes(q)) ||
        (inq.message && inq.message.toLowerCase().includes(q)) ||
        (inq.organization && inq.organization.toLowerCase().includes(q))

      return matchesFilter && matchesSearch
    })
  }, [inquiries, statusFilter, searchQuery])

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return 'Recently'
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return 'Recently'
    }
  }

  return (
    <div className="space-y-6">
      {/* Live Notification Banner */}
      {notification && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300 animate-pulse">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification('')}
            className="text-xs text-emerald-400/80 hover:text-emerald-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif text-white font-normal">Contact Inquiries &amp; Messages</h1>
          <p className="text-xs text-mist/70 font-light">
            Live submissions received directly from the website contact form.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAllInquiries}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-mist hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-[#14120e] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-mist/70">Total Messages</span>
            <Inbox className="h-4 w-4 text-[#C9A15A]" />
          </div>
          <p className="mt-2 text-2xl font-serif text-white font-medium">{stats.total}</p>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-[#14120e] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-300/80">New / Unread</span>
            <div className="h-2.5 w-2.5 rounded-full bg-blue-400 animate-ping" />
          </div>
          <p className="mt-2 text-2xl font-serif text-blue-300 font-medium">{stats.newCount}</p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-[#14120e] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-300/80">Responded</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-serif text-emerald-300 font-medium">{stats.respondedCount}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#14120e] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-mist/70">Archived</span>
            <Archive className="h-4 w-4 text-mist/40" />
          </div>
          <p className="mt-2 text-2xl font-serif text-mist font-medium">{stats.archivedCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-white/10 bg-[#14120e] p-3 sm:p-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mist/40" />
          <input
            type="text"
            placeholder="Search by name, email, topic, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2 text-xs text-white placeholder:text-mist/40 outline-none focus:border-[#C9A15A]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'All', count: stats.total },
            { label: 'New', count: stats.newCount },
            { label: 'Responded', count: stats.respondedCount },
            { label: 'Archived', count: stats.archivedCount },
          ].map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setStatusFilter(tab.label)}
              className={`flex items-center gap-1.5 shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                statusFilter === tab.label
                  ? 'bg-[#C9A15A] text-black font-semibold shadow-md shadow-[#C9A15A]/20'
                  : 'bg-white/5 text-mist hover:bg-white/10'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                  statusFilter === tab.label
                    ? 'bg-black/20 text-black font-bold'
                    : 'bg-white/10 text-mist/80'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#14120e] p-12 text-center text-sm text-mist/60">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-3 text-[#C9A15A]" />
            <span>Loading inquiries from database...</span>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#14120e]/60 p-12 text-center">
            <Inbox className="h-8 w-8 mx-auto text-mist/40 mb-3" />
            <h3 className="text-base font-serif text-white">No inquiries found</h3>
            <p className="mt-1 text-xs text-mist/60">
              {searchQuery
                ? 'No messages match your search criteria.'
                : 'Form submissions from the website will appear here in real time.'}
            </p>
          </div>
        ) : (
          filteredInquiries.map((inq) => (
            <div
              key={inq._id}
              className={`rounded-2xl border transition-all duration-300 p-5 sm:p-6 ${
                inq.status === 'new'
                  ? 'border-blue-500/30 bg-[#14120e] shadow-[0_4px_20px_rgba(30,58,138,0.15)]'
                  : 'border-white/10 bg-[#14120e] hover:border-white/20'
              }`}
            >
              {/* Top Row: Sender Info & Actions */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-white/5">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base font-serif text-white font-medium">{inq.name}</h3>
                    {inq.organization && (
                      <span className="text-xs text-mist/60">({inq.organization})</span>
                    )}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${
                        inq.status === 'new'
                          ? 'bg-blue-950/80 text-blue-300 border border-blue-500/40'
                          : inq.status === 'responded'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {inq.status}
                    </span>

                    {inq.type && (
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[0.65rem] text-[#C9A15A] border border-[#C9A15A]/30 capitalize">
                        {inq.type}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-mist/70">
                    <a
                      href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || 'Inquiry')}`}
                      className="inline-flex items-center gap-1.5 text-[#C9A15A] hover:underline"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>{inq.email}</span>
                    </a>
                    {inq.phone && (
                      <a href={`tel:${inq.phone}`} className="inline-flex items-center gap-1.5 hover:text-white">
                        <Phone className="h-3.5 w-3.5 text-mist/50" />
                        <span>{inq.phone}</span>
                      </a>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-mist/50">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatDate(inq.createdAt)}</span>
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || 'Direct Inquiry Response')}&body=Dear ${encodeURIComponent(
                      inq.name
                    )},\n\nThank you for reaching out to the Executive Office of Gilbert Kevin Jimmy Kwizera.\n\nRegarding your inquiry: "${encodeURIComponent(
                      inq.subject || ''
                    )}"\n\n`}
                    onClick={() => handleStatusChange(inq._id, 'responded')}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#C9A15A]/40 bg-[#C9A15A]/10 px-3 py-1.5 text-xs font-medium text-[#C9A15A] hover:bg-[#C9A15A] hover:text-black transition-all"
                  >
                    <Send className="h-3 w-3" />
                    <span>Reply Email</span>
                  </a>

                  {inq.status !== 'responded' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(inq._id, 'responded')}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-900/50 transition-all"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Mark Responded</span>
                    </button>
                  )}

                  {inq.status !== 'archived' && (
                    <button
                      type="button"
                      onClick={() => handleStatusChange(inq._id, 'archived')}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-mist/70 hover:bg-white/10 hover:text-white transition-all"
                      title="Archive message"
                    >
                      <Archive className="h-3.5 w-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(inq._id)}
                    className="rounded-xl p-2 text-mist/40 hover:text-red-400 hover:bg-red-950/40 transition-all"
                    title="Delete message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="mt-4 rounded-xl border border-white/5 bg-black/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C9A15A]">
                    Topic / Subject:
                  </span>
                  <span className="text-xs font-medium text-white">{inq.subject}</span>
                </div>
                <p className="text-sm text-mist/90 font-light leading-relaxed whitespace-pre-wrap">
                  {inq.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

