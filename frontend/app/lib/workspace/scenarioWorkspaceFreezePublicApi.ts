/** WS-5:8 — Deterministic frozen Public API inventory. */
const names = Object.freeze([
  "ScenarioWorkspaceFreezeIdentity",
  "ScenarioWorkspaceFreezeInventory",
  "ScenarioWorkspaceFreezeCompatibility",
  "ScenarioWorkspaceFreezeExtensions",
  "ScenarioWorkspaceFreezeLock",
  "ScenarioWorkspaceFreezeStatus",
  "ScenarioWorkspaceFreezeReadiness",
] as const);

export const ScenarioWorkspaceFreezePublicApi = Object.freeze(
  names.map((exportName, index) => Object.freeze({
    id: `WS-5:8/PublicAPI/${String(index + 1).padStart(2, "0")}`,
    exportName,
    sourcePhase: "WS-5:8",
    order: index + 1,
    runtimeApi: false,
    frozen: true,
    metadataOnly: true,
    immutable: true,
  })),
);
