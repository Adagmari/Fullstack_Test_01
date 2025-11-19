import { Task } from "@/contexts/TaskContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, Trash2, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityStyles = {
  alta: "bg-destructive/10 text-destructive border-destructive/20",
  media: "bg-warning/10 text-warning border-warning/20",
  baja: "bg-muted text-muted-foreground border-border",
};

const statusStyles = {
  pendiente: "bg-muted text-muted-foreground border-border",
  "en-progreso": "bg-primary/10 text-primary border-primary/20",
  completada: "bg-success/10 text-success border-success/20",
};

export function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  return (
    <div className="group rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-card-foreground">{task.title}</h3>
            <Badge
              variant="outline"
              className={cn("capitalize text-xs", priorityStyles[task.priority])}
            >
              {task.priority}
            </Badge>
            <Badge
              variant="outline"
              className={cn("capitalize text-xs", statusStyles[task.status])}
            >
              {task.status === "en-progreso" ? "En Progreso" : task.status}
            </Badge>
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground">{task.description}</p>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(task.dueDate, "d MMM yyyy", { locale: es })}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Usuario {task.assignedTo}
            </span>
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
