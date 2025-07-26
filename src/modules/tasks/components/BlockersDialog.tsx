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
} from "@/components";
import { AlertTriangle } from "lucide-react";
import { getStatusBadge } from "../utils";
import { Task } from "../tasks";

interface BlockersDialogProps {
  blockers?: {
    open: boolean;
    task?: Task;
    newStatus?: "OPEN" | "IN_PROGRESS" | "CLOSED";
    conflictingTasks?: Task[];
  };
  onConfirm: () => void;
  onCancel: () => void;
}

export function BlockersDialog({
  blockers,
  onConfirm,
  onCancel,
}: BlockersDialogProps) {
  return (
    <AlertDialog open={blockers?.open}>
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
            {blockers?.conflictingTasks?.map((blocker) => (
              <Alert key={blocker.task_id}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs">{blocker.task_id}</span>{" "}
                    - {blocker.name}
                  </div>
                  {getStatusBadge(blocker.status)}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Concluir Mesmo Assim
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
