import express from 'express'
import {
  login,
  getMe,
  updateProfile,
  updatePassword,
} from '../controllers/authController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/update-profile', protect, updateProfile)
router.put('/update-password', protect, updatePassword)

export default router
