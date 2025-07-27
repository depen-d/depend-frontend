"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components";
import { CheckSquare, Plus, ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { CreateTaskDialog } from "./components/CreateTaskDialog";
import { baseURL } from "@/config";
import { UseCase } from "../overview";
import { statusColumns } from "./utils";
import { Teams } from "../teams";
import { TaskCard } from "./components/TaskCard";
import { EditTaskDialog } from "./components/EditTaskDialog";
import { DeleteTaskDialog } from "./components/DeleteTaskDialog";
import { BlockersDialog } from "./components/BlockersDialog";
import { getTeamBadgeColor } from "../teams/utils";

export interface Task {
  task_id: number;
  team: Teams;
  case_id?: number;
  name: string;
  description: string;
  dependencies?: Task[];
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  code: string;
  created_at: string;
  updated_at?: string;
}

export interface MutableTask
  extends Omit<Task, "code" | "created_at" | "dependencies" | "task_id"> {
  dependencies?: string[];
}

const TEAMS: Record<Teams, string> = {
  REQ: "Elicitação de Requisitos",
  DES: "Design e UX",
  DEV: "Desenvolvimento",
  TES: "Testes e QA",
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [useCases, setUseCases] = useState<UseCase[]>([]);

  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState<Task | undefined>(
    undefined
  );
  const [isDeletingTask, setIsDeletingTask] = useState<Task | undefined>(
    undefined
  );

  const [draggedTask, setDraggedTask] = useState<Task | undefined>(undefined);
  const [blockers, setBlockers] = useState<{
    open: boolean;
    task?: Task;
    newStatus?: "OPEN" | "IN_PROGRESS" | "CLOSED";
    conflictingTasks?: Task[];
  }>({
    open: false,
    task: undefined,
    newStatus: "OPEN",
    conflictingTasks: [],
  });

  const router = useRouter();

  const pathname = usePathname();
  const teamId = pathname.split("/")[2];

  const fetchTasks = () => {
    axios
      .get(`${baseURL}/task-with-deps?team=${teamId}`)
      .then((response) => {
        console.log("[SUCCESS] GET - Tarefas:", response.data);
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("[ERROR] GET - Tarefas:", error);
      });
  };

  const createTask = (newTask: unknown) => {
    axios
      .post(`${baseURL}/task`, newTask)
      .then((response) => {
        console.log("[SUCCESS] POST - Tarefas:", response.data);
        setIsCreatingTask(false);
        fetchTasks();
      })
      .catch((error) => {
        console.error("[ERROR] POST - Tarefas:", error);
      });
  };

  const editTask = (code: string, task: Partial<MutableTask>) => {
    axios
      .patch(`${baseURL}/task/${code}`, task)
      .then((response) => {
        console.log("[SUCCESS] PATCH - Tarefas:", response.data);
        setIsEditingTask(undefined);
        fetchTasks();
      })
      .catch((error) => {
        console.error("[ERROR] PATCH - Tarefas:", error);
      });
  };

  const deleteTask = (task?: Task) => {
    if (!task) return;

    axios
      .delete(`${baseURL}/task/${task.code}`)
      .then(() => {
        console.log(`[SUCCESS] DELETE - Tarefas: ${task.code}`);
        setIsDeletingTask(undefined);
        fetchTasks();
      })
      .catch((error) => {
        console.error("[ERROR] DELETE - Tarefas:", error);
      });
  };

  const fetchUseCases = () => {
    axios
      .get(`${baseURL}/case`)
      .then((response) => {
        console.log("[SUCCESS] GET - Casos de Uso:", response.data);
        setUseCases(response.data);
      })
      .catch((error) => {
        console.error("[ERROR] GET - Casos de Uso:", error);
      });
  };

  useEffect(() => {
    fetchTasks();
    fetchUseCases();
  }, []);

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  const checkRelatedTasksConflict = async (
    task: Task,
    newStatus: Task["status"]
  ) => {
    if (newStatus !== "CLOSED") return [];

    if (!task?.dependencies?.length) return [];

    const conflictingTasks: Task[] = tasks.filter((t) =>
      task.dependencies?.some(
        (dep) => dep.code === t.code && t.status !== "CLOSED"
      )
    );

    return conflictingTasks;
  };

  const updateTaskStatus = (task: Task, newStatus: Task["status"]) => {
    editTask(task.code, { status: newStatus });
  };

  const onDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const moveTask = async (task: Task, newStatus: Task["status"]) => {
    const conflictingTasks = await checkRelatedTasksConflict(task, newStatus);

    if (conflictingTasks.length > 0) {
      setBlockers({
        open: true,
        task,
        newStatus,
        conflictingTasks,
      });
      return;
    }
    updateTaskStatus(task, newStatus);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Task["status"]) => {
    e.preventDefault();
    if (draggedTask) {
      await moveTask(draggedTask, newStatus);
      setDraggedTask(undefined);
    }
  };

  const handleStatusChange = async (task: Task, newStatus: Task["status"]) => {
    await moveTask(task, newStatus);
  };

  const handleConfirmMove = () => {
    if (!blockers.task) return;
    if (!blockers.newStatus) return;

    updateTaskStatus(blockers.task, blockers.newStatus);
    setBlockers({
      open: false,
      task: undefined,
      newStatus: "OPEN",
      conflictingTasks: [],
    });
  };

  const handleCancelMove = () => {
    setBlockers({
      open: false,
      task: undefined,
      newStatus: "OPEN",
      conflictingTasks: [],
    });
  };

  const handleEditTask = (code: string, task: MutableTask) => {
    editTask(code, task);
  };

  const handleDeleteTask = () => {
    deleteTask(isDeletingTask);
  };

  return (
    <div className="mx-auto p-6">
      <Button
        variant="outline"
        onClick={() => router.push("/")}
        className="mb-6 gap-2 h-auto shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para o Início
      </Button>

      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge
              variant="outline"
              className={`font-mono ${getTeamBadgeColor(teamId as Teams)}`}
            >
              {teamId}
            </Badge>
            <h1>{TEAMS[teamId as Teams]}</h1>
          </div>
          <p className="text-muted-foreground">
            Visualize e gerencie o progresso das tarefas
          </p>
        </div>
        <Button onClick={() => setIsCreatingTask(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {statusColumns.map((column) => (
          <div key={column.id} className="space-y-4">
            <Card>
              <CardHeader className="p-6">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">{column.title}</div>
                  <Badge className="text-xs shadow-sm">
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
                <TaskCard
                  key={task.code}
                  task={task}
                  cases={useCases}
                  onDragStart={onDragStart}
                  onStatusChange={handleStatusChange}
                  onEdit={() => setIsEditingTask(task)}
                  onDelete={() => setIsDeletingTask(task)}
                />
              ))}

              {getTasksByStatus(column.id).length === 0 && (
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center text-muted-foreground">
                  <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma tarefa</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <BlockersDialog
        blockers={blockers}
        onConfirm={handleConfirmMove}
        onCancel={handleCancelMove}
      />

      {isCreatingTask && (
        <CreateTaskDialog
          team={teamId as Teams}
          cases={useCases}
          tasks={tasks}
          onSubmit={createTask}
          onCancel={() => setIsCreatingTask(false)}
        />
      )}
      {isEditingTask && (
        <EditTaskDialog
          task={isEditingTask}
          cases={useCases}
          availableTasks={tasks}
          onSubmit={handleEditTask}
          onCancel={() => setIsEditingTask(undefined)}
        />
      )}
      {isDeletingTask && (
        <DeleteTaskDialog
          task={isDeletingTask}
          onConfirm={handleDeleteTask}
          onCancel={() => setIsDeletingTask(undefined)}
        />
      )}
    </div>
  );
}
