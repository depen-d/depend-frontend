import { Tasks } from "@/modules/tasks";
import { CreateTaskDialog } from "@/modules/tasks/components/CreateTaskDialog";
import { DeleteTaskDialog } from "@/modules/tasks/components/DeleteTaskDialog";
import { EditTaskDialog } from "@/modules/tasks/components/EditTaskDialog";
import { Task } from "@/modules/tasks/tasks";
import { Teams } from "@/modules/teams";
import { act, render, screen } from "@testing-library/react";

describe("[Module] Tasks", () => {
  it("renders correctly with empty state if no task is created", () => {
    render(<Tasks />);

    expect(
      screen.getByRole("button", { name: "Voltar para o Início" })
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(
      screen.getByText("Visualize e gerencie o progresso das tarefas")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Nova Tarefa" })
    ).toBeInTheDocument();
  });

  describe("CreateTaskDialog", () => {
    const defaultProps = {
      team: Teams.DEV,
      cases: [],
      onSubmit: jest.fn(),
      onCancel: jest.fn(),
    };
    it("renders correctly", () => {
      render(<CreateTaskDialog {...defaultProps} />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      expect(
        screen.getByRole("combobox", { name: /Time/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("combobox", { name: /Caso de Uso/ })
      ).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: /Nome/ })).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: /Descrição/ })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /Cancelar/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Criar Tarefa/ })
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Close/ })).toBeInTheDocument();
    });

    it("calls onSubmit when create task button is clicked", async () => {
      render(<CreateTaskDialog {...defaultProps} />);

      const button = screen.getByRole("button", { name: /Criar Tarefa/ });
      await act(async () => {
        await button.click();
      });
    });

    it("calls onCancel when cancel button is clicked", () => {
      render(<CreateTaskDialog {...defaultProps} />);

      const button = screen.getByRole("button", { name: /Cancelar/ });
      act(() => {
        button.click();
      });
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("EditTaskDialog", () => {
    const mockTask: Task = {
      task_id: 1,
      code: "DEV-1",
      name: "Test Task",
      description: "This is a test task",
      team: Teams.DEV,
      case_id: 1,
      status: "OPEN",
      created_at: new Date().toISOString(),
    };

    const defaultProps = {
      task: mockTask,
      cases: [],
      availableTasks: [mockTask],
      onSubmit: jest.fn(),
      onCancel: jest.fn(),
    };

    it("renders correctly", () => {
      render(<EditTaskDialog {...defaultProps} />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      expect(
        screen.getByRole("combobox", { name: /Time/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("combobox", { name: /Caso de Uso/ })
      ).toBeInTheDocument();
      expect(screen.getByRole("textbox", { name: /Nome/ })).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: /Descrição/ })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /Cancelar/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Editar Tarefa/ })
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Close/ })).toBeInTheDocument();
    });

    it("calls onSubmit when edit task button is clicked", async () => {
      render(<EditTaskDialog {...defaultProps} />);

      const button = screen.getByRole("button", { name: /Editar Tarefa/ });
      await act(async () => {
        await button.click();
      });
    });

    it("calls onCancel when cancel button is clicked", () => {
      render(<EditTaskDialog {...defaultProps} />);

      const button = screen.getByRole("button", { name: /Cancelar/ });
      act(() => {
        button.click();
      });
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("DeleteCaseDialog", () => {
    const task: Task = {
      case_id: 1,
      created_at: "2025-07-29T22:05:42.161148",
      description: "Mapear atributos necessários para produtos",
      team: Teams.REQ,
      updated_at: "2025-07-29T22:05:42.161300",
      name: "Levantamento de requisitos de catálogo",
      status: "OPEN",
      task_id: 1,
      code: "REQ-1",
    };
    const defaultProps = {
      task,
      onConfirm: jest.fn(),
      onCancel: jest.fn(),
    };

    it("renders correctly", () => {
      render(<DeleteTaskDialog {...defaultProps} />);

      expect(screen.getByRole("alertdialog")).toBeInTheDocument();

      expect(screen.getByText(/Confirmar Exclusão/)).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /Cancelar/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Excluir/ })
      ).toBeInTheDocument();
    });

    it("calls onConfirm when delete case button is clicked", async () => {
      render(<DeleteTaskDialog {...defaultProps} />);

      const button = screen.getByRole("button", {
        name: /Excluir/,
      });
      await act(async () => {
        await button.click();
      });
      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it("calls onCancel when cancel button is clicked", async () => {
      render(<DeleteTaskDialog {...defaultProps} />);

      const button = screen.getByRole("button", { name: /Cancelar/ });
      await act(async () => {
        await button.click();
      });
      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });
});
