import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: "/",
      destination: "/projects/list",
    },
    {
      source: "/create",
      destination: "/projects/create",
    },
    {
      source: "/projects/:projectId/tasks",
      destination: "/tasks/list",
    },
    {
      source: "/tasks/create",
      destination: "/tasks/create",
    },
  ],
};

export default nextConfig;
