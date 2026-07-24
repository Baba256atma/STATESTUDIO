/** WS-6:1 — Declarative capabilities and architectural responsibilities. */
import type { ProblemWorkspaceDeclaration } from "./problemWorkspaceIdentity.ts";

const capabilityNames = Object.freeze([
  "Define Problem",
  "Describe Problem",
  "Organize Evidence",
  "Organize Constraints",
  "Organize Assumptions",
  "Declare Context",
  "Prepare Root Cause Analysis",
  "Prepare Impact Analysis",
  "Prepare Decision Inputs",
  "Prepare Scenario Inputs",
  "Maintain Executive Problem Model",
] as const);

const responsibilityNames = Object.freeze([
  "Problem Identification",
  "Problem Definition",
  "Problem Classification",
  "Problem Framing",
  "Evidence Declaration",
  "Constraint Declaration",
  "Assumption Declaration",
  "Problem Context Declaration",
  "Root-Cause Readiness",
  "Impact Readiness",
  "Executive Problem Representation",
  "Workspace Boundary Declaration",
] as const);

export const ProblemWorkspaceCapabilities = Object.freeze(
  capabilityNames.map((name, index) => Object.freeze({
    id: `WS-6:1/Capability/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Declares ${name.toLowerCase()} as a non-executable capability.`,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly ProblemWorkspaceDeclaration[],
);

export const ProblemWorkspaceResponsibilities = Object.freeze(
  responsibilityNames.map((name, index) => Object.freeze({
    id: `WS-6:1/Responsibility/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Assigns ${name.toLowerCase()} to the Problem Workspace architecture.`,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly ProblemWorkspaceDeclaration[],
);
