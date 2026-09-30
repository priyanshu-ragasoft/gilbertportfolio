import { useState, useRef, useEffect } from 'react'
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Mail,
  MapPin,
  ExternalLink,
  RotateCcw,
  Volume2,
  VolumeX,
  Copy,
  Check,
} from 'lucide-react'
import { profile } from '../../data/profile'
import goldLogoImg from '../../assets/images/custom-gold-logo.png'

// Quick suggestions for visitors
const SUGGESTIONS = [
  'Tell me about Philanthropy & CCF',
  'How to schedule a consultation?',
  'Where is the Dubai Headquarters?',
  'What are his key initiatives?',
  'Direct Contact Information',
  'What is his background & education?',
]

// Comprehensive, Intelligent Auto-Reply Knowledge Engine
function getAutoReply(userText) {
  const query = userText.toLowerCase().trim()

  // 1. Small Talk & Greetings
  if (query.match(/^(hi|hello|hey|greetings|namaste|hola|salaam|good morning|good afternoon|good evening|howdy)/)) {
    return {
      text: `Hello! Welcome to the official executive portfolio of **Gilbert Kevin Jimmy Kwizera**.\n\nI am his **Executive AI Assistant**. How may I help you today? You can ask about his **philanthropy**, **consulting services**, **Dubai HQ**, or **schedule a direct inquiry**.`,
      actions: [
        { label: 'Philanthropy & CCF', type: 'chip', value: 'Tell me about Philanthropy & CCF' },
        { label: 'Schedule Consultation', type: 'chip', value: 'How to schedule a consultation?' },
        { label: 'Contact Details', type: 'chip', value: 'Direct Contact Information' },
      ],
    }
  }

  // 2. "How are you" / Well-being
  if (query.includes('how are you') || query.includes('kaise ho') || query.includes('kya haal') || query.includes('whats up') || query.includes("what's up") || query.includes('how do you do')) {
    return {
      text: `I am doing exceptionally well, thank you! 😊\n\nI am live and ready to answer any questions regarding **Gilbert Kwizera's** humanitarian work, strategic consulting, or global initiatives. What would you like to know?`,
      actions: [
        { label: 'Key Initiatives', type: 'chip', value: 'What are his key initiatives?' },
        { label: 'Dubai HQ', type: 'chip', value: 'Where is the Dubai Headquarters?' },
      ],
    }
  }

  // 3. "Who are you" / Bot identity
  if (query.includes('who are you') || query.includes('what are you') || query.includes('your name') || query.includes('who is this') || query.includes('kya ho')) {
    return {
      text: `I am the **Executive AI Concierge** for **Gilbert Kevin Jimmy Kwizera**.\n\nMy purpose is to assist visitors, partners, and philanthropic collaborators with instant information, navigation, and direct communication with Mr. Kwizera's office.`,
      actions: [
        { label: 'About Gilbert Kwizera', type: 'link', value: '/about' },
        { label: 'Direct Email', type: 'email', value: profile.email },
      ],
    }
  }

  // 4. Age / Birthday / Origin / Birthplace
  if (query.includes('age') || query.includes('how old') || query.includes('birthday') || query.includes('dob') || query.includes('birth') || query.includes('born')) {
    return {
      text: `**Gilbert Kevin Jimmy Kwizera** was born on **30 November 1971** in **Kampala, Uganda**.\n\nHaving witnessed poverty and health barriers firsthand in his youth, he dedicated his life to humanitarian leadership and ethical stewardship across Africa and the Middle East.`,
      actions: [
        { label: 'View Timeline Journey', type: 'link', value: '/#journey' },
        { label: 'Read Full Biography', type: 'link', value: '/about' },
      ],
    }
  }

  // 5. Where do you live / Location / Nationality / Dubai
  if (query.includes('where do you live') || query.includes('where is he') || query.includes('nationality') || query.includes('country') || query.includes('based') || query.includes('location') || query.includes('dubai') || query.includes('office') || query.includes('headquarters') || query.includes('hq') || query.includes('port de la mer')) {
    return {
      text: `**Gilbert Kwizera** is based in **Dubai, United Arab Emirates**.\n\n📍 **International Headquarters:**\n• **Address:** Port de La Mer — Le Pont, Jumeirah 1, Dubai, UAE\n• **Coordinates:** \`25.2048° N, 55.2708° E\`\n• **Timezone:** GST (Gulf Standard Time, UTC+4)\n\nYou can explore our interactive 3D Globe and live map in the Contact portal.`,
      actions: [
        { label: 'Open 3D Globe & Map', type: 'link', value: '/contact' },
        { label: 'Google Maps Route', type: 'external', value: 'https://maps.google.com/?q=Port+de+la+Mer+Le+Pont+Jumeirah+Dubai' },
      ],
    }
  }

  // 6. What do you do / Occupation / Profession / Work
  if (query.includes('what do you do') || query.includes('what does he do') || query.includes('profession') || query.includes('job') || query.includes('occupation') || query.includes('role') || query.includes('career') || query.includes('experience')) {
    return {
      text: `Gilbert Kwizera serves across three core pillars:\n\n1. **Humanitarian Leader**: Founder of the *Cancer Charity Foundation (CCF)* and *Haven Welfare*, providing dignity-based medical and recovery aid.\n2. **International Consultant**: Advising global organizations on ethical governance, finance, and cross-border social enterprise.\n3. **Volunteer**: Dedicated to quiet, consistent service without public spectacle.`,
      actions: [
        { label: 'Explore Impact Work', type: 'link', value: '/#impact' },
        { label: 'View Portfolio Projects', type: 'link', value: '/projects' },
      ],
    }
  }

  // 7. Contact / Email / Phone / Reach out / Message
  if (query.includes('contact') || query.includes('email') || query.includes('phone') || query.includes('reach') || query.includes('call') || query.includes('number') || query.includes('whatsapp') || query.includes('mail')) {
    return {
      text: `You can connect directly with **Gilbert Kwizera's** executive office:\n\n📧 **Email:** \`${profile.email}\`\n📞 **Phone:** \`${profile.phone}\`\n📍 **HQ:** ${profile.location}, Dubai, UAE\n\nDirect inquiries are typically reviewed within 24–48 hours.`,
      actions: [
        { label: 'Send Direct Email', type: 'email', value: profile.email },
        { label: 'Go to Contact Page', type: 'link', value: '/contact' },
      ],
    }
  }

  // 8. Philanthropy / CCF / Haven Welfare / Cancer Care / Donations
  if (query.includes('philanthropy') || query.includes('charity') || query.includes('ccf') || query.includes('cancer') || query.includes('haven') || query.includes('welfare') || query.includes('foundation') || query.includes('donation') || query.includes('donate') || query.includes('help')) {
    return {
      text: `Gilbert Kwizera's philanthropic initiatives are built on the principle of **Dignity-Based Care**:\n\n• **Cancer Charity Foundation (CCF)**: Practical support ensuring underprivileged cancer patients do not abandon treatment due to financial strain.\n• **Haven Welfare**: Private, stigma-free rehabilitation and recovery.\n• **ISBET Brainery**: Educational classrooms and vocational training in East Africa.`,
      actions: [
        { label: 'Explore Impact Initiatives', type: 'link', value: '/#impact' },
        { label: 'Philanthropy Inquiries', type: 'link', value: '/contact' },
      ],
    }
  }

  // 9. Consultation / Meeting / Advisory / Partnership / Hire
  if (query.includes('consult') || query.includes('advisory') || query.includes('partnership') || query.includes('meeting') || query.includes('appointment') || query.includes('hire') || query.includes('collaborate') || query.includes('book')) {
    return {
      text: `To request a high-level strategic advisory session, institutional consultation, or philanthropic partnership:\n\n1. Use our official **Contact Form** on the website.\n2. Or send an executive brief directly to \`${profile.email}\`.\n\nPlease include your organization name, proposed scope, and timeline.`,
      actions: [
        { label: 'Submit Consultation Brief', type: 'link', value: '/contact' },
        { label: 'Direct Email', type: 'email', value: profile.email },
      ],
    }
  }

  // 10. Education / Qualifications / Degrees
  if (query.includes('education') || query.includes('degree') || query.includes('university') || query.includes('study') || query.includes('qualification') || query.includes('mahaveera') || query.includes('mangalore') || query.includes('sikkim') || query.includes('manipal')) {
    return {
      text: `**Gilbert Kevin Jimmy Kwizera's** academic background includes:\n\n🎓 **Pre-University Course (PUC)** — Mahaveera College (1993–1995)\n🎓 **Bachelor of Business Management (BBM)** — Mangalore University (1996–1999)\n🎓 **Bachelor of Commerce in Information Systems (BCOMIS)** — Sikkim Manipal University (2012)\n\nThis strong foundation in business leadership, commerce, and digital systems has driven his multi-sector enterprises and philanthropic initiatives.`,
      actions: [
        { label: 'Read Full Biography', type: 'link', value: '/about' },
        { label: 'View Timeline Journey', type: 'link', value: '/#journey' },
      ],
    }
  }

  // 10b. Journey / Career History / Businesses / Gold / Dubai / Travels
  if (query.includes('journey') || query.includes('history') || query.includes('gold') || query.includes('cafe') || query.includes('internet') || query.includes('travel') || query.includes('blockchain') || query.includes('pio')) {
    return {
      text: `**The Journey Across Borders of Gilbert Kevin Jimmy Kwizera:**\n\n• **1971**: Born in Uganda.\n• **1993–1999**: Higher Studies in India (Mahaveera College PUC 1993–1995, Mangalore University BBM 1996–1999).\n• **2000**: Returned to Uganda and started one of the country's first internet cafés, expanding into woodworks, real estate, manufacturing, procurement & sourcing, financing, motor vehicle sales, IT solutions, and education.\n• **2010**: Entered the gold business in Uganda.\n• **2014**: Founded the *Cancer Charity Foundation (CCF)* and *Haven Welfare*.\n• **2016**: Settled in Dubai, working in gold sales, consulting, and proprietary digital asset management.\n• **2016 onward (Global Travels)**: Travelled across 18 countries: **Singapore, Indonesia, Hong Kong, China, Turkey, Qatar, South Africa, Spain, France, Italy, Kenya, Rwanda, Sudan, Ethiopia, Tanzania, The Democratic Republic of the Congo, Burundi, and Thailand**.\n• **2022–2026**: Blockchain and Exchange projects.\n• **2026**: Launch of the *PIO Ecosystem* and *ISBET Brainery*.`,
      actions: [
        { label: 'Explore Interactive Journey', type: 'link', value: '/#journey' },
        { label: 'View Projects', type: 'link', value: '/projects' },
      ],
    }
  }

  // 11. Philosophy / Quote / Vision
  if (query.includes('quote') || query.includes('philosophy') || query.includes('vision') || query.includes('motto') || query.includes('thought') || query.includes('values')) {
    return {
      text: `> *"Service is treated as a duty rather than publicity: showing up, using resources responsibly, and making decisions that protect human dignity."*\n\n— **Gilbert Kevin Jimmy Kwizera**\n\nHis standard is simple: whether the work protects human dignity and is built to endure.`,
      actions: [
        { label: 'Explore Vision & Journey', type: 'link', value: '/#journey' },
      ],
    }
  }

  // 12. Languages
  if (query.includes('language') || query.includes('languages') || query.includes('speak')) {
    return {
      text: `Gilbert Kwizera communicates fluently in **English**, **Luganda**, **Swahili**, and international diplomatic & business protocols.`,
      actions: [
        { label: 'Direct Contact', type: 'chip', value: 'Direct Contact Information' },
      ],
    }
  }

  // 13. Social Media
  if (query.includes('social') || query.includes('linkedin') || query.includes('instagram') || query.includes('youtube') || query.includes('twitter') || query.includes('x')) {
    return {
      text: `You can follow **Gilbert Kwizera's** official social media handles:\n\n• **LinkedIn:** [Gilbert Kevin Jimmy Kwizera](https://www.linkedin.com/in/gilbert-kevin-jimmy-kwizera)\n• **Instagram:** [@gilbert_kevin_jimmy](https://www.instagram.com/gilbert_kevin_jimmy/)\n• **YouTube:** [@GilbertKevinJimmyKwizera](https://www.youtube.com/@GilbertKevinJimmyKwizera)\n• **X (Twitter):** [@jimmy_gilb69678](https://twitter.com/jimmy_gilb69678)`,
      actions: [
        { label: 'LinkedIn Profile', type: 'external', value: 'https://www.linkedin.com/in/gilbert-kevin-jimmy-kwizera' },
        { label: 'Instagram Profile', type: 'external', value: 'https://www.instagram.com/gilbert_kevin_jimmy/' },
      ],
    }
  }

  // 14. Gratitude / Thanks
  if (query.includes('thank') || query.includes('thanks') || query.includes('shukriya') || query.includes('dhanyawad') || query.includes('great') || query.includes('awesome') || query.includes('good job')) {
    return {
      text: `You are very welcome! 🙏\n\nIt is our pleasure to assist you. If you have any further questions or wish to connect with Gilbert Kwizera, feel free to reach out anytime!`,
      actions: [
        { label: 'Send Direct Email', type: 'email', value: profile.email },
        { label: 'Explore Projects', type: 'link', value: '/projects' },
      ],
    }
  }

  // 15. Farewell / Bye
  if (query.includes('bye') || query.includes('goodbye') || query.includes('see you') || query.includes('take care') || query.includes('alvida')) {
    return {
      text: `Goodbye! Thank you for visiting the official portfolio of **Gilbert Kevin Jimmy Kwizera**. Have a wonderful day ahead! ✨`,
      actions: [
        { label: 'Direct Email', type: 'email', value: profile.email },
        { label: 'Explore Website', type: 'link', value: '/' },
      ],
    }
  }

  // 16. Universal Intelligent Fallback for ANY other question
  return {
    text: `Thank you for your question regarding **"${userText}"**.\n\nGilbert Kwizera's executive office specializes in **humanitarian initiatives (CCF & Haven Welfare)**, **international consulting & governance**, and **cross-border social enterprise** from Dubai, UAE.\n\nWould you like to send a direct message to Mr. Kwizera or browse a specific topic?`,
    actions: [
      { label: 'Send Direct Email', type: 'email', value: profile.email },
      { label: 'Philanthropy & CCF', type: 'chip', value: 'Tell me about Philanthropy & CCF' },
      { label: 'Dubai Headquarters', type: 'chip', value: 'Where is the Dubai Headquarters?' },
      { label: 'Schedule Consultation', type: 'chip', value: 'How to schedule a consultation?' },
    ],
  }
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isUserTyping, setIsUserTyping] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [copiedText, setCopiedText] = useState(null)
  const [unreadCount, setUnreadCount] = useState(1)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof document === 'undefined') return true
    return !document.documentElement.classList.contains('is-intro')
  })

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const userTypingTimeoutRef = useRef(null)

  useEffect(() => {
    const handleIntroDone = () => {
      setTimeout(() => setIsVisible(true), 400)
    }

    if (document.documentElement.classList.contains('is-intro')) {
      setIsVisible(false)
      window.addEventListener('intro:done', handleIntroDone, { once: true })
      return () => window.removeEventListener('intro:done', handleIntroDone)
    } else {
      setIsVisible(true)
    }
  }, [])

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Welcome! I am the **Executive AI Concierge** for **Gilbert Kevin Jimmy Kwizera**.\n\nPlease select what you would like to know about, or type your question below:`,
      timestamp: 'Just now',
      actions: [
        { label: '🎗️ Philanthropy & CCF', type: 'chip', value: 'Tell me about Philanthropy & CCF' },
        { label: '🏛️ Dubai Headquarters', type: 'chip', value: 'Where is the Dubai Headquarters?' },
        { label: '💼 Strategic Consultations', type: 'chip', value: 'How to schedule a consultation?' },
        { label: '📖 Background & Bio', type: 'chip', value: 'What is his background & education?' },
        { label: '🌍 Global Initiatives', type: 'chip', value: 'What are his key initiatives?' },
        { label: '📞 Direct Contact Info', type: 'chip', value: 'Direct Contact Information' },
      ],
    },
  ])

  // Play audio chime if enabled
  const playChime = () => {
    if (!soundEnabled) return
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12) // A5
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.23)
    } catch {
      // Audio not permitted or supported
    }
  }

  // Handle live active typing with debounce
  const handleInputChange = (e) => {
    const val = e.target.value
    setInputMessage(val)

    if (val.trim()) {
      setIsUserTyping(true)
      if (userTypingTimeoutRef.current) {
        clearTimeout(userTypingTimeoutRef.current)
      }
      // Stop typing indicator 750ms after user stops keying
      userTypingTimeoutRef.current = setTimeout(() => {
        setIsUserTyping(false)
      }, 750)
    } else {
      setIsUserTyping(false)
      if (userTypingTimeoutRef.current) {
        clearTimeout(userTypingTimeoutRef.current)
      }
    }
  }

  // Scroll to bottom of message stream
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      setUnreadCount(0)
      if (inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 150)
      }
    }
  }, [isOpen, messages, isTyping, isUserTyping])

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputMessage).trim()
    if (!query) return

    if (userTypingTimeoutRef.current) {
      clearTimeout(userTypingTimeoutRef.current)
    }
    setIsUserTyping(false)
    setHasInteracted(true)
    const userMsgId = Date.now()
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: query,
        timestamp: nowStr,
      },
    ])

    setInputMessage('')
    setIsTyping(true)

    // Initial AI thinking delay (400ms)
    setTimeout(() => {
      const replyData = getAutoReply(query)
      const fullText = replyData.text
      const botMsgId = Date.now() + 1
      const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      // Create streaming placeholder for bot message
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: 'bot',
          text: '',
          isStreaming: true,
          actions: [],
          timestamp: botTimestamp,
        },
      ])
      setIsTyping(false)

      // Smooth typewriter stream animation (typing 3-4 chars every 16ms)
      let currentLength = 0
      const step = 4
      const interval = setInterval(() => {
        currentLength += step
        if (currentLength >= fullText.length) {
          clearInterval(interval)
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId
                ? { ...msg, text: fullText, isStreaming: false, actions: replyData.actions }
                : msg
            )
          )
          playChime()
        } else {
          const partialText = fullText.slice(0, currentLength)
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId ? { ...msg, text: partialText } : msg
            )
          )
        }
      }, 16)
    }, 400)
  }

  const handleActionClick = (action) => {
    if (action.type === 'chip') {
      handleSendMessage(action.value)
    } else if (action.type === 'link') {
      window.location.href = action.value
    } else if (action.type === 'external') {
      window.open(action.value, '_blank', 'noopener,noreferrer')
    } else if (action.type === 'email') {
      window.location.href = `mailto:${action.value}`
    }
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text)
      setTimeout(() => setCopiedText(null), 2000)
    })
  }

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: `Chat reset. Please select a topic you would like to explore regarding **Gilbert Kwizera**, or type your inquiry:`,
        timestamp: 'Just now',
        actions: [
          { label: '🎗️ Philanthropy & CCF', type: 'chip', value: 'Tell me about Philanthropy & CCF' },
          { label: '🏛️ Dubai Headquarters', type: 'chip', value: 'Where is the Dubai Headquarters?' },
          { label: '💼 Strategic Consultations', type: 'chip', value: 'How to schedule a consultation?' },
          { label: '📖 Background & Bio', type: 'chip', value: 'What is his background & education?' },
          { label: '🌍 Global Initiatives', type: 'chip', value: 'What are his key initiatives?' },
          { label: '📞 Direct Contact Info', type: 'chip', value: 'Direct Contact Information' },
        ],
      },
    ])
  }

  if (!isVisible) return null

  return (
    <div
      data-floating-chatbot
      className="fixed bottom-6 right-5 z-[9999] flex flex-col items-end sm:right-7 animate-in fade-in duration-500 transform-gpu will-change-transform"
    >
      {/* ─── Chat Window Modal ────────────────────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Executive AI Assistant Chat"
          className="mb-3 flex h-[540px] max-h-[82vh] w-[92vw] sm:w-[380px] md:w-[410px] flex-col overflow-hidden rounded-2xl border border-bronze/40 bg-[#0c0d10]/95 shadow-[0_24px_70px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 z-[9999]"
        >
          {/* Header */}
          <div className="relative flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#171615] via-[#1f1c18] to-[#141312] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                <img
                  src={goldLogoImg}
                  alt="Gilbert Kwizera Emblem"
                  className="h-full w-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.45)]"
                />
                <span className="absolute bottom-0.5 right-0.5 z-10 h-3 w-3 rounded-full border-2 border-[#141312] bg-emerald-500 shadow-sm" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-white">
                    Gilbert Kwizera
                  </h3>
                  <span className="rounded bg-bronze/25 px-1 py-[1px] font-mono text-[9px] font-semibold text-bronze">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-white/60">Executive Assistant · Online</p>
              </div>
            </div>

            {/* Header Action Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
                aria-label="Toggle sound"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={handleResetChat}
                className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                title="Restart Conversation"
                aria-label="Reset chat"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                title="Close Window"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Context Strip */}
          <div className="flex items-center justify-between border-b border-white/5 bg-black/40 px-4 py-1.5 text-[10px] text-white/60">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-bronze" /> Dubai, UAE
            </span>
            <span className="font-mono text-bronze/90">Direct Inquiry Mode</span>
          </div>

          {/* Message History Feed */}
          <div className="flex-1 space-y-3.5 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                    <img
                      src={goldLogoImg}
                      alt="GK Emblem"
                      className="h-full w-full object-contain filter drop-shadow-[0_1px_5px_rgba(212,175,55,0.35)]"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md ${msg.sender === 'user'
                    ? 'bg-bronze text-paper rounded-br-none'
                    : 'border border-white/10 bg-[#16171c] text-[#EDE7DE] rounded-bl-none'
                    }`}
                >
                  {/* Formatted Markdown-like Text Rendering */}
                  <div className="space-y-1.5 leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.text.split('\n').map((line, idx) => {
                      if (!line) return <div key={idx} className="h-1" />
                      // Bold highlight parsing
                      const parts = line.split(/(\*\*.*?\*\*|\`.*?\`)/g)
                      return (
                        <p key={idx}>
                          {parts.map((p, i) => {
                            if (p.startsWith('**') && p.endsWith('**')) {
                              return (
                                <strong key={i} className="font-bold text-white">
                                  {p.slice(2, -2)}
                                </strong>
                              )
                            }
                            if (p.startsWith('`') && p.endsWith('`')) {
                              const codeVal = p.slice(1, -1)
                              return (
                                <button
                                  type="button"
                                  key={i}
                                  onClick={() => handleCopy(codeVal)}
                                  className="inline-flex items-center gap-1 rounded bg-black/50 px-1.5 py-0.5 font-mono text-[11px] text-bronze border border-bronze/30 hover:border-bronze transition-colors"
                                  title="Click to copy"
                                >
                                  {codeVal}
                                  {copiedText === codeVal ? (
                                    <Check className="h-2.5 w-2.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="h-2.5 w-2.5 opacity-60" />
                                  )}
                                </button>
                              )
                            }
                            return p
                          })}
                        </p>
                      )
                    })}
                    {msg.isStreaming && (
                      <span className="inline-block h-3.5 w-1.5 ml-1 translate-y-0.5 rounded-sm bg-bronze animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                    )}
                  </div>

                  {/* Interactive Action Chips */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-white/10 pt-2 animate-in fade-in duration-300">
                      {msg.actions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          type="button"
                          onClick={() => handleActionClick(act)}
                          className="flex items-center gap-1 rounded-lg border border-bronze/40 bg-bronze/10 px-2 py-1 text-[10.5px] font-medium text-bronze hover:bg-bronze hover:text-paper transition-all active:scale-95"
                        >
                          {act.type === 'email' && <Mail className="h-3 w-3" />}
                          {act.type === 'link' && <ExternalLink className="h-3 w-3" />}
                          {act.type === 'external' && <MapPin className="h-3 w-3" />}
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="mt-1 block text-right font-mono text-[9px] text-white/40">
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-bronze/60 bg-gradient-to-tr from-[#251d14] via-[#3b2d1e] to-[#60492e] text-amber-200 shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
                    <User className="h-4 w-4 text-amber-200" />
                  </div>
                )}
              </div>
            ))}

            {/* Live User Typing Indicator Bubble (Only active while user is keying) */}
            {isUserTyping && !isTyping && (
              <div className="flex justify-end items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center gap-2 rounded-2xl rounded-br-none border border-bronze/40 bg-gradient-to-r from-bronze/20 to-bronze/10 px-3.5 py-2 text-xs shadow-md backdrop-blur-sm">
                  <span className="font-mono text-[11px] text-amber-200 font-medium">
                    Typing...
                  </span>
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-bounce" />
                  </span>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-bronze/60 bg-gradient-to-tr from-[#251d14] via-[#3b2d1e] to-[#60492e] text-amber-200 shadow-md">
                  <User className="h-4 w-4 text-amber-200 animate-pulse" />
                </div>
              </div>
            )}

            {/* Realistic Bot Typing Indicator Animation */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                  <img
                    src={goldLogoImg}
                    alt="AI Concierge"
                    className="h-full w-full object-contain filter drop-shadow-[0_1px_5px_rgba(212,175,55,0.35)]"
                  />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-none border border-white/10 bg-[#16171c] px-3.5 py-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-bronze animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-bronze animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-bronze animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Suggestions Carousel */}
          {!hasInteracted && messages.length <= 2 && (
            <div className="border-t border-white/5 bg-black/30 p-2">
              <p className="px-2 pb-1 text-[10px] font-semibold text-white/50 uppercase tracking-wider">
                Recommended Topics:
              </p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none px-1">
                {SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(sug)}
                    className="shrink-0 rounded-full border border-white/10 bg-[#1e2026] px-2.5 py-1 text-[10.5px] text-white/80 hover:border-bronze hover:text-bronze transition-colors whitespace-nowrap"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2 border-t border-white/10 bg-[#111216] p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Ask anything about Gilbert Kwizera..."
              className="flex-1 rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder:text-white/40 focus:border-bronze focus:outline-none focus:ring-1 focus:ring-bronze transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-bronze text-paper shadow-md transition-all hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 active:scale-95"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* ─── Floating Trigger Button (Larger, Idle Animated, Expands on Hover) ── */}
      <div className="relative group z-[9999]">
        {/* Ambient Radar / Pulse Ring (Active only when idle & not open, disappears on hover) */}
        {!isOpen && (
          <>
            <span className="absolute -inset-2 rounded-full bg-bronze/30 animate-ping duration-1000 pointer-events-none transition-all duration-300 group-hover:opacity-0 group-hover:scale-90" />
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-bronze/40 via-amber-400/30 to-bronze/40 blur-md animate-pulse pointer-events-none transition-opacity duration-300 group-hover:opacity-0" />
          </>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex h-16 items-center justify-end rounded-full border border-bronze/60 bg-[#161513] p-1.5 shadow-[0_16px_45px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-bronze hover:bg-[#1c1a17] hover:shadow-[0_20px_55px_rgba(189,147,76,0.35)] active:scale-95 cursor-pointer overflow-hidden ${isOpen
            ? 'w-16 ring-2 ring-bronze ring-offset-2 ring-offset-[#0c0d10]'
            : 'w-16 group-hover:w-[176px]'
            }`}
          aria-label={isOpen ? 'Close Live Chat' : 'Open Live Chat - Ask Gilbert'}
        >
          {/* Left Text Block (Snug fit, perfectly balanced without empty left gap) */}
          {!isOpen && (
            <div className="flex flex-col text-left pl-3.5 pr-1.5 whitespace-nowrap overflow-hidden transition-all duration-300 opacity-0 max-w-0 group-hover:max-w-[108px] group-hover:opacity-100">
              {/* Top Kicker: LIVE CHAT */}
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[9.5px] font-bold tracking-[0.16em] text-bronze uppercase">
                  LIVE CHAT
                </span>
              </div>

              {/* Bottom Title: Ask Gilbert */}
              <p className="font-sans text-[14.5px] font-bold leading-tight tracking-tight text-[#FAF7F2] transition-colors group-hover:text-bronze">
                Ask Kwizera
              </p>
            </div>
          )}

          {/* Right Circular Emblem Badge (Prominent size, crystal clear, unclipped dot) */}
          <div className="relative h-[50px] w-[50px] shrink-0 rounded-full border-2 border-bronze/90 bg-gradient-to-b from-[#2a2620] to-[#121110] p-0.5 shadow-inner">
            {isOpen ? (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-bronze/20 text-bronze">
                <X className="h-6 w-6 stroke-[2.5]" />
              </div>
            ) : (
              <>
                <div className="h-full w-full overflow-hidden rounded-full">
                  <img
                    src={goldLogoImg}
                    alt="Gilbert Kwizera Emblem"
                    className="h-full w-full object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)] transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Pulsing Live Emerald Online Dot (Positioned cleanly on top without edge clipping) */}
                <span className="absolute -bottom-0.5 -right-0.5 z-20 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#161513] bg-emerald-500 shadow-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping opacity-75" />
                </span>
              </>
            )}
          </div>
        </button>
      </div>
    </div>
  )
}
