import express from 'express'
import { getIntro, updateIntro, uploadIntroImage } from '../controllers/introductionController.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.get('/', getIntro)
router.put('/', updateIntro)
router.post('/upload', upload.single('image'), uploadIntroImage)

export default router
