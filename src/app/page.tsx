"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components";
import { TeamsList } from "@/modules/teams";
import { Overview } from "@/modules/overview";

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="mb-2">Dep[N]d</h1>
          <p className="text-muted-foreground">
            Gerencie seus times, casos de uso e tarefas de forma eficiente
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Times</TabsTrigger>
            <TabsTrigger value="projects">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <TeamsList />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <Overview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
