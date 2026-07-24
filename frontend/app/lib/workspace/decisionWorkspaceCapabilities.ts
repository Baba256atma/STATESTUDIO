/** WS-4:1 — Declarative capabilities and executive responsibilities. */
import type { DecisionWorkspaceDeclaration } from "./decisionWorkspaceIdentity.ts";

const capabilityNames = Object.freeze([
  "Define Decision",
  "Manage Decision Options",
  "Compare Alternatives",
  "Evaluate Decision Criteria",
  "Evaluate Risks",
  "Manage Assumptions",
  "Manage Constraints",
  "Assign Decision Owner",
  "Record Decision",
  "Review Decision",
  "Archive Decision",
  "Track Decision Confidence",
] as const);

const responsibilityNames = Object.freeze([
  "Decision Definition",
  "Decision Analysis",
  "Alternative Evaluation",
  "Decision Prioritization",
  "Risk Evaluation",
  "Assumption Management",
  "Constraint Management",
  "Decision Approval",
  "Decision Documentation",
  "Decision Governance",
] as const);

export const DecisionWorkspaceCapabilities = Object.freeze(
  capabilityNames.map((name, index) => Object.freeze({
    id: `WS-4:1/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Declares ${name.toLowerCase()} as a non-executable capability.`,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly DecisionWorkspaceDeclaration[],
);

export const DecisionWorkspaceResponsibilities = Object.freeze(
  responsibilityNames.map((name, index) => Object.freeze({
    id: `WS-4:1/Responsibility/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Assigns ${name.toLowerCase()} to the Decision Workspace architecture.`,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly DecisionWorkspaceDeclaration[],
);
