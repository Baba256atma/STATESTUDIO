import type { WorkspaceMeaningArea } from "./executiveOrientationTypes";
import { logWorkspaceMeaning } from "./executiveOrientationInstrumentation";

const WORKSPACE_MEANING: Record<WorkspaceMeaningArea, string> = {
  scene: "Live operational map showing how your system connects and where pressure concentrates.",
  objects: "Individual nodes you can inspect, analyze, and act on within the operational network.",
  relationships: "Dependencies and influence paths that explain how disruption spreads across the system.",
  timeline: "Decision history and operational events in chronological executive context.",
  aiAssistant: "Strategic copilot for analysis, scenarios, and recommended next moves.",
};

/** E2:48 Part 5 — one-sentence workspace meaning per surface. */
export function resolveWorkspaceMeaning(area: WorkspaceMeaningArea): string {
  const line = WORKSPACE_MEANING[area];
  logWorkspaceMeaning("resolved", { area, line });
  return line;
}

export function resolveWorkspaceMeaningLayer(): Record<WorkspaceMeaningArea, string> {
  const layer = { ...WORKSPACE_MEANING };
  logWorkspaceMeaning("layer_resolved", { areas: Object.keys(layer) });
  return layer;
}
