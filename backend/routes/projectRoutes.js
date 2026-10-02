import express from 'express'
import { getProjects, updateProjects, uploadProjectImage } from '../controllers/projectController.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.get('/', getProjects)
router.put('/', updateProjects)
router.post('/upload', upload.single('image'), uploadProjectImage)

export default router
