/** WS-9:8 — Immutable workspace compatibility declarations. */
import { ValueWorkspaceCertification } from "./valueWorkspaceCertification.ts";

const names = Object.freeze([
  "Executive Home Workspace",
  "Goal Workspace",
  "KPI Workspace",
  "Strategy Workspace",
  "Problem Workspace",
  "Decision Workspace",
  "Scenario Workspace",
  "War Room Workspace",
  "Timeline Workspace",
] as const);

export const ValueWorkspaceFreezeCompatibility = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-9:8/Compatibility/${String(index + 1).padStart(2, "0")}`,
    name,
    state: "Compatible",
    runtimeInteraction: false,
    source: ValueWorkspaceCertification,
    order: index + 1,
    metadataOnly: true,
    immutable: true,
  })),
);
