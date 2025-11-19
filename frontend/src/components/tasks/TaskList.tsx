import { useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/contexts/TaskContext";
import { TaskItem } from "./TaskItem";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">("all");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"date" | "priority" | "status">("date");

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;
      const matchesStatus =
        filterStatus === "all" || task.status === filterStatus;
      return matchesSearch && matchesPriority && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return a.dueDate.getTime() - b.dueDate.getTime();
      } else if (sortBy === "priority") {
        const priorityOrder = { alta: 0, media: 1, baja: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        const statusOrder = { pendiente: 0, "en-progreso": 1, completada: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="search">Buscar tareas</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              type="search"
              placeholder="Buscar por título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 md:w-auto">
          <div className="space-y-2">
            <Label htmlFor="filterPriority" className="text-xs">
              Prioridad
            </Label>
            <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as TaskPriority | "all")}>
              <SelectTrigger id="filterPriority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filterStatus" className="text-xs">
              Estado
            </Label>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as TaskStatus | "all")}>
              <SelectTrigger id="filterStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="en-progreso">En Progreso</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortBy" className="text-xs">
              Ordenar
            </Label>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as "date" | "priority" | "status")}>
              <SelectTrigger id="sortBy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Fecha</SelectItem>
                <SelectItem value="priority">Prioridad</SelectItem>
                <SelectItem value="status">Estado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No se encontraron tareas con los filtros aplicados
          </div>
        ) : (
          filteredAndSortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
