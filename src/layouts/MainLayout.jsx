import { lazy, Suspense, useEffect, useRef } from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { gsap } from '../animations/gsapConfig'
import Cursor from '../components/Cursor'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import PageMotion from '../components/PageMotion'
import Preloader3D from '../components/Preloader3D'
import FloatingChatbot from '../components/Chatbot/FloatingChatbot'
import ProtectedRoute from '../components/admin/ProtectedRoute'
import AdminLayout from '../pages/admin/AdminLayout'
import AdminDashboard from '../pages/admin/AdminDashboard'
import BannerManager from '../pages/admin/BannerManager'
import IntroManager from '../pages/admin/IntroManager'
import AboutManager from '../pages/admin/AboutManager'
import ImpactManager from '../pages/admin/ImpactManager'
import ProjectManager from '../pages/admin/ProjectManager'
import FeaturedStoryManager from '../pages/admin/FeaturedStoryManager'
import TestimoniesManager from '../pages/admin/TestimoniesManager'
import GalleryManager from '../pages/admin/GalleryManager'
import EducationManager from '../pages/admin/EducationManager'
import PhilosophyManager from '../pages/admin/PhilosophyManager'
import BlogManager from '../pages/admin/BlogManager'
import InquiryManager from '../pages/admin/InquiryManager'
import SettingsManager from '../pages/admin/SettingsManager'
import JourneyManager from '../pages/admin/JourneyManager'
import AdminLogin from '../pages/admin/AdminLogin'
import { lenis, useLenis } from '../hooks/useLenis'
import Home from '../pages/Home'

const AboutPage = lazy(() => import('../pages/AboutPage'))
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'))
const ProjectDetail = lazy(() => import('../pages/ProjectDetail'))
const BlogPage = lazy(() => import('../pages/BlogPage'))
const InsightDetail = lazy(() => import('../pages/InsightDetail'))
const ImpactDetail = lazy(() => import('../pages/ImpactDetail'))
const ContactPage = lazy(() => import('../pages/ContactPage'))
const ArchivePage = lazy(() => import('../pages/ArchivePage'))
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'))
const TermsConditions = lazy(() => import('../pages/TermsConditions'))
const NotFound = lazy(() => import('../pages/NotFound'))

function PageFallback() {
  return <div className="min-h-screen bg-paper" role="status" aria-label="Loading page" />
}

function scrollToTarget(target, offset = -80) {
  if (!target) return
  const smoothEase = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  if (target === 0) {
    if (lenis) {
      lenis.scrollTo(0, { immediate: false, duration: 1.2, easing: smoothEase })
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const top = target.getBoundingClientRect().top + window.scrollY + offset
  if (lenis) {
    lenis.scrollTo(top, { immediate: false, duration: 1.25, easing: smoothEase })
    return
  }
  window.scrollTo({ top, behavior: 'smooth' })
}

export default function MainLayout() {
  const location = useLocation()
  const mainRef = useRef(null)
  const first = useRef(true)
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login'

  useLenis()

  useEffect(() => {
    if (isAdminRoute) {
      document.documentElement.classList.remove('is-intro')
      document.documentElement.style.overflow = 'auto'
      document.body.style.overflow = 'auto'
      document.body.style.height = 'auto'
    }
  }, [isAdminRoute])

  useEffect(() => {
    if (location.hash) {
      let attempts = 0
      const tryScroll = () => {
        const target = document.querySelector(location.hash)
        if (target) {
          scrollToTarget(target, -80)
        } else if (attempts < 5) {
          attempts += 1
          setTimeout(tryScroll, 100)
        }
      }

      if (document.documentElement.classList.contains('is-intro')) {
        window.addEventListener('intro:done', tryScroll, { once: true })
        return () => window.removeEventListener('intro:done', tryScroll)
      }

      const timer = setTimeout(tryScroll, 60)
      return () => clearTimeout(timer)
    } else {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true })
      }
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (mainRef.current) gsap.set(mainRef.current, { autoAlpha: 1 })
  }, [location.pathname])

  // Dedicated View for Admin Login and Admin Management Panel
  if (isAdminRoute) {
    return (
      <Routes location={location}>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="banner" element={<BannerManager />} />
          <Route path="intro" element={<IntroManager />} />
          <Route path="about" element={<AboutManager />} />
          <Route path="impact" element={<ImpactManager />} />
          <Route path="projects" element={<ProjectManager />} />
          <Route path="featured-story" element={<FeaturedStoryManager />} />
          <Route path="testimonies" element={<TestimoniesManager />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="education" element={<EducationManager />} />
          <Route path="philosophy" element={<PhilosophyManager />} />
          <Route path="blogs" element={<BlogManager />} />
          <Route path="blogs/new" element={<BlogManager />} />
          <Route path="inquiries" element={<InquiryManager />} />
          <Route path="journey" element={<JourneyManager />} />
          <Route path="settings" element={<SettingsManager />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    )
  }

  // Standard Public Portfolio View
  return (
    <>
      <Preloader3D />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[130] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <Cursor />
      <div className="flex min-h-svh flex-col">
        <Navbar />
        <main id="main" ref={mainRef} tabIndex={-1} className="relative z-[1] flex-1 outline-none">
          <div data-motion-root>
            <PageMotion key={location.pathname} />
            <Suspense fallback={<PageFallback />}>
              <Routes location={location}>
                <Route index element={<Home />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="projects/:slug" element={<ProjectDetail />} />
                <Route path="archive" element={<ArchivePage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/:slug" element={<InsightDetail />} />
                <Route path="insights" element={<BlogPage />} />
                <Route path="insights/:slug" element={<InsightDetail />} />
                <Route path="impact/:slug" element={<ImpactDetail />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="privacy" element={<PrivacyPolicy />} />
                <Route path="terms" element={<TermsConditions />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </main>
        <Footer />
      </div>
      <FloatingChatbot />
    </>
  )
}
