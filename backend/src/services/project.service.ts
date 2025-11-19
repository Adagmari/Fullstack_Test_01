// src/services/project.service.ts
import { AppDataSource } from '../data-source';
import { Project } from '../entities/Project';
import { User } from '../entities/User';

const projectRepo = () => AppDataSource.getRepository(Project);
const userRepo = () => AppDataSource.getRepository(User);

export const createProject = async (
  name: string,
  description?: string,
  memberIds?: number[]
) => {
  const repo = projectRepo();

  const project = repo.create({ name, description });
  
  if (memberIds && memberIds.length > 0) {
    const members = await userRepo().findByIds(memberIds);
    project.members = members;
  }

  return await repo.save(project);
};

export const findAllProjects = async () => {
  return await projectRepo().find({ relations: ['members', 'tasks', 'tasks.assignedTo'] });
};

export const findProjectById = async (project_id: number) => {
  return await projectRepo().findOne({
    where: { project_id },
    relations: ['members', 'tasks', 'tasks.assignedTo']
  });
};

export const findProjectsByUser = async (userId: number) => {
    return await projectRepo()
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.members", "member")
      .leftJoinAndSelect("project.tasks", "task")
      .leftJoin("task.assignedTo", "assigned")
      .addSelect([
        "member.user_id",
        "member.user_names",
        "member.user_email",
        "assigned.user_id",
        "assigned.user_names",
        "assigned.user_email"
      ])
      .where("member.user_id = :userId", { userId })
      .getMany();
  };
  
  
  

export const updateProject = async (
  project_id: number,
  data: Partial<{ name: string; description: string; memberIds: number[] }>
) => {
  const repo = projectRepo();
  const project = await repo.findOne({ where: { project_id }, relations: ['members'] });
  if (!project) throw new Error('PROJECT_NOT_FOUND');

  if (data.name !== undefined) project.name = data.name;
  if (data.description !== undefined) project.description = data.description;

  if (data.memberIds) {
    const members = await userRepo().findByIds(data.memberIds);
    project.members = members;
  }

  return await repo.save(project);
};

export const deleteProject = async (project_id: number) => {
  const repo = projectRepo();
  const project = await repo.findOne({ where: { project_id } });
  if (!project) throw new Error('PROJECT_NOT_FOUND');
  return await repo.remove(project);
};
