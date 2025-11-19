import { Request, Response } from 'express';
import { findById } from '../services/user.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export const profile = async (req: AuthRequest, res: Response) => {
  const userId = (req.user as any)?.sub;
  if (!userId) return res.status(401).json({ message: 'No autorizado' });
  const user = await findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password, ...safe } = user as any;
  res.json(safe);
};
