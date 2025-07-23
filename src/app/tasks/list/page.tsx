"use client";

import { useEffect, useState } from "react";
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
import axios from "axios";
import { userId } from "@/utils";

interface Task {
  task_id: string;
  name: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  dependencies: string[];
  project_id: string;
  created_at: string;
  updated_at: string;
}

interface Project {
  project_id: string;
  name: string;
}

export default function TaskList() {
  const router = useRouter();
  const pathname = usePathname();

  const projectId = pathname.split("/")[2];

  const [project, setProject] = useState<Project>();
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchProject = async () => {
    try {
      const response = await axios.get<Project[]>(
        `http://0.0.0.0:8000/${userId}/project`
      );
      const correctProject = response.data.find(
        (proj) => proj.project_id === projectId
      );
      setProject(correctProject);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>(
        `http://0.0.0.0:8000/${userId}/task?project=${projectId}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const updateTask = async (taskId: string, newStatus: Task["status"]) => {
    try {
      await axios.patch(`http://0.0.0.0:8000/${userId}/task/${taskId}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, []);

  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    taskId: string;
    newStatus: Task["status"];
    conflictingTasks: Task[];
  }>({
    open: false,
    taskId: "",
    newStatus: "OPEN",
    conflictingTasks: [],
  });

  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const statusColumns = [
    {
      id: "OPEN" as const,
      title: "Aberto",
      description: "Backlog",
      variant: "secondary" as const,
    },
    {
      id: "IN_PROGRESS" as const,
      title: "Em Andamento",
      description: "Tarefas sendo executadas",
      variant: "default" as const,
    },
    {
      id: "CLOSED" as const,
      title: "Concluído",
      description: "Tarefas finalizadas",
      variant: "outline" as const,
    },
  ];

  const onCreateTask = () => {
    router.push("/tasks/create");
  };

  console.log(tasks);

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  const checkRelatedTasksConflict = async (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    if (newStatus !== "CLOSED") return [];

    const task = tasks.find((t) => t.task_id === taskId);

    if (!task?.dependencies?.length) return [];

    const conflictingTasks = tasks.filter(
      (t) =>
        task.dependencies.includes(t.task_id) &&
        (t.status === "OPEN" || t.status === "IN_PROGRESS")
    );

    return conflictingTasks;
  };

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.task_id === taskId ? { ...task, status: newStatus } : task
      )
    );
    updateTask(taskId, newStatus);
  };

  const moveTask = async (taskId: string, newStatus: Task["status"]) => {
    const conflictingTasks = await checkRelatedTasksConflict(taskId, newStatus);

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

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Task["status"]) => {
    e.preventDefault();
    if (draggedTask) {
      await moveTask(draggedTask, newStatus);
      setDraggedTask(null);
    }
  };

  const handleStatusChange = async (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    await moveTask(taskId, newStatus);
  };

  const handleConfirmMove = () => {
    updateTaskStatus(alertDialog.taskId, alertDialog.newStatus);
    setAlertDialog({
      open: false,
      taskId: "",
      newStatus: "OPEN",
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
              {project?.project_id}
            </Badge>
            <h1>{project?.name}</h1>
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
              onDrop={async (e) => await handleDrop(e, column.id)}
            >
              {getTasksByStatus(column.id).map((task) => (
                <Card
                  key={task.task_id}
                  className="cursor-move hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.task_id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="font-mono text-xs">
                        {task.task_id}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(task.created_at)}
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

                    {task.dependencies?.length > 0 && (
                      <div className="mb-8">
                        <p className="text-xs text-muted-foreground mb-1">
                          Depende:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {task.dependencies?.map((dependency) => {
                            const relatedTask = tasks.find(
                              (t) => t.task_id === dependency
                            );
                            return relatedTask ? (
                              <div
                                key={dependency}
                                className="flex items-center gap-1"
                              >
                                <Badge
                                  variant="outline"
                                  className="text-xs font-mono"
                                >
                                  {dependency}
                                </Badge>
                                {getStatusBadge(relatedTask.status)}
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-1">
                      {column.id !== "OPEN" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 cursor-pointer"
                          onClick={async () =>
                            await handleStatusChange(task.task_id, "OPEN")
                          }
                        >
                          ← Aberto
                        </Button>
                      )}
                      {column.id !== "IN_PROGRESS" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 cursor-pointer"
                          onClick={async () =>
                            await handleStatusChange(
                              task.task_id,
                              "IN_PROGRESS"
                            )
                          }
                        >
                          {column.id === "OPEN"
                            ? "Iniciar →"
                            : "← Em Andamento"}
                        </Button>
                      )}
                      {column.id !== "CLOSED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 cursor-pointer"
                          onClick={async () =>
                            await handleStatusChange(task.task_id, "CLOSED")
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
                <Alert key={task.task_id}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs">{task.task_id}</span>{" "}
                      - {task.name}
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
