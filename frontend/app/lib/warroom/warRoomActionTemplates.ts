import type { WarRoomActionKind, WarRoomOutputMode } from "./warRoomTypes";

export type WarRoomActionTemplate = {
  id: string;
  kind: WarRoomActionKind;
  label: string;
  description: string;
  outputMode: WarRoomOutputMode;
  defaultParameters?: Record<string, unknown>;
};

export const WAR_ROOM_ACTION_TEMPLATES: WarRoomActionTemplate[] = [
  {
    id: "stress_increase",
    kind: "stress",
    label: "Increase Pressure",
    description: "Test how additional pressure spreads from the selected object.",
    outputMode: "propagation",
    defaultParameters: { intensity: 0.7, time_horizon: "near_term" },
  },
  {
    id: "stress_reduce",
    kind: "stabilize",
    label: "Reduce Pressure",
    description: "Preview which downstream impacts soften when pressure is reduced.",
    outputMode: "propagation",
    defaultParameters: { intensity: 0.45, time_horizon: "near_term" },
  },
  {
    id: "strategy_apply",
    kind: "optimize",
    label: "Apply Strategy",
    description: "Run a strategic intervention and inspect both effect spread and decision route.",
    outputMode: "mixed",
    defaultParameters: { strategy_name: "stabilize", intensity: 0.6 },
  },
  {
    id: "propagation_request",
    kind: "redistribute",
    label: "Show Propagation",
    description: "Show the likely downstream impact path from the selected source.",
    outputMode: "propagation",
    defaultParameters: { intensity: 0.55 },
  },
];

export function getWarRoomActionTemplate(kind: WarRoomActionKind | null | undefined): WarRoomActionTemplate | null {
  return WAR_ROOM_ACTION_TEMPLATES.find((template) => template.kind === kind) ?? null;
}
