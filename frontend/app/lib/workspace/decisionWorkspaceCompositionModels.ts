/** WS-4:3 — Declarative Decision composition metadata. */
import type { DecisionWorkspaceModelDescriptor } from "./decisionWorkspaceIdentityModel.ts";
import { DecisionWorkspaceRegistry } from "./decisionWorkspaceRegistry.ts";

const names = Object.freeze([
  "Workspace Composition",
  "Decision Composition",
  "Decision Option Composition",
  "Criteria Composition",
  "Context Composition",
  "Risk Composition",
  "Assumption Composition",
  "Constraint Composition",
  "Confidence Composition",
  "Outcome Composition",
] as const);

export const DecisionWorkspaceCompositionModels = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-4:3/Composition/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Declares ${name.toLowerCase()} without execution.`,
    source: DecisionWorkspaceRegistry,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly DecisionWorkspaceModelDescriptor[],
);
