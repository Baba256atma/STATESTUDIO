/** WS-7:8 — Deterministically ordered Freeze Public API Registry. */
const names = Object.freeze([
  "DecisionWorkspaceV7Freeze",
  "DecisionWorkspaceV7FreezeMetadata",
  "DecisionWorkspaceV7FreezeLock",
  "DecisionWorkspaceV7FrozenBaselines",
  "DecisionWorkspaceV7FreezeCompatibility",
  "DecisionWorkspaceV7FreezeGuarantees",
  "DecisionWorkspaceV7FreezeIdentity",
  "DecisionWorkspaceV7FreezePublicApi",
] as const);

export const DecisionWorkspaceV7FreezePublicApi = Object.freeze(
  names.map((exportName, index) =>
    Object.freeze({
      id: `WS-7:8/PublicAPI/${String(index + 1).padStart(2, "0")}`,
      exportName,
      sourcePhase: "WS-7:8",
      order: index + 1,
      runtimeApi: false,
      frozen: true,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
