import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { createUser } from '../services/user.service';
import { loginUser } from '../services/auth.service';

export const registerValidators = [
  body('user_email').isEmail().withMessage('Invalid email'),
  body('user_clave').isLength({ min: 8 }).withMessage('Password min length 8'),
  body('user_names').optional().isString(),
];

export const loginValidators = [
  body('user_email').isEmail(),
  body('user_clave').isString(),
];

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { user_email, user_clave, user_names } = req.body;
  try {
    const user = await createUser(user_email, user_clave, user_names);
    // no devolver password
    const { user_clave: _p, ...safe } = user as any;
    return res.status(201).json(safe);
  } catch (err: any) {
    if (err.message === 'EMAIL_EXISTS') return res.status(409).json({ message: 'Email already registered' });
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { user_email, user_clave } = req.body;
  try {
    const token = await loginUser(user_email, user_clave);
    return res.json(token);
  } catch (err: any) {
    if (err.message === 'INVALID_CREDENTIALS') return res.status(401).json({ message: 'Invalid credentials' });
    return res.status(500).json({ message: 'Server error' });
  }
};
