import { Router } from 'express'
import {
  register,
  login,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordController,
} from '../controllers/auth.controller'
import { validate } from '../middlewares/validate'
import { registerValidator, loginValidator } from '../middlewares/validators'

const router = Router()

router.post('/register', validate(registerValidator), register)
router.post('/login', validate(loginValidator), login)
router.get('/verify-email', verifyEmailController)
router.post('/forgot-password', forgotPasswordController)
router.post('/reset-password', resetPasswordController)

export default router