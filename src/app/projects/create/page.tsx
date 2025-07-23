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
  Input,
  Label,
  Separator,
  Textarea,
} from "../../../components";
import { ArrowLeft } from "lucide-react";

interface CreateProjectProps {
  onBack?: () => void;
}

export default function CreateProject({ onBack }: CreateProjectProps) {
  const [projectData, setProjectData] = useState({
    id: "",
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    id: "",
    name: "",
    description: "",
  });

  const validateForm = () => {
    const newErrors = {
      id: "",
      name: "",
      description: "",
    };

    if (!projectData.id.trim()) {
      newErrors.id = "ID do projeto é obrigatório";
    } else if (!/^[A-Z]{2,5}$/.test(projectData.id.trim())) {
      newErrors.id = "ID deve ter 2-5 letras maiúsculas (ex: PROJ)";
    }

    if (!projectData.name.trim()) {
      newErrors.name = "Nome do projeto é obrigatório";
    }

    if (!projectData.description.trim()) {
      newErrors.description = "Descrição é obrigatória";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Projeto criado:", projectData);
      // TODO: Integrar com o backend
      alert("Projeto criado com sucesso!");
      handleCancel();

      if (onBack) {
        onBack();
      }
    }
  };

  const handleCancel = () => {
    setProjectData({ id: "", name: "", description: "" });
    setErrors({ id: "", name: "", description: "" });
    if (onBack) {
      onBack();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProjectData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2 p-0 h-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para projetos
        </Button>
      )}

      <div className="mb-8">
        <h1 className="mb-2">Criar novo projeto</h1>
        <p className="text-muted-foreground">
          Preencha as informações abaixo para criar um novo projeto
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Detalhes do Projeto
            <Badge variant="secondary" className="text-xs">
              Obrigatório
            </Badge>
          </CardTitle>
          <CardDescription>
            Configure as informações básicas do seu projeto
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="project-id">ID *</Label>
                <Input
                  id="project-id"
                  placeholder="ex: PROJ"
                  value={projectData.id}
                  onChange={(e) =>
                    handleInputChange("id", e.target.value.toUpperCase())
                  }
                  className={errors.id ? "border-destructive" : ""}
                  maxLength={5}
                />
                {errors.id && (
                  <p className="text-sm text-destructive">{errors.id}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Chave única do projeto (2-5 letras maiúsculas)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-name">Nome *</Label>
                <Input
                  id="project-name"
                  placeholder="ex: Sistema de Gestão"
                  value={projectData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="project-description">Descrição *</Label>
              <Textarea
                id="project-description"
                placeholder="Descreva o objetivo e escopo do projeto..."
                value={projectData.description}
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
                  {projectData.description.length}/500
                </p>
              </div>
            </div>
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
            Criar Projeto
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
