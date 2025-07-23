"use client";

import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from "../../../components";
import { CheckSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { userId } from "@/utils";

interface Task {
  task_id: string;
  name: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED";
  project_id: string;
  dependencies: string[];
  created_at: string;
  updated_at: string;
}

interface Project {
  project_id: string;
  name: string;
}

export default function CreateTask() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [existingTasks, setExistingTasks] = useState<Task[]>([]);
  const [dependencies, setDependencies] = useState<string[]>([]);

  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    projectId: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    projectId: "",
  });

  const fetchProjects = async () => {
    try {
      const response = await axios.get<Project[]>(
        `http://0.0.0.0:8000/${userId}/project`
      );
      setProjects(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchExistingTasks = async (project_id: string) => {
    try {
      const response = await axios.get<Task[]>(
        `http://0.0.0.0:8000/${userId}/task?project=${project_id}`
      );
      setExistingTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createTask = async () => {
    try {
      await axios.post<Task>(`http://0.0.0.0:8000/${userId}/task`, {
        name: taskData.name,
        description: taskData.description,
        project_id: taskData.projectId,
        status: "OPEN",
        dependencies,
      });

      alert("Tarefa criada com sucesso!");
      handleCancel();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar tarefa. Tente novamente.");
    }
  };

  useEffect(() => {
    const { projectId } = taskData;

    fetchProjects();

    if (projectId) {
      fetchExistingTasks(projectId);
    }
  }, [taskData]);

  const getStatusBadge = (status: Task["status"]) => {
    const statusConfig = {
      OPEN: { variant: "secondary" as const, label: "Aberto" },
      IN_PROGRESS: { variant: "default" as const, label: "Em Andamento" },
      CLOSED: { variant: "outline" as const, label: "Concluído" },
    };

    const config = statusConfig[status];
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      description: "",
      projectId: "",
    };

    if (!taskData.name.trim()) {
      newErrors.name = "Campo obrigatório";
    }
    if (!taskData.description.trim()) {
      newErrors.description = "Campo obrigatório";
    }
    if (!taskData.projectId) {
      newErrors.projectId = "Campo obrigatório";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleInputChange = (field: string, value: string) => {
    setTaskData((prev) => ({ ...prev, [field]: value }));
    console.log({ field, value });
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleRelatedTaskCheck = (taskId: string, checked: boolean) => {
    setDependencies((prev) => {
      if (checked) {
        return [...prev, taskId];
      }
      return prev;
    });
  };

  const handleCancel = () => {
    setTaskData({
      name: "",
      description: "",
      projectId: "",
    });
    setErrors({ name: "", description: "", projectId: "" });
    router.push("/");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createTask();
    }
  };

  const availableTasks = existingTasks.filter((task) =>
    taskData.projectId ? task.project_id === taskData.projectId : true
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="mb-2">Criar nova tarefa</h1>
        <p className="text-muted-foreground">
          As tarefas são atribuídas ao projeto selecionado
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Detalhes da Tarefa
            <Badge variant="secondary" className="text-xs">
              Obrigatório
            </Badge>
          </CardTitle>
          <CardDescription>Defina informações básicas</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="task-project">Projeto *</Label>
              <Select
                value={taskData.projectId}
                onValueChange={(value) => handleInputChange("projectId", value)}
              >
                <SelectTrigger
                  className={errors.projectId ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Selecione um projeto" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem
                      key={project.project_id}
                      value={project.project_id}
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {project.project_id}
                        </Badge>
                        {project.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && (
                <p className="text-sm text-destructive">{errors.projectId}</p>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="task-name">Nome *</Label>
              <Input
                id="task-name"
                placeholder="ex: Implementar login de usuário"
                value={taskData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-description">Descrição *</Label>
              <Textarea
                id="task-description"
                placeholder="Descreva os critérios de aceitação e requisitos técnicos..."
                value={taskData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={`min-h-[120px] ${
                  errors.description ? "border-destructive" : ""
                }`}
                maxLength={500}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
              <div className="flex justify-end">
                <p className="text-xs text-muted-foreground">
                  {taskData.description.length}/500
                </p>
              </div>
            </div>

            {availableTasks.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div>
                    <Label>Dependências (Opcional)</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Selecione tarefas que são previamente necessárias
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
                          onCheckedChange={(checked) =>
                            handleRelatedTaskCheck(
                              task.task_id,
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
                              {task.task_id}
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
          </form>
        </CardContent>

        <CardFooter className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="min-w-[100px]"
          >
            Criar Tarefa
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
