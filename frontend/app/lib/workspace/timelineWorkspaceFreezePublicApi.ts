/** WS-10:8 — Deterministically ordered Freeze API registry. */
const names = Object.freeze([
  "TimelineWorkspaceFreeze",
  "TimelineWorkspaceFreezeMetadata",
  "TimelineWorkspaceFreezeLock",
  "TimelineWorkspaceFrozenBaselines",
  "TimelineWorkspaceFreezeCompatibility",
  "TimelineWorkspaceFreezeGuarantees",
  "TimelineWorkspaceFreezeIdentity",
  "TimelineWorkspaceFreezePublicApi",
] as const);

export const TimelineWorkspaceFreezePublicApi = Object.freeze(
  names.map((exportName, index) => Object.freeze({
    id: `WS-10:8/PublicAPI/${String(index + 1).padStart(2, "0")}`,
    exportName,
    sourcePhase: "WS-10:8",
    order: index + 1,
    runtimeApi: false,
    frozen: true,
    metadataOnly: true,
    immutable: true,
  })),
);
