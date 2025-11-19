// src/services/user.service.ts
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';

const userRepo = () => AppDataSource.getRepository(User);

export const createUser = async (
  user_email: string,
  user_clave: string,
  user_names?: string,
  user_rol?:number
) => {
  const repo = userRepo();

  const existing = await repo.findOne({ where: { user_email } });
  if (existing) {
    throw new Error('EMAIL_EXISTS');
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(user_clave, salt);

  const user = repo.create({ user_email, user_clave: hashed, user_names, user_rol: 1 });
  return await repo.save(user);
};

export const findByEmail = async (user_email: string) => {
  return await userRepo().findOne({ where: { user_email } });
};

export const findById = async (user_id: string) => {
  return await userRepo().findOne({ where: { user_id: Number(user_id) } });
};
