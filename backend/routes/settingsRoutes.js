import express from 'express'
import {
  getSettings,
  updateSettings,
  uploadFooterLogo,
  changeAdminPassword,
} from '../controllers/settingsController.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

router.get('/', getSettings)
router.put('/', updateSettings)
router.post('/upload-logo', upload.single('logo'), uploadFooterLogo)
router.put('/change-password', changeAdminPassword)

export default router
