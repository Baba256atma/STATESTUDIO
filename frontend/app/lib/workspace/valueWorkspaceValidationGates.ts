/** WS-9:4 — Immutable non-executable validation gates. */
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

export const ValueWorkspaceValidationGates = Object.freeze(
  names.map((name, index) => Object.freeze({
    id: `WS-9:4/Gate/${String(index + 1).padStart(2, "0")}`,
    name,
    declaredOutcome: "Pass",
    order: index + 1,
    executable: false,
    metadataOnly: true,
    immutable: true,
  })),
);
