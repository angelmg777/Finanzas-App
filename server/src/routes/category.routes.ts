import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate'
import { index, create, seed } from '../controllers/category.controller'

const router = Router()
router.use(authenticate)

router.get('/', index)
router.post('/', create)
router.post('/seed', seed)

export default router