import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProjects, Project } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";

interface ProjectFormProps {
  project?: Project;
  onSuccess: () => void;
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const { addProject, updateProject } = useProjects();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del proyecto es requerido",
        variant: "destructive",
      });
      return;
    }

    if (project) {
      updateProject(project.id, { name, description });
      toast({
        title: "¡Proyecto actualizado!",
        description: "El proyecto se ha actualizado correctamente",
      });
    } else {
      addProject({ name, description, members: [] });
      toast({
        title: "¡Proyecto creado!",
        description: "El nuevo proyecto se ha creado correctamente",
      });
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre del Proyecto</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Rediseño de Website"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe el proyecto..."
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit">
          {project ? "Actualizar" : "Crear"} Proyecto
        </Button>
      </div>
    </form>
  );
}
