/** WS-8:4 — Immutable declarative Validation gates. */
import { WarRoomWorkspaceValidationRules } from "./warRoomWorkspaceValidationRules.ts";

const names = Object.freeze([
  "FoundationPass", "RegistryPass", "ModelPass", "IdentityPass",
  "RelationshipPass", "DependencyPass", "BoundaryPass", "MetadataPass",
  "WorkspacePass", "ReadyForManifest",
] as const);

export const WarRoomWorkspaceValidationGates = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-8:4/Gate/${String(index + 1).padStart(2, "0")}`,
    name,
    requiredRules: WarRoomWorkspaceValidationRules,
    requiredOutcome: "Pass",
    declaredOutcome: "Pass",
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
