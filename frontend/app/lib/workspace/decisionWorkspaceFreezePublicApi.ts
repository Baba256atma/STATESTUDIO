/** WS-4:8 — Deterministic frozen Public API inventory. */
const names = Object.freeze([
  "DecisionWorkspaceFreezeIdentity",
  "DecisionWorkspaceFreezeInventory",
  "DecisionWorkspaceFreezeCompatibility",
  "DecisionWorkspaceFreezeExtensions",
  "DecisionWorkspaceFreezeLock",
  "DecisionWorkspaceFreezeStatus",
  "DecisionWorkspaceFreezeReadiness",
] as const);

export const DecisionWorkspaceFreezePublicApi = Object.freeze(
  names.map((exportName, index) => Object.freeze({
    id: `WS-4:8/PublicAPI/${String(index + 1).padStart(2, "0")}`,
    exportName,
    sourcePhase: "WS-4:8",
    order: index + 1,
    runtimeApi: false,
    frozen: true,
    metadataOnly: true,
    immutable: true,
  })),
);
