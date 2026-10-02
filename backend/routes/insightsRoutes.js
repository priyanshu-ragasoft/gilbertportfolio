import express from 'express'
import { getInsightsSection, updateInsightsSection } from '../controllers/insightsController.js'

const router = express.Router()

router.get('/', getInsightsSection)
router.put('/', updateInsightsSection)

export default router
