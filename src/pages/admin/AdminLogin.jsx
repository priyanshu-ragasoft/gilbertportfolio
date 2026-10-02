import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/Logo'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    document.documentElement.classList.remove('is-intro')
    document.documentElement.style.overflow = 'auto'
    document.body.style.overflow = 'auto'
    document.body.style.height = 'auto'
  }, [])

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!email || !password) {
      setFormError('Please enter both email and password.')
      return
    }

    setIsSubmitting(true)
    const result = await login(email, password)
    setIsSubmitting(false)

    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setFormError(result.error || 'Authentication failed. Please verify your credentials.')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0908] px-4 py-12 text-paper overflow-hidden selection:bg-[#8d7043]/30 selection:text-white">
      {/* Background ambient luxury lighting */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#C9A15A]/10 blur-[150px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#8d7043]/15 blur-[150px]"
        aria-hidden="true"
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glow laser line */}
        <div className="mx-auto h-0.5 w-3/4 bg-gradient-to-r from-transparent via-[#C9A15A] to-transparent opacity-80" />

        <div className="rounded-3xl border border-white/10 bg-[#14120e]/85 p-5 sm:p-10 shadow-2xl backdrop-blur-2xl">
          {/* Logo & Header */}
          <div className="text-center">
            <Link to="/" className="inline-block transition-transform hover:scale-105">
              <Logo variant="lockup" priority className="h-16 w-auto mx-auto object-contain drop-shadow-lg" />
            </Link>
            <div className="mt-6 flex items-center justify-center gap-2">
              <span className="h-px w-6 bg-[#C9A15A]" />
              <span className="text-[0.62rem] font-semibold tracking-[0.12em] text-[#C9A15A] uppercase sm:text-[0.68rem] sm:tracking-[0.25em]">
                Secure Executive Portal
              </span>
              <span className="h-px w-6 bg-[#C9A15A]" />
            </div>
            <h1 className="display mt-2 text-2xl sm:text-3xl text-white font-normal">
              CMS Admin Access
            </h1>
            <p className="mt-2 text-xs text-mist/70 font-light">
              Enter your authorized credentials to manage publications, field records, and donor communications.
            </p>
          </div>

          {/* Error Alert */}
          {formError && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-mist/80 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist/50" />
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gilbert.com"
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-10 pr-4 text-sm text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none focus:ring-1 focus:ring-[#C9A15A] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-mist/80 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-10 pr-11 text-sm text-white placeholder:text-mist/30 focus:border-[#C9A15A] focus:outline-none focus:ring-1 focus:ring-[#C9A15A] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mist/50 hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8d7043] to-[#C9A15A] py-3.5 text-sm font-semibold tracking-wider text-black uppercase shadow-[0_4px_20px_rgba(201,161,90,0.25)] transition-all duration-300 hover:opacity-95 hover:shadow-[0_6px_25px_rgba(201,161,90,0.4)] disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to Home Link */}

      </div>
    </div>
  )
}
