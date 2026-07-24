/** WS-7:8 — Immutable workspace compatibility declarations. */
import { DecisionWorkspaceV7Certification } from "./decisionWorkspaceV7Certification.ts";

const names = Object.freeze([
  "Executive Home Workspace",
  "Goal Workspace",
  "KPI Workspace",
  "Strategy Workspace",
  "Problem Workspace",
  "Scenario Workspace",
  "War Room Workspace",
  "Timeline Workspace",
] as const);

export const DecisionWorkspaceV7FreezeCompatibility = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-7:8/Compatibility/${String(index + 1).padStart(2, "0")}`,
      name,
      state: "Compatible",
      runtimeInteraction: false,
      source: DecisionWorkspaceV7Certification,
      order: index + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
