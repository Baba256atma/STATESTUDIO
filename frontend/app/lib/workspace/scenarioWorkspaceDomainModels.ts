/** WS-5:3 — Canonical Scenario domain models. */
import type { ScenarioWorkspaceModelDescriptor } from "./scenarioWorkspaceIdentityModel.ts";
import { ScenarioWorkspaceRegistry } from "./scenarioWorkspaceRegistry.ts";

const names = Object.freeze([
  "Scenario Workspace Model",
  "Scenario Model",
  "Scenario Option Model",
  "Scenario Branch Model",
  "Scenario Timeline Model",
  "Scenario Assumption Model",
  "Scenario Risk Model",
  "Scenario Constraint Model",
  "Scenario Outcome Model",
  "Scenario Confidence Model",
  "Scenario Recommendation Model",
  "Scenario Metadata Model",
] as const);

export const ScenarioWorkspaceDomainModels = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-5:3/DomainModel/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Defines the structural ${name} metadata.`,
    source: ScenarioWorkspaceRegistry,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly ScenarioWorkspaceModelDescriptor[],
);
