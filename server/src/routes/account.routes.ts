import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate'
import { index, show, create, update, remove, summary } from '../controllers/account.controller'
import { validate } from '../middlewares/validate'
import { accountValidator } from '../middlewares/validators'

const router = Router()
router.use(authenticate)

router.get('/', index)
router.get('/summary', summary)
router.get('/:id', show)
router.post('/', validate(accountValidator), create)
router.put('/:id', update)
router.delete('/:id', remove)

export default router