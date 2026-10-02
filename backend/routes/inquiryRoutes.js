import express from 'express'
import {
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry,
} from '../controllers/inquiryController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Public route to submit contact or donation message
router.post('/', createInquiry)

// Protected admin routes
router.get('/', protect, getInquiries)
router.put('/:id', protect, updateInquiryStatus)
router.delete('/:id', protect, deleteInquiry)

export default router
