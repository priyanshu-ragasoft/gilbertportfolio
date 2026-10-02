import express from 'express'
import {
  getLivingTestimonies,
  updateLivingTestimonies,
  uploadSurvivorImage,
} from '../controllers/livingTestimonyController.js'
import { protect, adminOnly } from '../middlewares/authMiddleware.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.route('/').get(getLivingTestimonies).put(protect, adminOnly, updateLivingTestimonies)
router.post('/upload', protect, adminOnly, upload.single('image'), uploadSurvivorImage)

export default router
