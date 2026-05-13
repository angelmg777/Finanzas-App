import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate'
import { expensesByCategory, monthlyFlow, netWorthHistory, summaryStats } from '../controllers/stats.controller'

const router = Router()
router.use(authenticate)

router.get('/expenses-by-category', expensesByCategory)
router.get('/monthly-flow', monthlyFlow)
router.get('/net-worth-history', netWorthHistory)
router.get('/summary', summaryStats)

export default router