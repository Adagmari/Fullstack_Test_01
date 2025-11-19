import { createContext, useContext, useState, useEffect, ReactNode } from "react";
const API_URL = import.meta.env.VITE_API_URL;
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  members: string[];
}

interface ProjectContextType {
  projects: Project[];
  refreshProjects: () => Promise<void>;
  addProject: (project: Omit<Project, "id" | "createdAt">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Rediseño de Website",
    description: "Modernizar la interfaz del sitio web corporativo",
    createdAt: new Date("2024-01-15"),
    members: ["1", "2"],
  },
  {
    id: "2",
    name: "App Mobile",
    description: "Desarrollo de aplicación móvil para clientes",
    createdAt: new Date("2024-02-01"),
    members: ["1", "3"],
  },
  {
    id: "3",
    name: "Sistema de Inventario",
    description: "Sistema interno para gestión de inventario",
    createdAt: new Date("2024-02-10"),
    members: ["2", "3"],
  },
];

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : initialProjects;
  });

  /*useEffect(() => {
    const loadProjects = async () => {
      const data = await getProjectByUser();
      console.log(data)
      if (data) {
        setProjects(data);
        localStorage.setItem("projects", JSON.stringify(data)); // <--- usar data, no projects
      }
    };
    loadProjects();
  }, []);*/
  useEffect(() => {
    refreshProjects();
  }, []);

  const transformProjects = (apiData: any[]): Project[] => {
    
    return apiData.map(project => {
      console.log(project.created_at); 
      return {
        id: project.project_id.toString(),
        name: project.name,
        description: project.description,
        createdAt: new Date(project.created_at),
        members: project.members.map((m: any) => m.user_id.toString()),
      };
    });
    
  };

  const getProjectByUser = async (): Promise<Project[] | undefined> => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_URL}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      return transformProjects(data); 
    } else {
      console.error("Error al obtener proyectos");
    }
  };

  const refreshProjects = async () => {
    const data = await getProjectByUser();
    console.log(data)
    if (data) {
      setProjects(data);
    }
  };

  const addProject = (project: Omit<Project, "id" | "createdAt">) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, ...updatedProject } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const getProject = (id: string) => {
    return projects.find((p) => p.id === id);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        refreshProjects,
        updateProject,
        deleteProject,
        getProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}
