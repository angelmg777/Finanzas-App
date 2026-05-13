import { body } from 'express-validator'

export const registerValidator = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('name').trim().isLength({ min: 2 }).withMessage('Nombre mínimo 2 caracteres'),
  body('password').isLength({ min: 8 }).withMessage('Contraseña mínimo 8 caracteres'),
]

export const loginValidator = [
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('Contraseña requerida'),
]

export const accountValidator = [
  body('name').trim().isLength({ min: 2 }).withMessage('Nombre mínimo 2 caracteres'),
  body('type').isIn(['DEBIT', 'CREDIT', 'CASH']).withMessage('Tipo inválido'),
  body('balance').optional().isFloat({ min: 0 }).withMessage('Saldo inválido'),
  body('creditLimit').optional().isFloat({ min: 0 }).withMessage('Límite inválido'),
]

export const transactionValidator = [
  body('type').isIn(['INCOME', 'EXPENSE', 'TRANSFER']).withMessage('Tipo inválido'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Monto debe ser mayor a 0'),
  body('accountId').notEmpty().withMessage('Cuenta requerida'),
  body('destinationAccountId').optional().isString(),
  body('categoryId').optional().isString(),
  body('description').optional().trim().isLength({ max: 200 }).withMessage('Descripción máximo 200 caracteres'),
  body('date').optional().isISO8601().withMessage('Fecha inválida'),
]