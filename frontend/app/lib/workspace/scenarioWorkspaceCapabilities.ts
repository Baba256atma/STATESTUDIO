/** WS-5:1 — Declarative capabilities and executive responsibilities. */
import type { ScenarioWorkspaceDeclaration } from "./scenarioWorkspaceIdentity.ts";

const capabilityNames = Object.freeze([
  "Define Scenario",
  "Manage Scenario Options",
  "Compare Scenarios",
  "Analyze Assumptions",
  "Analyze Risks",
  "Manage Constraints",
  "Evaluate Outcomes",
  "Assign Scenario Owner",
  "Record Scenario",
  "Review Scenario",
  "Archive Scenario",
  "Track Scenario Confidence",
] as const);

const responsibilityNames = Object.freeze([
  "Scenario Definition",
  "Scenario Modeling",
  "Scenario Comparison",
  "Scenario Evaluation",
  "Scenario Prioritization",
  "Scenario Review",
  "Scenario Governance",
  "Scenario Recommendation",
  "Scenario Documentation",
  "Scenario Selection",
] as const);

export const ScenarioWorkspaceCapabilities = Object.freeze(
  capabilityNames.map((name, index) => Object.freeze({
    id: `WS-5:1/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Declares ${name.toLowerCase()} as a non-executable capability.`,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly ScenarioWorkspaceDeclaration[],
);

export const ScenarioWorkspaceResponsibilities = Object.freeze(
  responsibilityNames.map((name, index) => Object.freeze({
    id: `WS-5:1/Responsibility/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Assigns ${name.toLowerCase()} to the Scenario Workspace architecture.`,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly ScenarioWorkspaceDeclaration[],
);
