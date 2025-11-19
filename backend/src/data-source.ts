import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Task } from './entities/Task';
import { Project } from './entities/Project';
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Project, Task],
  synchronize: true, // DEV: true para crear tablas automáticamente. En producción usa migrations.
  logging: false,
});
