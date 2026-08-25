import { body, validationResult } from 'express-validator';
import { ROLES } from '../constants/roles.js';


export const signupValidationRules = [
  body('email')
    .isEmail().withMessage('A valid email is required')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required'),

  body('role')
    .isIn(Object.values(ROLES)).withMessage('Role must be student, recruiter, or admin'),


  body('branch')
    .if(body('role').equals(ROLES.STUDENT))
    .notEmpty().withMessage('Branch is required for students'),

  body('passingYear')
    .if(body('role').equals(ROLES.STUDENT))
    .isInt({ min: 2000, max: 2100 }).withMessage('Valid passing year is required'),

  body('cgpa')
    .if(body('role').equals(ROLES.STUDENT))
    .isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10'),

 
  body('companyName')
    .if(body('role').equals(ROLES.RECRUITER))
    .notEmpty().withMessage('Company name is required for recruiters'),
];

export const loginValidationRules = [
  body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
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