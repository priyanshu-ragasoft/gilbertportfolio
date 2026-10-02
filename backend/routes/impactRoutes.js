import express from 'express'
import { getImpact, updateImpact, uploadImpactImage } from '../controllers/impactController.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.get('/', getImpact)
router.put('/', updateImpact)
router.post('/upload', upload.single('image'), uploadImpactImage)

export default router
