"use client";

import { useState } from "react";
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
}

export default function CreateTask() {
  const router = useRouter();

  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    projectId: "",
    relatedTasks: [] as string[],
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    projectId: "",
  });

  // TODO: Remover mock e integrar com o backend
  const projects: Project[] = [
    { id: "PROJ", name: "Sistema de Gestão" },
    { id: "WEB", name: "Website Corporativo" },
    { id: "MOB", name: "App Mobile" },
  ];

  // TODO: Remover mock e integrar com o backend
  const existingTasks: Task[] = [
    {
      id: "TASK-001",
      name: "Configurar banco de dados",
      description: "Configurar estrutura inicial do banco de dados",
      status: "concluido",
      projectId: "PROJ",
      createdAt: "2025-01-10",
      relatedTasks: [],
    },
    {
      id: "TASK-002",
      name: "Criar API de autenticação",
      description: "Implementar sistema de login e autenticação",
      status: "em_andamento",
      projectId: "PROJ",
      createdAt: "2025-01-12",
      relatedTasks: ["TASK-001"],
    },
    {
      id: "TASK-003",
      name: "Design da homepage",
      description: "Criar layout e design da página inicial",
      status: "aberto",
      projectId: "WEB",
      createdAt: "2025-01-15",
      relatedTasks: [],
    },
  ];

  const getStatusBadge = (status: Task["status"]) => {
    const statusConfig = {
      aberto: { variant: "secondary" as const, label: "Aberto" },
      em_andamento: { variant: "default" as const, label: "Em Andamento" },
      concluido: { variant: "outline" as const, label: "Concluído" },
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
      newErrors.name = "Nome da tarefa é obrigatório";
    }
    if (!taskData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }
    if (!taskData.projectId) {
      newErrors.projectId = "Projeto é obrigatório";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleInputChange = (field: string, value: string) => {
    setTaskData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleRelatedTaskCheck = (taskId: string, checked: boolean) => {
    setTaskData((prev) => ({
      ...prev,
      relatedTasks: checked
        ? [...prev.relatedTasks, taskId]
        : prev.relatedTasks.filter((id) => id !== taskId),
    }));
  };

  const handleCancel = () => {
    setTaskData({
      name: "",
      description: "",
      projectId: "",
      relatedTasks: [],
    });
    setErrors({ name: "", description: "", projectId: "" });
    router.push("/projects/list");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const newTask = {
        ...taskData,
        id: `TASK-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
        status: "aberto" as const,
        createdAt: new Date().toISOString().split("T")[0],
      };

      // TODO: Integrar com backend para atualizar o projeto
      console.log("Tarefa criada:", newTask);
      alert("Tarefa criada com sucesso!");
      handleCancel();
    }
  };

  const availableTasks = existingTasks.filter((task) =>
    taskData.projectId ? task.projectId === taskData.projectId : true
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
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {project.id}
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
                    <Label>Tarefas Relacionadas (Opcional)</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Selecione tarefas que são dependências
                    </p>
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {availableTasks.map((task) => (
                      <div key={task.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={taskData.relatedTasks.includes(task.id)}
                          onCheckedChange={(checked) =>
                            handleRelatedTaskCheck(task.id, checked as boolean)
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className="font-mono text-xs"
                            >
                              {task.id}
                            </Badge>
                            {getStatusBadge(task.status)}
                          </div>
                          <Label
                            htmlFor={`task-${task.id}`}
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
