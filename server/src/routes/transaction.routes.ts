import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate'
import { index, create, remove } from '../controllers/transaction.controller'
import { validate } from '../middlewares/validate'
import { transactionValidator } from '../middlewares/validators'

const router = Router()
router.use(authenticate)

router.get('/', index)
router.post('/', validate(transactionValidator), create)
router.delete('/:id', remove)

export default router