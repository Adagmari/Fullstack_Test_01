import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type TaskPriority = "alta" | "media" | "baja";
export type TaskStatus = "pendiente" | "en-progreso" | "completada";

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date;
  assignedTo: string;
  createdAt: Date;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByProject: (projectId: string) => Task[];
  getTask: (id: string) => Task | undefined;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const initialTasks: Task[] = [
  {
    id: "1",
    projectId: "1",
    title: "Diseñar mockups de homepage",
    description: "Crear diseños en Figma para la nueva página principal",
    priority: "alta",
    status: "en-progreso",
    dueDate: new Date("2024-03-20"),
    assignedTo: "1",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    projectId: "1",
    title: "Implementar responsive design",
    description: "Asegurar que el sitio funcione en todos los dispositivos",
    priority: "media",
    status: "pendiente",
    dueDate: new Date("2024-03-25"),
    assignedTo: "2",
    createdAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    projectId: "1",
    title: "Optimizar imágenes",
    description: "Comprimir y optimizar todas las imágenes del sitio",
    priority: "baja",
    status: "completada",
    dueDate: new Date("2024-03-10"),
    assignedTo: "1",
    createdAt: new Date("2024-01-17"),
  },
  {
    id: "4",
    projectId: "2",
    title: "Configurar proyecto React Native",
    description: "Inicializar proyecto y configurar dependencias",
    priority: "alta",
    status: "completada",
    dueDate: new Date("2024-02-15"),
    assignedTo: "1",
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "5",
    projectId: "2",
    title: "Implementar autenticación",
    description: "Sistema de login y registro de usuarios",
    priority: "alta",
    status: "en-progreso",
    dueDate: new Date("2024-03-30"),
    assignedTo: "3",
    createdAt: new Date("2024-02-05"),
  },
  {
    id: "6",
    projectId: "3",
    title: "Diseñar base de datos",
    description: "Crear esquema de base de datos para inventario",
    priority: "alta",
    status: "completada",
    dueDate: new Date("2024-02-20"),
    assignedTo: "2",
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "7",
    projectId: "3",
    title: "Crear API REST",
    description: "Desarrollar endpoints para gestión de inventario",
    priority: "alta",
    status: "en-progreso",
    dueDate: new Date("2024-04-05"),
    assignedTo: "3",
    createdAt: new Date("2024-02-12"),
  },
];

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'dueDate' || key === 'createdAt') {
        return new Date(value);
      }
      return value;
    }) : initialTasks;
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const getTasksByProject = (projectId: string) => {
    return tasks.filter((t) => t.projectId === projectId);
  };

  const getTask = (id: string) => {
    return tasks.find((t) => t.id === id);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTasksByProject,
        getTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
