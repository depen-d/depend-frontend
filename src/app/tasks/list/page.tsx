"use client";

import { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components";
import { CheckSquare, Plus, AlertTriangle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface Task {
  id: string;
  name: string;
  description: string;
  status: "aberto" | "em_andamento" | "concluido";
  projectId: string;
  createdAt: string;
  relatedTasks: string[];
}

interface Project {
  id: string;
  name: string;
  description: string;
}

export default function TaskList() {
  const router = useRouter();
  const pathname = usePathname();

  const projectId = pathname.split("/")[2];

  const project: Project = {
    id: projectId,
    name:
      projectId === "PROJ"
        ? "Sistema de Gestão"
        : projectId === "WEB"
        ? "Website Corporativo"
        : "App Mobile",
    description: "Descrição do projeto",
  };

  // TODO: Integrar com o backend
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "TASK-001",
      name: "Configurar banco de dados",
      description: "Configurar estrutura inicial do banco de dados",
      status: "concluido",
      projectId: projectId,
      createdAt: "2025-01-10",
      relatedTasks: [],
    },
    {
      id: "TASK-002",
      name: "Criar API de autenticação",
      description: "Implementar sistema de login e autenticação",
      status: "em_andamento",
      projectId: projectId,
      createdAt: "2025-01-12",
      relatedTasks: ["TASK-001"],
    },
    {
      id: "TASK-003",
      name: "Design da homepage",
      description: "Criar layout e design da página inicial",
      status: "aberto",
      projectId: projectId,
      createdAt: "2025-01-15",
      relatedTasks: [],
    },
    {
      id: "TASK-004",
      name: "Implementar tela de login",
      description: "Desenvolver interface de usuário para login",
      status: "aberto",
      projectId: projectId,
      createdAt: "2025-01-16",
      relatedTasks: ["TASK-002"],
    },
    {
      id: "TASK-005",
      name: "Testes de integração",
      description: "Executar testes completos do sistema",
      status: "aberto",
      projectId: projectId,
      createdAt: "2025-01-17",
      relatedTasks: ["TASK-002", "TASK-004"],
    },
  ]);

  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    taskId: string;
    newStatus: Task["status"];
    conflictingTasks: Task[];
  }>({
    open: false,
    taskId: "",
    newStatus: "aberto",
    conflictingTasks: [],
  });

  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const statusColumns = [
    {
      id: "aberto" as const,
      title: "Aberto",
      description: "Backlog",
      variant: "secondary" as const,
    },
    {
      id: "em_andamento" as const,
      title: "Em Andamento",
      description: "Tarefas sendo executadas",
      variant: "default" as const,
    },
    {
      id: "concluido" as const,
      title: "Concluído",
      description: "Tarefas finalizadas",
      variant: "outline" as const,
    },
  ];

  const onCreateTask = () => {
    router.push("/tasks/create");
  };

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  const checkRelatedTasksConflict = (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    if (newStatus !== "concluido") return [];

    const task = tasks.find((t) => t.id === taskId);
    if (!task?.relatedTasks.length) return [];

    const conflictingTasks = tasks.filter(
      (t) =>
        task.relatedTasks.includes(t.id) &&
        (t.status === "aberto" || t.status === "em_andamento")
    );

    return conflictingTasks;
  };

  const moveTask = (taskId: string, newStatus: Task["status"]) => {
    const conflictingTasks = checkRelatedTasksConflict(taskId, newStatus);

    if (conflictingTasks.length > 0) {
      setAlertDialog({
        open: true,
        taskId,
        newStatus,
        conflictingTasks,
      });
      return;
    }

    updateTaskStatus(taskId, newStatus);
  };

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task["status"]) => {
    e.preventDefault();
    if (draggedTask) {
      moveTask(draggedTask, newStatus);
      setDraggedTask(null);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task["status"]) => {
    moveTask(taskId, newStatus);
  };

  const handleConfirmMove = () => {
    updateTaskStatus(alertDialog.taskId, alertDialog.newStatus);
    setAlertDialog({
      open: false,
      taskId: "",
      newStatus: "aberto",
      conflictingTasks: [],
    });
  };

  const getStatusBadge = (status: Task["status"]) => {
    const config = statusColumns.find((col) => col.id === status);
    return (
      <Badge variant={config?.variant} className="text-xs">
        {config?.title}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="outline" className="font-mono">
              {project.id}
            </Badge>
            <h1>{project.name}</h1>
          </div>
          <p className="text-muted-foreground">
            Visualize e gerencie o progresso das tarefas
          </p>
        </div>
        {onCreateTask && (
          <Button onClick={onCreateTask} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Tarefa
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {statusColumns.map((column) => (
          <div key={column.id} className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    {column.title}
                  </div>
                  <Badge variant={column.variant} className="text-xs">
                    {getTasksByStatus(column.id).length}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  {column.description}
                </CardDescription>
              </CardHeader>
            </Card>

            <div
              className="min-h-[400px] space-y-3"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {getTasksByStatus(column.id).map((task) => (
                <Card
                  key={task.id}
                  className="cursor-move hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="font-mono text-xs">
                        {task.id}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(task.createdAt)}
                      </span>
                    </div>
                    <CardTitle className="text-sm leading-tight">
                      {task.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-8 line-clamp-2">
                      {task.description}
                    </p>

                    {task.relatedTasks.length > 0 && (
                      <div className="mb-8">
                        <p className="text-xs text-muted-foreground mb-1">
                          Depende:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {task.relatedTasks.map((relatedId) => {
                            const relatedTask = tasks.find(
                              (t) => t.id === relatedId
                            );
                            return relatedTask ? (
                              <div
                                key={relatedId}
                                className="flex items-center gap-1"
                              >
                                <Badge
                                  variant="outline"
                                  className="text-xs font-mono"
                                >
                                  {relatedId}
                                </Badge>
                                {getStatusBadge(relatedTask.status)}
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-1">
                      {column.id !== "aberto" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 cursor-pointer"
                          onClick={() => handleStatusChange(task.id, "aberto")}
                        >
                          ← Aberto
                        </Button>
                      )}
                      {column.id !== "em_andamento" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 cursor-pointer"
                          onClick={() =>
                            handleStatusChange(task.id, "em_andamento")
                          }
                        >
                          {column.id === "aberto"
                            ? "Iniciar →"
                            : "← Em Andamento"}
                        </Button>
                      )}
                      {column.id !== "concluido" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 cursor-pointer"
                          onClick={() =>
                            handleStatusChange(task.id, "concluido")
                          }
                        >
                          Concluir →
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {getTasksByStatus(column.id).length === 0 && (
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center text-muted-foreground">
                  <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    Nenhuma tarefa {column.title.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <AlertDialog
        open={alertDialog.open}
        onOpenChange={(open) => setAlertDialog((prev) => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Tarefas Relacionadas Pendentes
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta tarefa possui dependências que ainda não foram concluídas.
              Concluir esta tarefa pode afetar o fluxo do projeto.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4">
            <h4 className="mb-2">Dependências:</h4>
            <div className="space-y-2">
              {alertDialog.conflictingTasks.map((task) => (
                <Alert key={task.id}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs">{task.id}</span> -{" "}
                      {task.name}
                    </div>
                    {getStatusBadge(task.status)}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmMove}>
              Concluir Mesmo Assim
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
