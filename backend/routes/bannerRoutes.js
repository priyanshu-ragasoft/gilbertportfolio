import express from 'express'
import { getBanner, updateBanner, uploadBannerImage } from '../controllers/bannerController.js'
import { protect } from '../middlewares/authMiddleware.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.get('/', getBanner)
router.put('/', updateBanner)
router.post('/upload', upload.single('image'), uploadBannerImage)

export default router
