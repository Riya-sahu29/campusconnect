import { body, validationResult } from 'express-validator';
import { APPLICATION_STATUS } from '../constants/roles.js';

export const updateStatusValidationRules = [
  body('status')
    .isIn(Object.values(APPLICATION_STATUS))
    .withMessage(`status must be one of: ${Object.values(APPLICATION_STATUS).join(', ')}`),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};