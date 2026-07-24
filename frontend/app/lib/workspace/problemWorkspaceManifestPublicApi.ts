/** WS-6:5 — Deterministic metadata-only Manifest export inventory. */
const exportNames = Object.freeze([
  "ProblemWorkspaceManifestIdentity",
  "ProblemWorkspaceManifestSources",
  "ProblemWorkspaceManifestInventory",
  "ProblemWorkspaceManifestGuarantees",
  "ProblemWorkspaceManifestReadiness",
  "ProblemWorkspaceManifestStatus",
  "ProblemWorkspaceManifestDependencies",
  "ProblemWorkspaceManifest",
] as const);

export const ProblemWorkspaceManifestPublicApi = Object.freeze(
  exportNames.map((exportName, index) => Object.freeze({
    id: `WS-6:5/PublicAPI/${String(index + 1).padStart(2, "0")}`,
    exportName,
    sourcePhase: "WS-6:5",
    order: index + 1,
    runtimeApi: false,
    metadataOnly: true,
    immutable: true,
  })),
);
