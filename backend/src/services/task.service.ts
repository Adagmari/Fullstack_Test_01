// src/services/task.service.ts
import { AppDataSource } from '../data-source';
import { Task } from '../entities/Task';
import { Project } from '../entities/Project';
import { User } from '../entities/User';

const taskRepo = () => AppDataSource.getRepository(Task);
const projectRepo = () => AppDataSource.getRepository(Project);
const userRepo = () => AppDataSource.getRepository(User);

export const createTask = async (
  project_id: number,
  title: string,
  description?: string,
  priority?: 'baja' | 'media' | 'alta',
  status?: 'pendiente' | 'en-progreso' | 'completada',
  due_date?: Date,
  assignedIds?: number[]
) => {
  const repo = taskRepo();
  const project = await projectRepo().findOne({ where: { project_id } });
  if (!project) throw new Error('PROJECT_NOT_FOUND');

  const task = repo.create({ project, title, description, priority, status, due_date });

  if (assignedIds && assignedIds.length > 0) {
    const users = await userRepo().findByIds(assignedIds);
    task.assignedTo = users;
  }

  return await repo.save(task);
};

export const findAllTasks = async () => {
  return await taskRepo().find({ relations: ['project', 'assignedTo'] });
};

export const findTaskById = async (task_id: number) => {
  return await taskRepo().findOne({
    where: { task_id },
    relations: ['project', 'assignedTo']
  });
};

export const updateTask = async (
  task_id: number,
  data: Partial<{
    title: string;
    description: string;
    priority: 'baja' | 'media' | 'alta';
    status: 'pendiente' | 'en-progreso' | 'completada';
    due_date: Date;
    assignedIds: number[];
  }>
) => {
  const repo = taskRepo();
  const task = await repo.findOne({ where: { task_id }, relations: ['assignedTo'] });
  if (!task) throw new Error('TASK_NOT_FOUND');

  if (data.title !== undefined) task.title = data.title;
  if (data.description !== undefined) task.description = data.description;
  if (data.priority !== undefined) task.priority = data.priority;
  if (data.status !== undefined) task.status = data.status;
  if (data.due_date !== undefined) task.due_date = data.due_date;

  if (data.assignedIds) {
    const users = await userRepo().findByIds(data.assignedIds);
    task.assignedTo = users;
  }

  return await repo.save(task);
};

export const deleteTask = async (task_id: number) => {
  const repo = taskRepo();
  const task = await repo.findOne({ where: { task_id } });
  if (!task) throw new Error('TASK_NOT_FOUND');
  return await repo.remove(task);
};
