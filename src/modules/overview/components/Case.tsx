import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
} from "@/components";
import {
  AlertCircle,
  CheckCircle,
  CheckSquare,
  Clock,
  Edit,
  FolderTree,
  Trash2,
} from "lucide-react";
import { UseCase } from "../overview";
import { useEffect, useMemo, useState } from "react";
import { Task } from "@/modules/tasks/tasks";
import axios from "axios";
import { baseURL } from "@/config";
import { DeleteTaskDialog } from "@/modules/tasks/components/DeleteTaskDialog";
import { Teams } from "@/modules/teams";
import { getTeamTextColor } from "@/modules/teams/utils";

interface CaseProps {
  useCase: UseCase;
  onEdit: () => void;
  onDelete: () => void;
}

export default function Case({ useCase, onEdit, onDelete }: CaseProps) {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isDeletingTask, setIsDeletingTask] = useState<Task | undefined>(
    undefined
  );

  const calculateProgress = (tasks: Task[]): number => {
    if (tasks.length === 0) return 0;

    const completedTasks = tasks.filter(
      (task) => task.status === "CLOSED"
    ).length;

    return Math.round((completedTasks / tasks.length) * 100);
  };

  const teamsProgress = useMemo(() => {
    return {
      [Teams.REQ]: calculateProgress(
        filteredTasks.filter((task) => task.team === Teams.REQ)
      ),
      [Teams.DES]: calculateProgress(
        filteredTasks.filter((task) => task.team === Teams.DES)
      ),
      [Teams.DEV]: calculateProgress(
        filteredTasks.filter((task) => task.team === Teams.DEV)
      ),
      [Teams.TES]: calculateProgress(
        filteredTasks.filter((task) => task.team === Teams.TES)
      ),
    };
  }, [filteredTasks]);

  const statusCounts = useMemo(() => {
    return {
      open: filteredTasks.filter((t) => t.status === "OPEN").length,
      inProgress: filteredTasks.filter((t) => t.status === "IN_PROGRESS")
        .length,
      closed: filteredTasks.filter((t) => t.status === "CLOSED").length,
    };
  }, [filteredTasks]);

  const fetchTasks = () => {
    axios
      .get(`${baseURL}/task?case_id=${useCase.case_id}`)
      .then((response) => {
        console.log("[SUCCESS] GET - Caso de Uso/Tarefas:", response.data);
        setFilteredTasks(response.data);
      })
      .catch((error) => {
        console.error("[ERROR] GET - Caso de Uso/Tarefas:", error);
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDeleteTask = () => {
    deleteTask(isDeletingTask);
  };

  return (
    <Card
      key={useCase.case_id}
      className="hover:shadow-md transition-shadow max-h-min"
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <CardTitle className="flex items-center">{useCase.name}</CardTitle>
            <CardDescription>{useCase.description}</CardDescription>
          </div>
          <div className="flex gap-1 ml-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {filteredTasks.length > 0 ? (
          <>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>
                  {(teamsProgress[Teams.REQ] +
                    teamsProgress[Teams.DES] +
                    teamsProgress[Teams.DEV] +
                    teamsProgress[Teams.TES]) /
                    4}
                  %
                </span>
              </div>
              <div className="flex gap-2">
                <Progress
                  value={teamsProgress[Teams.REQ]}
                  className={"h-2"}
                  progressColor="bg-red-300"
                />
                <Progress
                  value={teamsProgress[Teams.DES]}
                  className={"h-2"}
                  progressColor="bg-lime-300"
                />
                <Progress
                  value={teamsProgress[Teams.DEV]}
                  className={"h-2"}
                  progressColor="bg-cyan-300"
                />
                <Progress
                  value={teamsProgress[Teams.TES]}
                  className={"h-2"}
                  progressColor="bg-violet-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm mb-8">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-600" />
                <span>{statusCounts.open} Abertas</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{statusCounts.inProgress} Em Progresso</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>{statusCounts.closed} Concluídas</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm">Tarefas:</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {filteredTasks.map((task) => (
                  <div
                    key={task.code}
                    className="flex items-center gap-2 text-sm p-2 rounded bg-muted/50 group"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.status === "CLOSED"
                          ? "bg-green-500"
                          : task.status === "IN_PROGRESS"
                          ? "bg-blue-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{task.name}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <FolderTree className={`h-5 w-5 `} />
                        <span className={getTeamTextColor(task.team)}>
                          {task.team}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsDeletingTask(task)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="border-2 border-dashed border-muted rounded-lg p-8 mt-4 text-center text-muted-foreground">
            <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma tarefa</p>
          </div>
        )}

        <div className="text-xs text-muted-foreground pt-2 border-t">
          Criado em {new Date(useCase.created_at).toLocaleDateString()}
        </div>
      </CardContent>

      {isDeletingTask && (
        <DeleteTaskDialog
          task={isDeletingTask}
          onConfirm={handleDeleteTask}
          onCancel={() => setIsDeletingTask(undefined)}
        />
      )}
    </Card>
  );
}
