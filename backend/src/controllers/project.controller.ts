// src/controllers/project.controller.ts
import { Request, Response } from "express";
import * as ProjectService from "../services/project.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createProject = async (req: AuthRequest, res: Response) => {
    try {
      const { name, description, memberIds } = req.body;
  
      // ID del usuario autenticado
      const userId = (req.user as any)?.sub;
      if (!userId) return res.status(401).json({ message: "No autorizado" });
  
      // Asegurar que el creador sea miembro
      const members = userId ? [...(memberIds || []), userId] : memberIds;
  
      const project = await ProjectService.createProject(name, description, members);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };


export const getAllProjects = async (req: AuthRequest, res: Response) => {
    try {
      const userId = (req.user as any)?.sub;
      if (!userId) return res.status(401).json({ message: "No autorizado" });
  
      const projects = await ProjectService.findProjectsByUser(userId);
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await ProjectService.findProjectById(Number(req.params.id));
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const project = await ProjectService.updateProject(Number(req.params.id), req.body);
    res.json(project);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    await ProjectService.deleteProject(Number(req.params.id));
    res.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
