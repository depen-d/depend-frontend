"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components";
import { TeamsList } from "@/modules/teams";
import { Overview } from "@/modules/overview";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

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
          <TabsList className="flex w-full border">
            <TabsTrigger
              value="teams"
              className={activeTab === "teams" ? "shadow-sm" : ""}
            >
              Times
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className={activeTab === "dashboard" ? "shadow-sm" : ""}
            >
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="mt-6">
            <TeamsList />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-6">
            <Overview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
