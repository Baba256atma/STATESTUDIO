/**
 * NEA-5:8 — Gateway Routing Freeze Extensions.
 *
 * Immutable extension policy metadata for frozen Gateway Routing.
 * Policy metadata only — no runtime extension behavior.
 *
 * Ownership: owned exclusively by NEA-5:8.
 */

export const GATEWAY_ROUTING_FREEZE_ALLOWED_EXTENSIONS = Object.freeze([
  "Additive Public Index metadata declarations",
  "Forward-only consumer documentation references",
  "Major-version successor freeze baselines",
  "Additive export review under major-version process",
] as const);

export const GATEWAY_ROUTING_FREEZE_FORBIDDEN_EXTENSIONS = Object.freeze([
  "Destructive replacement of frozen architecture",
  "Reconstruction of Certification or Platform metadata",
  "Mutation of existing public exports",
  "Silent breaking changes under the same major version",
  "Backward dependency edges into prior phases",
  "Duplicate upstream inventories",
  "Mutation of route identity registry",
  "Mutation of route definition domain models",
  "Runtime freeze, certification, or validation logic",
  "Runtime routing, algorithms, consumer selection, or AI surfaces",
] as const);

/** Canonical immutable extension policy. */
export const GatewayRoutingFreezeExtensionPolicy = Object.freeze({
  policyId: "NEA-5:8/FreezeExtensionPolicy",
  sourcePhase: "NEA-5:8" as const,
  allowedExtensions: GATEWAY_ROUTING_FREEZE_ALLOWED_EXTENSIONS,
  forbiddenExtensions: GATEWAY_ROUTING_FREEZE_FORBIDDEN_EXTENSIONS,
  allowedExtensionCount: GATEWAY_ROUTING_FREEZE_ALLOWED_EXTENSIONS.length,
  forbiddenExtensionCount: GATEWAY_ROUTING_FREEZE_FORBIDDEN_EXTENSIONS.length,
  extensionRules: Object.freeze([
    "Extensions must be additive and forward-only.",
    "Breaking change requires a major-version successor freeze.",
    "Prior phases must not be reconstructed or mutated.",
    "Runtime routing and validation remain forbidden.",
  ] as const),
  backwardCompatibility: Object.freeze({
    policy: "PreserveAllFrozenPublicSurfaces" as const,
    breakingChangeRequiresMajorVersion: true as const,
    silentBreakingChangesAllowed: false as const,
    reconstructsUpstreamAllowed: false as const,
    description:
      "Consumers must treat NEA-5:8 as an immutable baseline; breaking change requires a major-version successor.",
  }),
  futurePublicIndexReadiness: Object.freeze({
    readiness: "ReadyForPublicIndex" as const,
    nextPhase: "NEA-5:9 — Gateway Routing Public Index",
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
