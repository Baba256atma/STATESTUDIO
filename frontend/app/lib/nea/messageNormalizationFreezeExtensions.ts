/**
 * NEA-6:8 — Message Normalization Freeze Extensions.
 *
 * Immutable extension policy metadata for frozen Message Normalization.
 * Policy metadata only — no runtime extension behavior.
 *
 * Ownership: owned exclusively by NEA-6:8.
 */

export const MESSAGE_NORMALIZATION_FREEZE_ALLOWED_EXTENSIONS = Object.freeze([
  "Future NEA Versions",
  "Additive Public APIs",
  "Metadata Extensions",
  "Documentation Extensions",
] as const);

export const MESSAGE_NORMALIZATION_FREEZE_FORBIDDEN_EXTENSIONS = Object.freeze([
  "Runtime Behavior",
  "Contract Changes",
  "Registry Replacement",
  "Model Replacement",
  "Validation Replacement",
  "Certification Modification",
  "Canonical Reference Changes",
  "Dependency Changes",
  "Breaking Public APIs",
] as const);

/** Canonical immutable extension policy. */
export const MessageNormalizationFreezeExtensionPolicy = Object.freeze({
  policyId: "NEA-6:8/FreezeExtensionPolicy",
  sourcePhase: "NEA-6:8" as const,
  allowedExtensions: MESSAGE_NORMALIZATION_FREEZE_ALLOWED_EXTENSIONS,
  forbiddenExtensions: MESSAGE_NORMALIZATION_FREEZE_FORBIDDEN_EXTENSIONS,
  allowedExtensionCount:
    MESSAGE_NORMALIZATION_FREEZE_ALLOWED_EXTENSIONS.length,
  forbiddenExtensionCount:
    MESSAGE_NORMALIZATION_FREEZE_FORBIDDEN_EXTENSIONS.length,
  extensionRules: Object.freeze([
    "Extensions must be additive and forward-only.",
    "Breaking change requires a major-version successor freeze.",
    "Prior phases must not be reconstructed or mutated.",
    "Runtime normalization and validation remain forbidden.",
  ] as const),
  backwardCompatibility: Object.freeze({
    policy: "PreserveAllFrozenPublicSurfaces" as const,
    breakingChangeRequiresMajorVersion: true as const,
    silentBreakingChangesAllowed: false as const,
    reconstructsUpstreamAllowed: false as const,
    description:
      "Consumers must treat NEA-6:8 as an immutable baseline; breaking change requires a major-version successor.",
  }),
  futurePublicIndexReadiness: Object.freeze({
    readiness: "ReadyForPublicIndex" as const,
    nextPhase: "NEA-6:9 — Message Normalization Public Index",
    claimsPublicIndexPublished: false as const,
    additiveIndexOnly: true as const,
    mayMutateFreeze: false as const,
    description:
      "Freeze establishes the only frozen baseline Public Index may reference without modifying prior phases.",
  }),
  additiveOnly: true as const,
  executesRuntime: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
