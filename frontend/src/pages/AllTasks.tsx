import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/Modal";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { useTasks, Task } from "@/contexts/TaskContext";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AllTasks() {
  const { tasks, deleteTask } = useTasks();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm("¿Estás seguro de eliminar esta tarea?")) {
      deleteTask(taskId);
      toast({
        title: "Tarea eliminada",
        description: "La tarea se ha eliminado correctamente",
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Todas las Tareas</h1>
            <p className="text-muted-foreground mt-1">
              Vista completa de todas tus tareas
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Tarea
          </Button>
        </div>

        <TaskList tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} />

        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title={editingTask ? "Editar Tarea" : "Nueva Tarea"}
          description={
            editingTask
              ? "Actualiza la información de la tarea"
              : "Crea una nueva tarea"
          }
        >
          <TaskForm task={editingTask} onSuccess={handleModalClose} />
        </Modal>
      </div>
    </DashboardLayout>
  );
}
