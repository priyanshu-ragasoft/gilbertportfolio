import express from 'express'
import {
  getJourney,
  updateJourney,
  uploadJourneyImage,
} from '../controllers/journeyController.js'
import { protect, authorize } from '../middlewares/authMiddleware.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router
  .route('/')
  .get(getJourney)
  .put(protect, authorize('superadmin', 'admin', 'editor'), updateJourney)

router
  .route('/upload')
  .post(
    protect,
    authorize('superadmin', 'admin', 'editor'),
    upload.single('image'),
    uploadJourneyImage
  )

export default router
