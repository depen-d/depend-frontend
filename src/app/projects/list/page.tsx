"use client";

import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components";
import { Plus, FolderOpen, CheckSquare } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  tasks: string[];
}

export default function ProjectList() {
  // TODO: Remover mock e integrar com o backend
  const projects: Project[] = [
    {
      id: "PROJ",
      name: "Sistema de Gestão",
      description: "Sistema para gerenciamento de recursos internos da empresa",
      createdAt: "2025-01-15",
      tasks: ["Tarefa 1", "Tarefa 2", "Tarefa 3"],
    },
    {
      id: "WEB",
      name: "Website Corporativo",
      description: "Desenvolvimento do novo website institucional",
      createdAt: "2025-01-10",
      tasks: ["Tarefa 1", "Tarefa 2"],
    },
    {
      id: "MOB",
      name: "App Mobile",
      description: "Aplicativo móvel para clientes",
      createdAt: "2024-12-20",
      tasks: ["Tarefa 3"],
    },
  ];

  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const onCreateNewProject = () => {
    router.push("/projects/create");
  };

  const onCreateNewTask = () => {
    router.push("/tasks/create");
  };

  const onProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}/tasks`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="mb-2">Projetos</h1>
          <p className="text-muted-foreground">
            Você pode criar novos projetos, visualizar detalhes e acompanhar o
            progresso das tarefas.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onCreateNewTask} variant="outline" className="gap-2">
            <CheckSquare className="h-4 w-4" />
            Nova Tarefa
          </Button>
          <Button onClick={onCreateNewProject} className="gap-2">
            <Plus className="h-4 w-4" />
            Criar Novo Projeto
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            {projects.length} {projects.length === 1 ? "projeto" : "projetos"}{" "}
            encontrado(s)
          </CardTitle>
          <CardDescription>
            Clique em um projeto para visualizar as tarefas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="mb-2">Nenhum projeto encontrado</h3>
              <p className="text-muted-foreground mb-6">
                Comece criando seu primeiro projeto
              </p>
              <Button onClick={onCreateNewProject}>
                Criar Primeiro Projeto
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tarefas</TableHead>
                  <TableHead>Criado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow
                    key={project.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onProjectClick(project.id)}
                  >
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {project.id}
                      </Badge>
                    </TableCell>
                    <TableCell>{project.name}</TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm text-muted-foreground truncate">
                        {project.description}
                      </p>
                    </TableCell>
                    <TableCell>{project.tasks.length}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(project.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
