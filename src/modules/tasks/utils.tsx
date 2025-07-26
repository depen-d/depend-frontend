import { Badge } from "@/components";
import { Task } from "./tasks";

export const statusColumns = [
  {
    id: "OPEN" as const,
    title: "Aberto",
    description: "Backlog",
    variant: "secondary" as const,
  },
  {
    id: "IN_PROGRESS" as const,
    title: "Em Andamento",
    description: "Tarefas sendo executadas",
    variant: "default" as const,
  },
  {
    id: "CLOSED" as const,
    title: "Concluído",
    description: "Tarefas finalizadas",
    variant: "outline" as const,
  },
];

export const getStatusBadge = (status: Task["status"]) => {
  const config = statusColumns.find((col) => col.id === status);

  return (
    <Badge variant={config?.variant} className="text-xs">
      {config?.title}
    </Badge>
  );
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
};
