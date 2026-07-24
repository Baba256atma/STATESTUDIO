/** WS-6:6 — Immutable compatibility declarations. */
import { ProblemWorkspaceManifest } from "./problemWorkspaceManifest.ts";

const names = Object.freeze([
  "Workspace Layer",
  "Executive Home Workspace",
  "Goal Workspace",
  "KPI Workspace",
  "Strategy Workspace",
  "Scenario Workspace",
  "Decision Workspace",
  "War Room Workspace",
  "Timeline Workspace",
] as const);

export const ProblemWorkspacePlatformCompatibility = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-6:6/Compatibility/${String(index + 1).padStart(2, "0")}`,
      name,
      state: "Compatible",
      interaction: "None",
      source: ProblemWorkspaceManifest,
      order: index + 1,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
