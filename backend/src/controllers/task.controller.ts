// src/controllers/task.controller.ts
import { Request, Response } from "express";
import * as TaskService from "../services/task.service";

export const createTask = async (req: Request, res: Response) => {
  try {
    const { project_id, title, description, priority, status, due_date, assignedIds } = req.body;
    const task = await TaskService.createTask(project_id, title, description, priority, status, due_date, assignedIds);
    res.status(201).json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await TaskService.findAllTasks();
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const task = await TaskService.findTaskById(Number(req.params.id));
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await TaskService.updateTask(Number(req.params.id), req.body);
    res.json(task);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    await TaskService.deleteTask(Number(req.params.id));
    res.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
