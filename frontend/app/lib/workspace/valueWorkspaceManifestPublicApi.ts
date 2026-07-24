/** WS-9:5 — Deterministic metadata-only Manifest API inventory. */
const names = Object.freeze([
  "ValueWorkspaceManifestIdentity",
  "ValueWorkspaceManifestSources",
  "ValueWorkspaceManifestInventory",
  "ValueWorkspaceManifestGuarantees",
  "ValueWorkspaceManifestReadiness",
  "ValueWorkspaceManifestStatus",
  "ValueWorkspaceManifestDependencies",
  "ValueWorkspaceManifest",
] as const);

export const ValueWorkspaceManifestPublicApi = Object.freeze(
  names.map((exportName, index) => Object.freeze({
    id: `WS-9:5/PublicAPI/${String(index + 1).padStart(2, "0")}`,
    exportName,
    sourcePhase: "WS-9:5",
    order: index + 1,
    runtimeApi: false,
    metadataOnly: true,
    immutable: true,
  })),
);
