import { TeamsList } from "@/modules/teams";
import { render, screen } from "@testing-library/react";

describe("[Module] Teams", () => {
  it("renders correctly", () => {
    render(<TeamsList />);

    expect(
      screen.getByRole("heading", { name: "Times Configurados", level: 4 })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Ao clicar em um time, você será redirecionado para o quadro de tarefas desse time"
      )
    ).toBeInTheDocument();

    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();

    expect(
      screen.getByRole("columnheader", { name: "ID" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Nome" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Descrição" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Qtd. Tarefas" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("cell", { name: "Time de Elicitação de Requisitos" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "Time de Design e UX" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "Time de Desenvolvimento" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "Time de Testes e QA" })
    ).toBeInTheDocument();
  });
});
