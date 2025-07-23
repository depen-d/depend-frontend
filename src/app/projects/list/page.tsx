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
import axios from "axios";
import { useEffect, useState } from "react";
import { userId } from "@/utils";

interface Project {
  project_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export default function ProjectList() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);

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

  useEffect(() => {
    fetchProjects();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const onCreateNewProject = () => {
    router.push("/create");
  };

  const onCreateNewTask = () => {
    router.push(`/tasks/create`);
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
          {projects.length > 0 && (
            <Button
              onClick={onCreateNewTask}
              variant="outline"
              className="gap-2"
            >
              <CheckSquare className="h-4 w-4" />
              Nova Tarefa
            </Button>
          )}
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
            {projects.length} projeto(s) encontrado(s)
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
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Criado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow
                    key={project.project_id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onProjectClick(project.project_id)}
                  >
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {project.project_id}
                      </Badge>
                    </TableCell>
                    <TableCell>{project.name}</TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm text-muted-foreground truncate">
                        {project.description}
                      </p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(project.created_at)}
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
