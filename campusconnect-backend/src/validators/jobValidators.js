import { body, validationResult } from 'express-validator';

export const createJobValidationRules = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('location').optional().trim(),
  body('jobType')
    .optional()
    .isIn(['full-time', 'internship', 'part-time'])
    .withMessage('jobType must be full-time, internship, or part-time'),

  body('minCgpa')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('minCgpa must be between 0 and 10'),

  body('minPassingYear')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('minPassingYear must be a valid year'),

  body('maxPassingYear')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('maxPassingYear must be a valid year'),

  body('ctcLpa')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('ctcLpa must be a positive number'),

  body('applicationDeadline')
    .optional()
    .isISO8601()
    .withMessage('applicationDeadline must be a valid date'),

  body('eligibleBranches')
    .optional()
    .isArray()
    .withMessage('eligibleBranches must be an array of branch names'),
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