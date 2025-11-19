import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTasks, Task, TaskPriority, TaskStatus } from "@/contexts/TaskContext";
import { useProjects } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface TaskFormProps {
  task?: Task;
  projectId?: string;
  onSuccess: () => void;
}

export function TaskForm({ task, projectId, onSuccess }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || "media");
  const [status, setStatus] = useState<TaskStatus>(task?.status || "pendiente");
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? format(task.dueDate, "yyyy-MM-dd") : ""
  );
  const [selectedProjectId, setSelectedProjectId] = useState(
    task?.projectId || projectId || ""
  );
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo || "1");

  const { addTask, updateTask } = useTasks();
  const { projects } = useProjects();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !selectedProjectId || !dueDate) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const taskData = {
      title,
      description,
      priority,
      status,
      dueDate: new Date(dueDate),
      projectId: selectedProjectId,
      assignedTo,
    };

    if (task) {
      updateTask(task.id, taskData);
      toast({
        title: "¡Tarea actualizada!",
        description: "La tarea se ha actualizado correctamente",
      });
    } else {
      addTask(taskData);
      toast({
        title: "¡Tarea creada!",
        description: "La nueva tarea se ha creado correctamente",
      });
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título de la Tarea</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Diseñar mockups"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe la tarea..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="project">Proyecto</Label>
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger id="project">
              <SelectValue placeholder="Selecciona un proyecto" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Fecha Límite</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority">Prioridad</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
            <SelectTrigger id="priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="en-progreso">En Progreso</SelectItem>
              <SelectItem value="completada">Completada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit">
          {task ? "Actualizar" : "Crear"} Tarea
        </Button>
      </div>
    </form>
  );
}
