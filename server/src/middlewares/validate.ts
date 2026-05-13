import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { sendError } from '../utils/response'

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    for (const validation of validations) {
      await validation.run(req)
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const message = errors.array()[0].msg as string
      sendError(res, message, 400)
      return
    }
    next()
  }
}