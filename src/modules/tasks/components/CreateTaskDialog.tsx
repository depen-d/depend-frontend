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
import { MutableTask, Task } from "../tasks";
import { Teams } from "@/modules/teams";
import { UseCase } from "@/modules/overview";
import { getStatusBadge } from "../utils";
import { useState } from "react";

const taskSchema = z.object({
  case_id: z.string({ required_error: "Selecione um caso de uso" }),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(500, "Descrição muito longa"),
  team: z.enum([Teams.REQ, Teams.DES, Teams.DEV, Teams.TES], {
    required_error: "Selecione um time",
  }),
  dependencies: z.array(z.string()).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface CreateTaskDialogProps {
  team: Teams;
  cases: UseCase[];
  tasks?: Task[];
  onSubmit: (task: MutableTask) => void;
  onCancel: () => void;
}

export function CreateTaskDialog({
  team,
  cases = [],
  tasks = [],
  onSubmit,
  onCancel,
}: CreateTaskDialogProps) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      description: "",
      team,
    },
  });

  const [dependencies, setDependencies] = useState<Task[]>([]);

  const handleRelatedTaskToggle = (task: Task, checked: boolean) => {
    if (checked) {
      setDependencies((prevState) => {
        if (!prevState.some((dep) => dep.code === task.code)) {
          return [...prevState, task];
        }
        return prevState;
      });
    } else {
      setDependencies((prevDependencies) =>
        prevDependencies.filter((dep) => dep.code !== task.code)
      );
    }
  };

  const handleSubmit = async (data: TaskFormData) => {
    const parsedDependenciesArray = dependencies?.map((dep) => dep.code) ?? [];

    const newTask: MutableTask = {
      ...data,
      case_id: parseInt(data.case_id),
      dependencies: parsedDependenciesArray,
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
            Defina as informações básicas da nova tarefa
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
                  <Select onValueChange={field.onChange} defaultValue={team}>
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
                        value={Teams.DES}
                        className="flex items-center gap-2"
                      >
                        <Badge variant="outline" className="font-mono">
                          {Teams.DES}
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
                        value={Teams.TES}
                        className="flex items-center gap-2"
                      >
                        <Badge variant="outline" className="font-mono">
                          {Teams.TES}
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
                    defaultValue={team}
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
                      placeholder="Ex: Implementar login de usuário"
                      {...field}
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
                      placeholder="Descreva em detalhes o que precisa ser feito..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {tasks.length > 0 && (
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
                    {tasks.map((task) => (
                      <div
                        key={task.task_id}
                        className="flex items-start space-x-3"
                      >
                        <Checkbox
                          id={`task-${task.task_id}`}
                          checked={dependencies?.some(
                            (dep) => dep.code === task.code
                          )}
                          onCheckedChange={(checked) =>
                            handleRelatedTaskToggle(task, checked as boolean)
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
              <Button type="submit">Criar Tarefa</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
