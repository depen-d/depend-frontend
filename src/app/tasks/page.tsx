"use client";

import { Tasks } from "@/modules/tasks";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="mb-2">Dep[N]d</h1>
          <p className="text-muted-foreground">
            Gerencie seus times, casos de uso e tarefas de forma eficiente
          </p>
        </div>

        <Tasks />
      </div>
    </div>
  );
}
