import express from 'express'
import { getAbout, updateAbout, uploadAboutImage } from '../controllers/aboutController.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.get('/', getAbout)
router.put('/', updateAbout)
router.post('/upload', upload.single('image'), uploadAboutImage)

export default router
