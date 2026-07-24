/** WS-3:5 — Deterministic metadata-only Manifest API inventory. */
const names = Object.freeze(["GoalWorkspaceManifestIdentity", "GoalWorkspaceManifestSources",
  "GoalWorkspaceManifestInventory", "GoalWorkspaceManifestGuarantees",
  "GoalWorkspaceManifestReadinessGates", "GoalWorkspaceManifestSummary",
  "GoalWorkspaceManifestStatus", "GoalWorkspaceManifestReadiness"] as const);
export const GoalWorkspaceManifestPublicApi = Object.freeze(names.map((exportName, index) => Object.freeze({
  id: `WS-3:5/PublicAPI/${String(index + 1).padStart(2, "0")}`, exportName,
  sourcePhase: "WS-3:5", order: index + 1, runtimeFunction: false,
  metadataOnly: true, immutable: true,
})));

