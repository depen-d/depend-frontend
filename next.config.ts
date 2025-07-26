import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => [
    {
      source: "/teams/:teamId/tasks",
      destination: "/tasks",
    },
  ],
};

export default nextConfig;
