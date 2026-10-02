import express from 'express'
import { getGallery, updateGallery, uploadGalleryImage } from '../controllers/galleryController.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.get('/', getGallery)
router.put('/', updateGallery)
router.post('/upload', upload.single('image'), uploadGalleryImage)

export default router
