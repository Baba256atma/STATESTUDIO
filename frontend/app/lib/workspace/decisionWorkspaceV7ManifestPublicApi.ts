/** WS-7:5 — Deterministic metadata-only Manifest API inventory. */
const exportNames = Object.freeze([
  "DecisionWorkspaceV7ManifestIdentity",
  "DecisionWorkspaceV7ManifestSources",
  "DecisionWorkspaceV7ManifestInventory",
  "DecisionWorkspaceV7ManifestGuarantees",
  "DecisionWorkspaceV7ManifestReadiness",
  "DecisionWorkspaceV7ManifestStatus",
  "DecisionWorkspaceV7ManifestDependencies",
  "DecisionWorkspaceV7Manifest",
] as const);

export const DecisionWorkspaceV7ManifestPublicApi = Object.freeze(
  exportNames.map((exportName, index) =>
    Object.freeze({
      id: `WS-7:5/PublicAPI/${String(index + 1).padStart(2, "0")}`,
      exportName,
      sourcePhase: "WS-7:5",
      order: index + 1,
      runtimeApi: false,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
