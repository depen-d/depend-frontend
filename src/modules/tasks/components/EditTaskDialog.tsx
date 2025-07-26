import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from "@/components";
import { CheckSquare } from "lucide-react";
import { Task } from "../tasks";
import { Teams } from "@/modules/teams";
import { UseCase } from "@/modules/overview";
import { getStatusBadge } from "../utils";
import { useState } from "react";

const useCaseSchema = z.object({
  case_id: z.string({ required_error: "Selecione um caso de uso" }),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(500, "Descrição muito longa"),
  team: z.enum([Teams.REQ, Teams.DESIGN, Teams.DEV, Teams.TEST], {
    required_error: "Selecione um time",
  }),
  dependencies: z.array(z.string()).optional(),
});

type TaskFormData = z.infer<typeof useCaseSchema>;

interface EditTaskDialogProps {
  task: Task;
  cases: UseCase[];
  availableTasks?: Task[];
  onSubmit: (
    useCase: Omit<Task, "task_id" | "code" | "created_at" | "updated_at">
  ) => void;
  onCancel: () => void;
}

export function EditTaskDialog({
  task,
  cases = [],
  availableTasks = [],
  onSubmit,
  onCancel,
}: EditTaskDialogProps) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(useCaseSchema),
    defaultValues: {
      team: task.team,
      case_id: String(task?.case_id || ""),
      name: task.name,
      description: task.description,
    },
  });

  const [dependencies, setDependencies] = useState<string[]>(
    task.dependencies || []
  );

  const handleRelatedTaskToggle = (taskId: string, checked: boolean) => {
    if (checked) {
      setDependencies((prevDependencies) => {
        if (!prevDependencies.includes(taskId)) {
          return [...prevDependencies, taskId];
        }
        return prevDependencies;
      });
    } else {
      setDependencies((prevDependencies) =>
        prevDependencies.filter((dep) => dep !== taskId)
      );
    }
  };

  const handleSubmit = async (data: TaskFormData) => {
    const newTask: Omit<
      Task,
      "task_id" | "code" | "created_at" | "updated_at"
    > = {
      ...data,
      case_id: parseInt(data.case_id),
      dependencies,
      status: "OPEN",
    };

    onSubmit(newTask);
    form.reset();
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Detalhes da Tarefa
          </DialogTitle>
          <DialogDescription>
            Atualize as informações da tarefa
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-6 space-y-4"
          >
            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={task.team}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o time responsável" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        value={Teams.REQ}
                        className="flex items-center gap-2"
                      >
                        <Badge variant="outline" className="font-mono">
                          {Teams.REQ}
                        </Badge>
                        Requisitos
                      </SelectItem>
                      <SelectItem
                        value={Teams.DESIGN}
                        className="flex items-center gap-2"
                      >
                        <Badge variant="outline" className="font-mono">
                          {Teams.DESIGN}
                        </Badge>
                        Design
                      </SelectItem>
                      <SelectItem
                        value={Teams.DEV}
                        className="flex items-center gap-2"
                      >
                        <Badge variant="outline" className="font-mono">
                          {Teams.DEV}
                        </Badge>
                        Desenvolvimento
                      </SelectItem>
                      <SelectItem
                        value={Teams.TEST}
                        className="flex items-center gap-2"
                      >
                        <Badge variant="outline" className="font-mono">
                          {Teams.TEST}
                        </Badge>
                        Teste
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="case_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caso de Uso *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(task?.case_id || "")}
                    disabled={!cases.length}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o caso de uso" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cases.map((useCase) => (
                        <SelectItem
                          key={useCase.case_id}
                          value={String(useCase.case_id)}
                          className="flex items-center gap-2"
                        >
                          {useCase.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-8" />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      defaultValue={task.name}
                      placeholder="Ex: Implementar login de usuário"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      defaultValue={task.description}
                      placeholder="Descreva em detalhes o que precisa ser feito..."
                      className="resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {availableTasks.length > 0 && (
              <>
                <Separator className="my-8" />

                <div className="space-y-4">
                  <div>
                    <Label>Tarefas Relacionadas (Opcional)</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Selecione tarefas que estão relacionadas ou são
                      dependências
                    </p>
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {availableTasks.map((task) => (
                      <div
                        key={task.task_id}
                        className="flex items-start space-x-3"
                      >
                        <Checkbox
                          id={`task-${task.task_id}`}
                          checked={dependencies.includes(String(task.task_id))}
                          onCheckedChange={(checked) =>
                            handleRelatedTaskToggle(
                              String(task.task_id),
                              checked as boolean
                            )
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className="font-mono text-xs"
                            >
                              {task.code}
                            </Badge>
                            {getStatusBadge(task.status)}
                          </div>
                          <Label
                            htmlFor={`task-${task.task_id}`}
                            className="cursor-pointer"
                          >
                            {task.name}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {task.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">Editar Tarefa</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
