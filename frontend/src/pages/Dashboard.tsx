import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { useProjects } from "@/contexts/ProjectContext";
import { useTasks } from "@/contexts/TaskContext";
import { FolderKanban, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const { projects } = useProjects();
  const { tasks } = useTasks();

  const activeProjects = projects.length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completada").length;
  const inProgressTasks = tasks.filter((t) => t.status === "en-progreso").length;
  const pendingTasks = tasks.filter((t) => t.status === "pendiente").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriorityTasks = tasks.filter((t) => t.priority === "alta" && t.status !== "completada");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Vista general de tus proyectos y tareas
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Proyectos Activos"
            value={activeProjects}
            icon={<FolderKanban className="h-6 w-6" />}
            description="Total de proyectos"
          />
          <StatsCard
            title="Tareas Completadas"
            value={completedTasks}
            icon={<CheckCircle2 className="h-6 w-6" />}
            description={`${completionRate}% de completitud`}
          />
          <StatsCard
            title="En Progreso"
            value={inProgressTasks}
            icon={<Clock className="h-6 w-6" />}
            description="Tareas activas"
          />
          <StatsCard
            title="Pendientes"
            value={pendingTasks}
            icon={<AlertCircle className="h-6 w-6" />}
            description="Por iniciar"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Progreso General
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Completadas</span>
                  <span className="font-medium text-card-foreground">
                    {completedTasks} / {totalTasks}
                  </span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{completedTasks}</p>
                  <p className="text-xs text-muted-foreground mt-1">Completadas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{inProgressTasks}</p>
                  <p className="text-xs text-muted-foreground mt-1">En Progreso</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-muted-foreground">{pendingTasks}</p>
                  <p className="text-xs text-muted-foreground mt-1">Pendientes</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Tareas de Alta Prioridad
            </h3>
            <div className="space-y-3">
              {highPriorityTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  ¡No hay tareas de alta prioridad pendientes!
                </p>
              ) : (
                highPriorityTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="rounded-full bg-destructive/10 p-1 mt-0.5">
                      <AlertCircle className="h-3 w-3 text-destructive" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {task.status === "en-progreso" ? "En Progreso" : "Pendiente"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
