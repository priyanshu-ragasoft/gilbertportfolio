import express from 'express'
import multer from 'multer'
import path from 'path'
import {
  getLivingTestimonies,
  updateLivingTestimonies,
  uploadSurvivorImage,
} from '../controllers/livingTestimonyController.js'
import { protect, adminOnly } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(null, `survivor-${Date.now()}${path.extname(file.originalname)}`)
  },
})

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|svg/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb(new Error('Images only (jpg, jpeg, png, webp, svg)'))
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

router.route('/').get(getLivingTestimonies).put(protect, adminOnly, updateLivingTestimonies)
router.post('/upload', protect, adminOnly, upload.single('image'), uploadSurvivorImage)

export default router
