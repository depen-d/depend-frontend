"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components";
import { Plus } from "lucide-react";
import { EditCaseDialog } from "./components/EditCaseDialog";
import { CreateCaseDialog } from "./components/CreateCaseDialog";
import { DeleteCaseDialog } from "./components/DeleteCaseDialog";
import axios from "axios";
import { baseURL } from "@/config";
import EmptyPlaceholder from "./components/EmptyPlaceholder";
import Case from "./components/Case";
import { Task } from "../tasks/tasks";
// import { EditTask } from "./EditTask";

export interface UseCase {
  case_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export function Overview() {
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const taskStatusCounts = useMemo(() => {
    return {
      open: tasks.filter((t) => t.status === "OPEN").length,
      inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
      closed: tasks.filter((t) => t.status === "CLOSED").length,
      total: tasks.length,
    };
  }, [tasks]);

  const [isCreatingCase, setIsCreatingCase] = useState(false);
  const [isEditingCase, setIsEditingCase] = useState<UseCase | null>(null);
  const [isDeletingCase, setIsDeletingCase] = useState<UseCase | null>(null);

  const fetchUseCases = () => {
    axios
      .get(`${baseURL}/case`)
      .then((response) => {
        console.log("[SUCCESS] GET - Casos de Uso:", response.data);
        setUseCases(response.data);
      })
      .catch((error) => {
        console.error("[ERROR] GET - Casos de Uso:", error);
      });
  };

  const createUseCase = (newUseCase: Pick<UseCase, "name" | "description">) => {
    axios
      .post(`${baseURL}/case`, newUseCase)
      .then((response) => {
        console.log("[SUCCESS] POST - Caso de Uso:", response.data);
        setIsCreatingCase(false);
        fetchUseCases();
      })
      .catch((error) => {
        console.error("[ERROR] POST - Caso de Uso:", error);
      });
  };

  const editUseCase = (
    updatedUseCase: Pick<UseCase, "case_id" | "name" | "description">
  ) => {
    axios
      .patch(`${baseURL}/case/${updatedUseCase.case_id}`, updatedUseCase)
      .then((response) => {
        console.log("[SUCCESS] PATCH - Caso de Uso:", response.data);
        setIsEditingCase(null);
        fetchUseCases();
      })
      .catch((error) => {
        console.error("[ERROR] PATCH - Caso de Uso:", error);
      });
  };

  const deleteUseCase = (useCase: UseCase) => {
    axios
      .delete(`${baseURL}/case/${useCase.case_id}`)
      .then(() => {
        console.log(`[SUCCESS] DELETE - Caso de Uso: ${useCase.name}`);
        setIsDeletingCase(null);
        fetchUseCases();
      })
      .catch((error) => {
        console.error("[ERROR] DELETE - Caso de Uso:", error);
      });
  };

  const fetchTasks = () => {
    axios
      .get(`${baseURL}/task`)
      .then((response) => {
        console.log("[SUCCESS] GET - Dashboard/Tarefas:", response.data);
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("[ERROR] GET - Dashboard/Tarefas:", error);
      });
  };

  useEffect(() => {
    fetchUseCases();
    fetchTasks();
  }, []);

  const handleEditUseCase = (
    updatedUseCase: Pick<UseCase, "case_id" | "name" | "description">
  ) => {
    editUseCase(updatedUseCase);
  };

  const handleDeleteUseCase = (useCase: UseCase) => {
    deleteUseCase(useCase);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center my-8">
        <div>
          <h2>Visão Geral dos Casos de Uso</h2>
          <p className="text-muted-foreground">
            Acompanhe o progresso das suas entregas
          </p>
        </div>
        <Button onClick={() => setIsCreatingCase(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Caso de Uso
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-12">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total de Casos de Uso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{useCases.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total de Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{taskStatusCounts.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Em Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-blue-600">
              {taskStatusCounts.inProgress}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tarefas Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">
              {taskStatusCounts.closed}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {useCases.map((useCase) => {
          return (
            <Case
              key={useCase.case_id}
              useCase={useCase}
              onEdit={() => setIsEditingCase(useCase)}
              onDelete={() => setIsDeletingCase(useCase)}
            />
          );
        })}
      </div>

      {useCases.length === 0 && <EmptyPlaceholder />}

      {isCreatingCase && (
        <CreateCaseDialog
          onSubmit={createUseCase}
          onCancel={() => setIsCreatingCase(false)}
        />
      )}
      {isEditingCase && (
        <EditCaseDialog
          useCase={isEditingCase}
          onSubmit={handleEditUseCase}
          onCancel={() => setIsEditingCase(null)}
        />
      )}
      {isDeletingCase && (
        <DeleteCaseDialog
          useCase={isDeletingCase}
          onConfirm={handleDeleteUseCase}
          onCancel={() => setIsDeletingCase(null)}
        />
      )}
    </div>
  );
}
