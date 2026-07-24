/** WS-7:6 — Immutable workspace compatibility declarations. */
import { DecisionWorkspaceV7Manifest } from "./decisionWorkspaceV7Manifest.ts";

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

export const DecisionWorkspaceV7PlatformCompatibility = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-7:6/Compatibility/${String(index + 1).padStart(2, "0")}`,
      name,
      state: "Compatible",
      runtimeInteraction: false,
      source: DecisionWorkspaceV7Manifest,
      order: index + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
