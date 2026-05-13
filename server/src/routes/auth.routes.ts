import { Router } from 'express'
import { register, login } from '../controllers/auth.controller'
import { validate } from '../middlewares/validate'
import { registerValidator, loginValidator } from '../middlewares/validators'

const router = Router()

router.post('/register', validate(registerValidator), register)
router.post('/login', validate(loginValidator), login)

export default router