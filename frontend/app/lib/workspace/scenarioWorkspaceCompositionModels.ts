/** WS-5:3 — Declarative Scenario composition metadata. */
import type { ScenarioWorkspaceModelDescriptor } from "./scenarioWorkspaceIdentityModel.ts";
import { ScenarioWorkspaceRegistry } from "./scenarioWorkspaceRegistry.ts";

const names = Object.freeze([
  "Workspace Composition",
  "Scenario Composition",
  "Scenario Option Composition",
  "Branch Composition",
  "Timeline Composition",
  "Assumption Composition",
  "Risk Composition",
  "Constraint Composition",
  "Outcome Composition",
  "Recommendation Composition",
] as const);

export const ScenarioWorkspaceCompositionModels = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-5:3/Composition/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Declares ${name.toLowerCase()} without execution.`,
    source: ScenarioWorkspaceRegistry,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly ScenarioWorkspaceModelDescriptor[],
);
