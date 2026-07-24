/** WS-9:8 — Deterministically ordered Freeze API registry. */
const names = Object.freeze([
  "ValueWorkspaceFreeze",
  "ValueWorkspaceFreezeMetadata",
  "ValueWorkspaceFreezeLock",
  "ValueWorkspaceFrozenBaselines",
  "ValueWorkspaceFreezeCompatibility",
  "ValueWorkspaceFreezeGuarantees",
  "ValueWorkspaceFreezeIdentity",
  "ValueWorkspaceFreezePublicApi",
] as const);

export const ValueWorkspaceFreezePublicApi = Object.freeze(
  names.map((exportName, index) => Object.freeze({
    id: `WS-9:8/PublicAPI/${String(index + 1).padStart(2, "0")}`,
    exportName,
    sourcePhase: "WS-9:8",
    order: index + 1,
    runtimeApi: false,
    frozen: true,
    metadataOnly: true,
    immutable: true,
  })),
);
