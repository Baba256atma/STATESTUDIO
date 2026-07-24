/** WS-6:8 — Immutable workspace compatibility declarations. */
import { ProblemWorkspaceCertification } from "./problemWorkspaceCertification.ts";

const names = Object.freeze([
  "Executive Home Workspace",
  "Goal Workspace",
  "KPI Workspace",
  "Strategy Workspace",
  "Scenario Workspace",
  "Decision Workspace",
  "War Room Workspace",
  "Timeline Workspace",
] as const);

export const ProblemWorkspaceFreezeCompatibility = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-6:8/Compatibility/${String(index + 1).padStart(2, "0")}`,
      name,
      state: "Compatible",
      runtimeInteraction: false,
      source: ProblemWorkspaceCertification,
      order: index + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
