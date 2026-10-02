import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'
import { errorHandler } from './middlewares/errorMiddleware.js'
import { serveStoredUpload } from './middlewares/uploadMiddleware.js'
import User from './models/User.js'
import Blog from './models/Blog.js'

// Import Routes
import authRoutes from './routes/authRoutes.js'
import blogRoutes from './routes/blogRoutes.js'
import inquiryRoutes from './routes/inquiryRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import bannerRoutes from './routes/bannerRoutes.js'
import introductionRoutes from './routes/introductionRoutes.js'
import aboutRoutes from './routes/aboutRoutes.js'
import impactRoutes from './routes/impactRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import featuredStoryRoutes from './routes/featuredStoryRoutes.js'
import galleryRoutes from './routes/galleryRoutes.js'
import educationRoutes from './routes/educationRoutes.js'
import insightsRoutes from './routes/insightsRoutes.js'
import philosophyRoutes from './routes/philosophyRoutes.js'
import settingsRoutes from './routes/settingsRoutes.js'
import journeyRoutes from './routes/journeyRoutes.js'
import livingTestimonyRoutes from './routes/livingTestimonyRoutes.js'

import mongoose from 'mongoose'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize Express App
const app = express()
app.set('trust proxy', 1)

let adminSeeded = false
const ensureAdminAndDB = async () => {
  await connectDB()
  if (!adminSeeded && mongoose.connection.readyState === 1) {
    try {
      const defaultEmail = process.env.ADMIN_EMAIL || 'admin@gilbert.com'
      const defaultPassword = process.env.ADMIN_PASSWORD || 'Admin@123456'
      const adminCount = await User.countDocuments()
      if (adminCount === 0) {
        await User.create({
          name: 'Gilbert Executive Admin',
          email: defaultEmail,
          password: defaultPassword,
          role: 'superadmin',
        })
        console.log(`[Seed]: Default Admin created -> Email: ${defaultEmail}`)
      }
      adminSeeded = true
    } catch (error) {
      console.warn(`[Seed Warning]:`, error.message)
    }
  }
}

// Connect to MongoDB on local development start
if (!process.env.VERCEL) {
  ensureAdminAndDB()
}

// Middlewares
app.use(
  cors({
    origin: '*', // Allow all origins in dev or configure as needed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// GridFS uploads (Vercel) fall through to the local uploads folder in development
app.use('/uploads', serveStoredUpload)
const uploadsPath = path.join(__dirname, 'uploads')
if (fs.existsSync(uploadsPath)) {
  app.use('/uploads', express.static(uploadsPath))
}

// Serverless DB Connection & Initialization Middleware
app.use(async (req, res, next) => {
  try {
    await ensureAdminAndDB()
  } catch (err) {
    console.warn('[DB Middleware Notice]:', err.message)
  }
  next()
})

// Health check route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'connecting'
  res.status(200).json({
    status: 'online',
    db: dbStatus,
    timestamp: new Date(),
    service: 'Gilbert Portfolio CMS API',
  })
})

// Mount API Routes
app.use('/api/auth', authRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/banner', bannerRoutes)
app.use('/api/intro', introductionRoutes)
app.use('/api/about', aboutRoutes)
app.use('/api/impact', impactRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/featured-story', featuredStoryRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/education', educationRoutes)
app.use('/api/insights-section', insightsRoutes)
app.use('/api/philosophy', philosophyRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/journey', journeyRoutes)
app.use('/api/testimonies', livingTestimonyRoutes)

// Central Error Handling Middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Server]: Gilbert Backend running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`)
  })
}

export default app
