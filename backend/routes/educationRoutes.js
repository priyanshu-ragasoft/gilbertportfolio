import express from 'express'
import { getEducation, updateEducation, uploadEducationImage } from '../controllers/educationController.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.get('/', getEducation)
router.put('/', updateEducation)
router.post('/upload', upload.single('image'), uploadEducationImage)

export default router
