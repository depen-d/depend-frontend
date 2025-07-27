import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@/components";
import { UseCase } from "../overview";

const useCaseSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(500, "Descrição muito longa"),
});

type UseCaseFormData = z.infer<typeof useCaseSchema>;

interface EditCaseDialogProps {
  useCase: UseCase;
  onSubmit: (
    useCase: Pick<UseCase, "case_id" | "name" | "description">
  ) => void;
  onCancel: () => void;
}

export function EditCaseDialog({
  useCase,
  onSubmit,
  onCancel,
}: EditCaseDialogProps) {
  const form = useForm<UseCaseFormData>({
    resolver: zodResolver(useCaseSchema),
    defaultValues: {
      name: useCase.name,
      description: useCase.description,
    },
  });

  const handleSubmit = async (data: UseCaseFormData) => {
    const updatedUseCase = {
      case_id: useCase.case_id,
      ...data,
    };

    onSubmit(updatedUseCase);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Caso de Uso</DialogTitle>
          <DialogDescription>
            Atualize as informações do caso de uso
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-6 space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Sistema de Autenticação"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o objetivo e escopo deste caso de uso..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Alterações</Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
