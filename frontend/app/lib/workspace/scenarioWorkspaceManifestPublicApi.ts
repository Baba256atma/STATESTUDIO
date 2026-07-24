/** WS-5:5 — Deterministic metadata-only Manifest API inventory. */
const names = Object.freeze([
  "ScenarioWorkspaceManifestIdentity",
  "ScenarioWorkspaceManifestSources",
  "ScenarioWorkspaceManifestInventory",
  "ScenarioWorkspaceManifestGuarantees",
  "ScenarioWorkspaceManifestReadinessGates",
  "ScenarioWorkspaceManifestSummary",
  "ScenarioWorkspaceManifestStatus",
  "ScenarioWorkspaceManifestReadiness",
] as const);

export const ScenarioWorkspaceManifestPublicApi = Object.freeze(
  names.map((exportName, index) => Object.freeze({
    id: `WS-5:5/PublicAPI/${String(index + 1).padStart(2, "0")}`,
    exportName,
    sourcePhase: "WS-5:5",
    order: index + 1,
    runtimeFunction: false,
    metadataOnly: true,
    immutable: true,
  })),
);
