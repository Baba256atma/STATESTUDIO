/**
 * NEA-3:8 — Session & Conversation Freeze Extensions.
 *
 * Immutable extension policy metadata for frozen Session & Conversation.
 * Policy metadata only — no runtime extension behavior.
 *
 * Ownership: owned exclusively by NEA-3:8.
 */

export const SESSION_CONVERSATION_FREEZE_ALLOWED_EXTENSIONS = Object.freeze([
  "Additive Public Index metadata declarations",
  "Forward-only consumer documentation references",
  "Major-version successor freeze baselines",
  "Additive export review under major-version process",
] as const);

export const SESSION_CONVERSATION_FREEZE_FORBIDDEN_EXTENSIONS = Object.freeze([
  "Destructive replacement of frozen architecture",
  "Reconstruction of Certification or Platform metadata",
  "Mutation of existing public exports",
  "Silent breaking changes under the same major version",
  "Backward dependency edges into prior phases",
  "Duplicate upstream inventories",
  "Mutation of session identity registry",
  "Mutation of conversation identity registry",
  "Runtime freeze, certification, or validation logic",
  "Runtime sessions, conversations, message processing, or AI surfaces",
] as const);

/** Canonical immutable extension policy. */
export const SessionConversationFreezeExtensionPolicy = Object.freeze({
  policyId: "NEA-3:8/FreezeExtensionPolicy",
  sourcePhase: "NEA-3:8" as const,
  allowedExtensions: SESSION_CONVERSATION_FREEZE_ALLOWED_EXTENSIONS,
  forbiddenExtensions: SESSION_CONVERSATION_FREEZE_FORBIDDEN_EXTENSIONS,
  allowedExtensionCount: SESSION_CONVERSATION_FREEZE_ALLOWED_EXTENSIONS.length,
  forbiddenExtensionCount:
    SESSION_CONVERSATION_FREEZE_FORBIDDEN_EXTENSIONS.length,
  backwardCompatibility: Object.freeze({
    policy: "PreserveAllFrozenPublicSurfaces" as const,
    breakingChangeRequiresMajorVersion: true as const,
    silentBreakingChangesAllowed: false as const,
    reconstructsUpstreamAllowed: false as const,
    description:
      "Consumers must treat NEA-3:8 as an immutable baseline; breaking change requires a major-version successor.",
  }),
  futurePublicIndexReadiness: Object.freeze({
    readiness: "ReadyForPublicIndex" as const,
    nextPhase: "NEA-3:9 — Session & Conversation Public Index",
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
