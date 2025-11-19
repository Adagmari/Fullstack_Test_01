import { findByEmail } from './user.service';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN && !isNaN(Number(process.env.JWT_EXPIRES_IN)) 
  ? Number(process.env.JWT_EXPIRES_IN) 
  : '1h';

export const loginUser = async (user_email: string, password: string) => {
  const user = await findByEmail(user_email);
  if (!user) throw new Error('INVALID_CREDENTIALS');

  const match = await bcrypt.compare(password, user.user_clave);
  if (!match) throw new Error('INVALID_CREDENTIALS');

  const payload = { sub: user.user_id, user_email: user.user_email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
  return { access_token: token, expires_in: EXPIRES_IN };
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error('INVALID_TOKEN');
  }
};
