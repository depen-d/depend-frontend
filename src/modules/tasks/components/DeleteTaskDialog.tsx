import {
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
import { Task } from "../tasks";

interface DeleteTaskDialogProps {
  task: Task;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteTaskDialog({
  task,
  onConfirm,
  onCancel,
}: DeleteTaskDialogProps) {
  return (
    <AlertDialog open={true} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription className="mt-1">
                Esta ação não pode ser desfeita
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <p className="text-sm text-muted-foreground mt-4">
          Tem certeza que deseja excluir a tarefa{" "}
          <strong>&quot;{task.code}&quot;</strong>?
        </p>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
