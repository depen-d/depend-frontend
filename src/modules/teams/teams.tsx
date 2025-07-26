"use client";

import { useRouter } from "next/navigation";
import {
  Badge,
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
} from "@/components";
import { FolderTree } from "lucide-react";

export enum Teams {
  REQ = "REQ",
  DESIGN = "DESIGN",
  DEV = "DEV",
  TEST = "TEST",
}

interface Team {
  team_id: Teams;
  name: string;
  description: string;
}

const teams: Team[] = [
  {
    team_id: Teams.REQ,
    name: "Time de Elicitação de Requisitos",
    description:
      "Traduzir ideias e necessidades em especificações claras para o produto que será desenvolvido",
  },
  {
    team_id: Teams.DESIGN,
    name: "Time de Design e UX",
    description:
      "Criar a arquitetura do sistema, a interface do usuário (UI) e a experiência do usuário (UX)",
  },
  {
    team_id: Teams.DEV,
    name: "Time de Desenvolvimento",
    description:
      "Construir através dos designs e requisitos, transformando os planos em um produto funcional",
  },
  {
    team_id: Teams.TEST,
    name: "Time de Testes e QA",
    description:
      "Garantir a qualidade do software por meio de testes rigorosos e feedback contínuo",
  },
];

export function TeamsList() {
  const router = useRouter();

  const onTeamClick = (teamId: string) => {
    router.push(`/teams/${teamId}/tasks`);
  };

  return (
    <div className="mx-auto mt-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Times Configurados
          </CardTitle>
          <CardDescription>
            Ao clicar em um time, você será redirecionado para o quadro de
            tarefas desse time
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Qtd. Tarefas</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {teams.map((team) => (
                <TableRow
                  key={team.team_id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onTeamClick(team.team_id)}
                >
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {team.team_id}
                    </Badge>
                  </TableCell>
                  <TableCell>{team.name}</TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm text-muted-foreground truncate">
                      {team.description}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">0</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
