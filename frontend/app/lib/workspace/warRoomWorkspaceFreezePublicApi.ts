/** WS-8:8 — Deterministically ordered Freeze API registry. */
const names = Object.freeze([
  "WarRoomWorkspaceFreeze", "WarRoomWorkspaceFreezeMetadata",
  "WarRoomWorkspaceFreezeLock", "WarRoomWorkspaceFrozenBaselines",
  "WarRoomWorkspaceFreezeCompatibility", "WarRoomWorkspaceFreezeGuarantees",
  "WarRoomWorkspaceFreezeIdentity", "WarRoomWorkspaceFreezePublicApi",
] as const);

export const WarRoomWorkspaceFreezePublicApi = Object.freeze(
  names.map((exportName, index) => Object.freeze({
    id: `WS-8:8/PublicAPI/${String(index + 1).padStart(2, "0")}`,
    exportName,
    sourcePhase: "WS-8:8",
    order: index + 1,
    runtimeApi: false,
    frozen: true,
    metadataOnly: true,
    immutable: true,
  })),
);
