import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components";
import { Edit, FolderOpen, Trash2 } from "lucide-react";
import { formatDate, getStatusBadge } from "../utils";
import { Task } from "../tasks";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "@/config";
import { UseCase } from "@/modules/overview";

interface TaskCardProps {
  task: Task;
  cases?: UseCase[];
  onDragStart: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: Task["status"]) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskCard({
  task,
  cases,
  onDragStart,
  onStatusChange,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [dependencies, setDependencies] = useState<Task[]>([]);

  const fetchDependencies = () => {
    axios
      .get(`${baseURL}/task/${task.code}/depends`)
      .then((response) => {
        console.log("[SUCCESS] GET - Tarefa/Dependências:", response.data);
        setDependencies(response.data);
      })
      .catch((error) => {
        console.error("[ERROR] GET - Tarefa/Dependências:", error);
      });
  };

  useEffect(() => {
    fetchDependencies();
  }, []);

  const getCaseName = () => {
    const caseAttached = cases?.find((c) => c.case_id === task.case_id);
    return caseAttached?.name;
  };

  return (
    <Card
      className="cursor-move hover:shadow-md transition-shadow group bg-slate-50"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(task);
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs shadow-xs">
              {task.code}
            </Badge>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="h-6 w-6 p-0"
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="h-6 w-6 p-0"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <span className="text-xs text-muted-foreground">
            {formatDate(task.created_at)}
          </span>
        </div>
        <CardTitle className="text-sm leading-tight">{task.name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-gray-700 mb-3 line-clamp-2">
          {task.description}
        </p>

        {cases?.length && (
          <div className="mb-3">
            <div className="flex items-center gap-1 text-xs text-gray-700">
              <FolderOpen className="w-3 h-3" />
              <span>Caso de uso: {getCaseName()}</span>
            </div>
          </div>
        )}

        {dependencies.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1">Relacionadas:</p>
            <div className="flex flex-wrap gap-1">
              {dependencies.map((related) => {
                return (
                  <div key={related.code} className="flex items-center gap-1">
                    <Badge
                      variant="outline"
                      className="text-xs font-mono shadow-xs"
                    >
                      {related.code}
                    </Badge>
                    {getStatusBadge(related.status)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-1 flex-wrap mt-8">
          {task.status !== "OPEN" && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 bg-gray-200 hover:bg-gray-300 shadow-sm"
              onClick={() => onStatusChange(task, "OPEN")}
            >
              ← Aberto
            </Button>
          )}
          {task.status !== "IN_PROGRESS" && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 bg-blue-200 hover:bg-blue-300 shadow-sm"
              onClick={() => onStatusChange(task, "IN_PROGRESS")}
            >
              {task.status === "OPEN" ? "Iniciar →" : "← Em Andamento"}
            </Button>
          )}
          {task.status !== "CLOSED" && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 bg-green-200 hover:bg-green-300 shadow-sm"
              onClick={() => onStatusChange(task, "CLOSED")}
            >
              Concluir →
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
