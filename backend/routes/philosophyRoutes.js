import express from 'express'
import {
  getPhilosophy,
  updatePhilosophy,
  uploadPhilosophyImage,
} from '../controllers/philosophyController.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.get('/', getPhilosophy)
router.put('/', updatePhilosophy)
router.post('/upload', upload.single('image'), uploadPhilosophyImage)

export default router
