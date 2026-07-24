/** WS-7:4 — Immutable declarative Validation gates. */
import { DecisionWorkspaceV7ValidationRules } from "./decisionWorkspaceV7ValidationRules.ts";

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

export const DecisionWorkspaceV7ValidationGates = Object.freeze(
  names.map((name, index) =>
    Object.freeze({
      id: `WS-7:4/Gate/${String(index + 1).padStart(2, "0")}`,
      name,
      requiredRules: DecisionWorkspaceV7ValidationRules,
      requiredOutcome: "Pass",
      declaredOutcome: "Pass",
      order: index + 1,
      executable: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
