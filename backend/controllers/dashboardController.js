import mongoose from 'mongoose'
import Blog from '../models/Blog.js'
import Inquiry from '../models/Inquiry.js'
import User from '../models/User.js'
import Project from '../models/Project.js'
import GallerySection from '../models/Gallery.js'
import ImpactSection from '../models/Impact.js'
import EducationSection from '../models/Education.js'
import FeaturedStory from '../models/FeaturedStory.js'
import Philosophy from '../models/Philosophy.js'

// @desc    Get comprehensive live dashboard metrics & activity directly from MongoDB
// @route   GET /api/dashboard/stats
// @access  Private (Admin Only)
export const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Live Blog Metrics
    const totalBlogs = await Blog.countDocuments()
    const publishedBlogs = await Blog.countDocuments({ isPublished: true })
    const draftBlogs = await Blog.countDocuments({ isPublished: false })
    const featuredBlogs = await Blog.countDocuments({ featured: true })

    const totalViewsResult = await Blog.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ])
    const totalViews = totalViewsResult[0]?.totalViews || 0

    const categoryStats = await Blog.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    const recentBlogs = await Blog.find()
      .select('title slug category date readTime views isPublished featured image createdAt')
      .sort({ createdAt: -1 })
      .limit(6)

    // 2. Live Inquiries Metrics
    const totalInquiries = await Inquiry.countDocuments()
    const newInquiries = await Inquiry.countDocuments({ status: 'new' })
    const respondedInquiries = await Inquiry.countDocuments({ status: 'responded' })
    const archivedInquiries = await Inquiry.countDocuments({ status: 'archived' })

    const recentInquiries = await Inquiry.find()
      .sort({ createdAt: -1 })
      .limit(6)

    // 3. Live Projects & Field Initiatives
    let totalProjects = 0
    try {
      const projectDoc = await Project.findOne()
      if (projectDoc && Array.isArray(projectDoc.projects)) {
        totalProjects = projectDoc.projects.length
      }
    } catch (e) {
      totalProjects = 0
    }

    // 4. Live Gallery & Visual Archives
    let totalPhotos = 0
    let galleryCategories = []
    try {
      const galleryDoc = await GallerySection.findOne()
      if (galleryDoc && Array.isArray(galleryDoc.items)) {
        totalPhotos = galleryDoc.items.length
        galleryCategories = galleryDoc.categories || []
      }
    } catch (e) {
      totalPhotos = 0
    }

    // 5. Live Impact & Healthcare Initiatives
    let totalImpactInitiatives = 0
    try {
      const impactDoc = await ImpactSection.findOne()
      if (impactDoc && Array.isArray(impactDoc.initiatives)) {
        totalImpactInitiatives = impactDoc.initiatives.length
      }
    } catch (e) {
      totalImpactInitiatives = 0
    }

    // 6. Live Education Credentials
    let totalEducationItems = 0
    try {
      const eduDoc = await EducationSection.findOne()
      if (eduDoc && Array.isArray(eduDoc.degrees)) {
        totalEducationItems = eduDoc.degrees.length
      }
    } catch (e) {
      totalEducationItems = 0
    }

    // 7. System & Database Health
    const dbState = mongoose.connection.readyState // 1 = connected
    const uptimeSeconds = Math.floor(process.uptime())
    const memoryUsageMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024)

    res.status(200).json({
      success: true,
      data: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        featuredBlogs,
        totalViews,
        categoryStats,
        recentBlogs,
        totalInquiries,
        newInquiries,
        respondedInquiries,
        archivedInquiries,
        recentInquiries,
        totalProjects,
        totalPhotos,
        galleryCategories,
        totalImpactInitiatives,
        totalEducationItems,
        system: {
          databaseStatus: dbState === 1 ? 'Connected (MongoDB)' : 'Connecting...',
          dbName: mongoose.connection.name || 'gilbert',
          uptimeSeconds,
          memoryUsageMB,
          serverTimestamp: new Date().toISOString(),
          nodeVersion: process.version,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}
