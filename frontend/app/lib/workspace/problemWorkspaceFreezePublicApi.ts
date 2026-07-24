/** WS-6:8 — Deterministically ordered Freeze Public API Registry. */
const names = Object.freeze([
  "ProblemWorkspaceFreeze",
  "ProblemWorkspaceFreezeMetadata",
  "ProblemWorkspaceFreezeLock",
  "ProblemWorkspaceFrozenBaselines",
  "ProblemWorkspaceFreezeCompatibility",
  "ProblemWorkspaceFreezeGuarantees",
  "ProblemWorkspaceFreezeIdentity",
  "ProblemWorkspaceFreezePublicApi",
] as const);

export const ProblemWorkspaceFreezePublicApi = Object.freeze(
  names.map((exportName, index) =>
    Object.freeze({
      id: `WS-6:8/PublicAPI/${String(index + 1).padStart(2, "0")}`,
      exportName,
      sourcePhase: "WS-6:8",
      order: index + 1,
      runtimeApi: false,
      frozen: true,
      metadataOnly: true,
      immutable: true,
    }),
  ),
);
