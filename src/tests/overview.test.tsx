import { Overview } from "@/modules/overview";
import { CreateCaseDialog } from "@/modules/overview/components/CreateCaseDialog";
import { DeleteCaseDialog } from "@/modules/overview/components/DeleteCaseDialog";
import { EditCaseDialog } from "@/modules/overview/components/EditCaseDialog";
import { act, render, screen } from "@testing-library/react";

describe("[Module] Overview", () => {
  it("renders correctly", () => {
    render(<Overview />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Visão Geral dos Casos de Uso",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Acompanhe o progresso das suas entregas")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Novo Caso de Uso" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 4,
        name: "Total de Casos de Uso",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 4,
        name: "Total de Tarefas",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 4,
        name: "Em Progresso",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        level: 4,
        name: "Tarefas Concluídas",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Nenhum caso de uso encontrado")
    ).toBeInTheDocument();
    expect(screen.getByText("Crie um novo caso de uso")).toBeInTheDocument();
  });

  describe("CreateCaseDialog", () => {
    const defaultProps = {
      onSubmit: jest.fn(),
      onCancel: jest.fn(),
    };

    it("renders correctly", () => {
      render(<CreateCaseDialog {...defaultProps} />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      expect(screen.getByRole("textbox", { name: /Nome/ })).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: /Descrição/ })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /Cancelar/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Criar Caso de Uso/ })
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Close/ })).toBeInTheDocument();
    });

    it("calls onSubmit when create case button is clicked", async () => {
      render(<CreateCaseDialog {...defaultProps} />);

      const button = screen.getByRole("button", { name: /Criar Caso de Uso/ });
      await act(async () => {
        await button.click();
      });
    });

    it("calls onCancel when cancel button is clicked", async () => {
      render(<CreateCaseDialog {...defaultProps} />);

      const button = screen.getByRole("button", { name: /Cancelar/ });
      await act(async () => {
        await button.click();
      });
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("EditCaseDialog", () => {
    const useCase = {
      updated_at: "2025-07-29T22:05:42.147921",
      created_at: "2025-07-29T22:05:42.147817",
      description: "Gerenciamento de produtos do e-commerce",
      name: "Cadastro de Produtos",
      case_id: 1,
    };
    const defaultProps = {
      useCase,
      onSubmit: jest.fn(),
      onCancel: jest.fn(),
    };

    it("renders correctly", () => {
      render(<EditCaseDialog {...defaultProps} />);

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      expect(screen.getByRole("textbox", { name: /Nome/ })).toBeInTheDocument();
      expect(
        screen.getByRole("textbox", { name: /Descrição/ })
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: /Cancelar/ })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Salvar Alterações/ })
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Close/ })).toBeInTheDocument();
    });

    it("calls onSubmit when edit case button is clicked", async () => {
      render(<EditCaseDialog {...defaultProps} />);

      const button = screen.getByRole("button", { name: /Salvar Alterações/ });
      await act(async () => {
        await button.click();
      });
    });

    it("calls onCancel when cancel button is clicked", async () => {
      render(<EditCaseDialog {...defaultProps} />);

      const button = screen.getByRole("button", { name: /Cancelar/ });
      await act(async () => {
        await button.click();
      });
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("DeleteCaseDialog", () => {
    const useCase = {
      updated_at: "2025-07-29T22:05:42.147921",
      created_at: "2025-07-29T22:05:42.147817",
      description: "Gerenciamento de produtos do e-commerce",
      name: "Cadastro de Produtos",
      case_id: 1,
    };
    const defaultProps = {
      useCase,
      onConfirm: jest.fn(),
      onCancel: jest.fn(),
    };

    it("renders correctly", () => {
      render(<DeleteCaseDialog {...defaultProps} />);

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
      render(<DeleteCaseDialog {...defaultProps} />);

      const button = screen.getByRole("button", {
        name: /Excluir/,
      });
      await act(async () => {
        await button.click();
      });
      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    });

    it("calls onCancel when cancel button is clicked", async () => {
      render(<DeleteCaseDialog {...defaultProps} />);

      const button = screen.getByRole("button", { name: /Cancelar/ });
      await act(async () => {
        await button.click();
      });
      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });
});
