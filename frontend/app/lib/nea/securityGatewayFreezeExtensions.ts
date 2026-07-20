/**
 * NEA-4:8 — Security Gateway Freeze Extensions.
 *
 * Immutable extension policy metadata for frozen Security Gateway.
 * Policy metadata only — no runtime extension behavior.
 *
 * Ownership: owned exclusively by NEA-4:8.
 */

/** Exactly four allowed extension groups. */
export const SECURITY_GATEWAY_FREEZE_ALLOWED_EXTENSIONS = Object.freeze([
  "Additive Public Index metadata declarations",
  "Forward-only consumer documentation references",
  "Major-version successor freeze baselines",
  "Additive export review under major-version process",
] as const);

export const SECURITY_GATEWAY_FREEZE_FORBIDDEN_EXTENSIONS = Object.freeze([
  "Destructive replacement of frozen architecture",
  "Reconstruction of Certification or Platform metadata",
  "Mutation of existing public exports",
  "Silent breaking changes under the same major version",
  "Backward dependency edges into prior phases",
  "Duplicate upstream inventories",
  "Mutation of security identity registry",
  "Mutation of security policy registry",
  "Mutation of permission registry",
  "Runtime freeze, certification, or validation logic",
  "Authentication, authorization, encryption, or runtime security surfaces",
] as const);

/** Canonical immutable extension policy. */
export const SecurityGatewayFreezeExtensionPolicy = Object.freeze({
  policyId: "NEA-4:8/FreezeExtensionPolicy",
  sourcePhase: "NEA-4:8" as const,
  allowedExtensions: SECURITY_GATEWAY_FREEZE_ALLOWED_EXTENSIONS,
  forbiddenExtensions: SECURITY_GATEWAY_FREEZE_FORBIDDEN_EXTENSIONS,
  allowedExtensionCount: SECURITY_GATEWAY_FREEZE_ALLOWED_EXTENSIONS.length,
  forbiddenExtensionCount:
    SECURITY_GATEWAY_FREEZE_FORBIDDEN_EXTENSIONS.length,
  allowedExtensionGroups: SECURITY_GATEWAY_FREEZE_ALLOWED_EXTENSIONS,
  allowedExtensionGroupCount:
    SECURITY_GATEWAY_FREEZE_ALLOWED_EXTENSIONS.length,
  forbiddenExtensionPoints: SECURITY_GATEWAY_FREEZE_FORBIDDEN_EXTENSIONS,
  compatibilityRules: Object.freeze({
    policy: "PreserveAllFrozenPublicSurfaces" as const,
    breakingChangeRequiresMajorVersion: true as const,
    silentBreakingChangesAllowed: false as const,
    reconstructsUpstreamAllowed: false as const,
    description:
      "Consumers must treat NEA-4:8 as an immutable baseline; breaking change requires a major-version successor.",
  }),
  freezeGuarantees: Object.freeze({
    architectureImmutable: true as const,
    inventoriesDerivedOnly: true as const,
    noRuntimeSecurity: true as const,
    certificationOutcomePreserved: true as const,
    description:
      "Frozen architecture, inventories, and certification outcome remain immutable for Public Index consumers.",
  }),
  backwardCompatibility: Object.freeze({
    policy: "PreserveAllFrozenPublicSurfaces" as const,
    breakingChangeRequiresMajorVersion: true as const,
    silentBreakingChangesAllowed: false as const,
    reconstructsUpstreamAllowed: false as const,
    description:
      "Consumers must treat NEA-4:8 as an immutable baseline; breaking change requires a major-version successor.",
  }),
  futurePublicIndexReadiness: Object.freeze({
    readiness: "ReadyForPublicIndex" as const,
    nextPhase: "NEA-4:9 — Security Gateway Public Index",
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
