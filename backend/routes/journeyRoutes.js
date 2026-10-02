import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  getJourney,
  updateJourney,
  uploadJourneyImage,
} from '../controllers/journeyController.js'
import { protect, authorize } from '../middlewares/authMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

// Configure Multer storage for Journey milestone images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'journey-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp|svg|gif/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error('Only image files (JPEG, PNG, WebP, SVG, GIF) are allowed!'))
  },
})

router
  .route('/')
  .get(getJourney)
  .put(protect, authorize('superadmin', 'admin', 'editor'), updateJourney)

router
  .route('/upload')
  .post(
    protect,
    authorize('superadmin', 'admin', 'editor'),
    upload.single('image'),
    uploadJourneyImage
  )

export default router
