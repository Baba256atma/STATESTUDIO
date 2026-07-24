/** WS-5:1 — Immutable Scenario Workspace architectural contracts. */
import type { ScenarioWorkspaceDeclaration } from "./scenarioWorkspaceIdentity.ts";

const names = Object.freeze([
  "Scenario Workspace",
  "Scenario Object",
  "Scenario Option",
  "Scenario Branch",
  "Scenario Timeline",
  "Scenario Assumption",
  "Scenario Risk",
  "Scenario Constraint",
  "Scenario Outcome",
  "Scenario Confidence",
  "Scenario Recommendation",
  "Scenario Metadata",
] as const);

export const ScenarioWorkspaceContracts = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-5:1/Contract/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Declares the canonical ${name} metadata contract.`,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly ScenarioWorkspaceDeclaration[],
);
