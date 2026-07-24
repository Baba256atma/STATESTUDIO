/** WS-10:5 — Deterministic metadata-only Manifest API inventory. */
const names = Object.freeze([
  "TimelineWorkspaceManifestIdentity",
  "TimelineWorkspaceManifestSources",
  "TimelineWorkspaceManifestInventory",
  "TimelineWorkspaceManifestGuarantees",
  "TimelineWorkspaceManifestReadiness",
  "TimelineWorkspaceManifestStatus",
  "TimelineWorkspaceManifestDependencies",
  "TimelineWorkspaceManifest",
] as const);

export const TimelineWorkspaceManifestPublicApi = Object.freeze(
  names.map((exportName, index) => Object.freeze({
    id: `WS-10:5/PublicAPI/${String(index + 1).padStart(2, "0")}`,
    exportName,
    sourcePhase: "WS-10:5",
    order: index + 1,
    runtimeApi: false,
    metadataOnly: true,
    immutable: true,
  })),
);
