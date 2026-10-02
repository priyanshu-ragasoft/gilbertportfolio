import express from 'express'
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
} from '../controllers/blogController.js'
import { protect } from '../middlewares/authMiddleware.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

// Public routes
router.get('/', getBlogs)
router.get('/:slugOrId', getBlogBySlug)

// Protected Admin routes
router.post('/', protect, createBlog)
router.put('/:id', protect, updateBlog)
router.delete('/:id', protect, deleteBlog)
router.post('/upload', protect, upload.single('image'), uploadBlogImage)

export default router
