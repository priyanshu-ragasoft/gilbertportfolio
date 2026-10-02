import express from 'express'
import {
  getFeaturedStory,
  updateFeaturedStory,
  uploadFeaturedStoryImage,
} from '../controllers/featuredStoryController.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.get('/', getFeaturedStory)
router.put('/', updateFeaturedStory)
router.post('/upload', upload.single('image'), uploadFeaturedStoryImage)

export default router
