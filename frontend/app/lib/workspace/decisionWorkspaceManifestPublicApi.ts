/** WS-4:5 — Deterministic metadata-only Manifest API inventory. */
const names = Object.freeze([
  "DecisionWorkspaceManifestIdentity",
  "DecisionWorkspaceManifestSources",
  "DecisionWorkspaceManifestInventory",
  "DecisionWorkspaceManifestGuarantees",
  "DecisionWorkspaceManifestReadinessGates",
  "DecisionWorkspaceManifestSummary",
  "DecisionWorkspaceManifestStatus",
  "DecisionWorkspaceManifestReadiness",
] as const);

export const DecisionWorkspaceManifestPublicApi = Object.freeze(
  names.map((exportName, index) => Object.freeze({
    id: `WS-4:5/PublicAPI/${String(index + 1).padStart(2, "0")}`,
    exportName,
    sourcePhase: "WS-4:5",
    order: index + 1,
    runtimeFunction: false,
    metadataOnly: true,
    immutable: true,
  })),
);
