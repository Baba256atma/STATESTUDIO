/** WS-8:5 — Deterministic metadata-only Manifest API inventory. */
const names = Object.freeze([
  "WarRoomWorkspaceManifestIdentity",
  "WarRoomWorkspaceManifestSources",
  "WarRoomWorkspaceManifestInventory",
  "WarRoomWorkspaceManifestGuarantees",
  "WarRoomWorkspaceManifestReadiness",
  "WarRoomWorkspaceManifestStatus",
  "WarRoomWorkspaceManifestDependencies",
  "WarRoomWorkspaceManifest",
] as const);

export const WarRoomWorkspaceManifestPublicApi = Object.freeze(
  names.map((exportName, index) => Object.freeze({
    id: `WS-8:5/PublicAPI/${String(index + 1).padStart(2, "0")}`,
    exportName,
    sourcePhase: "WS-8:5",
    order: index + 1,
    runtimeApi: false,
    metadataOnly: true,
    immutable: true,
  })),
);
