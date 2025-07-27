import { Teams } from "./teams";

export const getTeamBadgeColor = (team: Teams): string => {
  switch (team) {
    case Teams.REQ:
      return "bg-red-300 border-red-600";
    case Teams.DES:
      return "bg-lime-300 border-lime-600";
    case Teams.DEV:
      return "bg-cyan-300 border-cyan-600";
    case Teams.TES:
      return "bg-violet-300 border-violet-600";
    default:
      return "bg-gray-300 border-gray-600";
  }
};

export const getTeamTextColor = (team: Teams): string => {
  switch (team) {
    case Teams.REQ:
      return "text-red-600";
    case Teams.DES:
      return "text-lime-600";
    case Teams.DEV:
      return "text-cyan-600";
    case Teams.TES:
      return "text-violet-600";
    default:
      return "text-gray-600";
  }
};
