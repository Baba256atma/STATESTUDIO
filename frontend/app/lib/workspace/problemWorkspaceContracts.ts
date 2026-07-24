/** WS-6:1 — Immutable Problem Workspace architectural contracts. */
import type { ProblemWorkspaceDeclaration } from "./problemWorkspaceIdentity.ts";

const names = Object.freeze([
  "ProblemWorkspaceContract",
  "ProblemIdentityContract",
  "ProblemDefinitionContract",
  "ProblemContextContract",
  "ProblemEvidenceContract",
  "ProblemConstraintContract",
  "ProblemAssumptionContract",
  "ProblemHypothesisContract",
  "ProblemImpactContract",
  "ProblemClassificationContract",
  "ProblemBoundaryContract",
  "ProblemWorkspaceFoundationContract",
] as const);

export const ProblemWorkspaceContracts = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-6:1/Contract/${String(index + 1).padStart(2, "0")}`,
    name,
    description: `Declares the canonical ${name} metadata contract.`,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })) satisfies readonly ProblemWorkspaceDeclaration[],
);
