/** WS-6:4 — Immutable declarative readiness gates. */
import { ProblemWorkspaceValidationRules } from "./problemWorkspaceValidationRules.ts";

const names = Object.freeze([
  "FoundationPass",
  "RegistryPass",
  "ModelPass",
  "IdentityPass",
  "RelationshipPass",
  "DependencyPass",
  "BoundaryPass",
  "MetadataPass",
  "WorkspacePass",
  "ReadyForManifest",
] as const);

export const ProblemWorkspaceValidationGates = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-6:4/Gate/${String(index + 1).padStart(2, "0")}`,
    name,
    requiredRules: ProblemWorkspaceValidationRules,
    requiredOutcome: "Pass",
    outcome: "Pass",
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
