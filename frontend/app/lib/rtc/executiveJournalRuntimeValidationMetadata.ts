/**
 * RTC-2:4 — Executive Journal Runtime Validation Metadata.
 *
 * Principles, boundaries, and unresolved open issues carried forward
 * without selecting defaults for OI-01 through OI-06.
 *
 * Ownership: owned exclusively by RTC-2:4.
 */

import { ExecutiveJournalRuntimeModel } from "./executiveJournalRuntimeModel.ts";
import { ExecutiveJournalRuntimeValidationRuleFamilies } from "./executiveJournalRuntimeValidationContracts.ts";
import {
  ExecutiveJournalRuntimeValidationId,
  ExecutiveJournalRuntimeValidationName,
  ExecutiveJournalRuntimeValidationNamespace,
  ExecutiveJournalRuntimeValidationNextPhase,
  ExecutiveJournalRuntimeValidationReadiness,
  ExecutiveJournalRuntimeValidationStatus,
  ExecutiveJournalRuntimeValidationVersion,
} from "./executiveJournalRuntimeValidationIdentity.ts";
import { ExecutiveJournalRuntimeValidationLifecycle } from "./executiveJournalRuntimeValidationLifecycle.ts";
import { ExecutiveJournalRuntimeValidationRules } from "./executiveJournalRuntimeValidationRules.ts";

/** Upstream AI prohibitions preserved by reference through the model. */
export const ExecutiveJournalValidationAiMustNot =
  ExecutiveJournalRuntimeModel.aiMustNot;

/**
 * Open issues carried forward unresolved.
 * Validation MUST NOT invent defaults for these.
 */
export const ExecutiveJournalRuntimeValidationOpenIssues = Object.freeze(
  ExecutiveJournalRuntimeModel.openIssues.map((item) =>
    Object.freeze({
      issueId: item.issueId,
      issue: item.issue,
      requiredResolution: item.requiredResolution,
      accountableOwner: item.accountableOwner,
      resolved: false as const,
      resolvedByValidation: false as const,
      sourcePhase: "RTC-2:1" as const,
      carriedByPhase: "RTC-2:4" as const,
    })
  ),
);

export const ExecutiveJournalRuntimeValidationPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-2:4/Principle/01",
    name: "Evaluation only",
    description: "Validation never mutates, repairs, or activates runtime state.",
  }),
  Object.freeze({
    principleId: "RTC-2:4/Principle/02",
    name: "Deterministic pure functions",
    description:
      "Same input always yields the same immutable result without clock, network, or randomness.",
  }),
  Object.freeze({
    principleId: "RTC-2:4/Principle/03",
    name: "Fail closed",
    description:
      "Unknown vocabulary, unknown policy state, and malformed identity fail without normalization.",
  }),
  Object.freeze({
    principleId: "RTC-2:4/Principle/04",
    name: "Preserve upstream controls",
    description:
      "Append-only, authority, privacy, and AI prohibitions are enforced, not reinterpreted.",
  }),
  Object.freeze({
    principleId: "RTC-2:4/Principle/05",
    name: "No open-issue defaults",
    description:
      "OI-01 through OI-06 remain unresolved; absence of a required explicit reference may fail, but policy content is not invented.",
  }),
] as const);

export const ExecutiveJournalRuntimeValidationProhibitedSurfaces = Object.freeze([
  "React",
  "Next.js",
  "rendering",
  "Decision Journal APP-8 implementation",
  "resolve open issues OI-01 through OI-06",
  "mutate validation inputs",
  "repair invalid data",
  "network clients",
  "database clients",
  "telemetry SDKs",
  "system clock",
  "random identifiers",
  "journal payload logging",
] as const);

export const ExecutiveJournalRuntimeValidationOwnership = Object.freeze({
  ownershipId: "RTC-2:4/ExecutiveJournalRuntimeValidationOwnership",
  sourcePhase: "RTC-2:4" as const,
  owns: Object.freeze([
    "Pure validation evaluation",
    "Deterministic issue ordering",
    "Valid/Invalid result contract",
    "Rule family catalogue",
  ] as const),
  doesNotOwn: ExecutiveJournalRuntimeValidationProhibitedSurfaces,
  importsModelByReference: true as const,
  importsFoundationDirectly: false as const,
  ownsUi: false as const,
  ownsPersistence: false as const,
  ownsAiAuthority: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

export const ExecutiveJournalRuntimeValidationBoundaries = Object.freeze({
  boundariesId: "RTC-2:4/ExecutiveJournalRuntimeValidationBoundaries",
  sourcePhase: "RTC-2:4" as const,
  sourceModelId: ExecutiveJournalRuntimeModel.identity.id,
  foundationResolvedViaModel: true as const,
  aiMustNot: ExecutiveJournalValidationAiMustNot,
  openIssuesUnresolved: true as const,
  prohibitedSurfaces: ExecutiveJournalRuntimeValidationProhibitedSurfaces,
  dependencyRules: Object.freeze([
    "ImportRtc23ModelOnly",
    "NoDirectFoundationImport",
    "NoDecisionJournalApp8Imports",
    "NoUiFrameworkImports",
    "NoReactOrNextImports",
    "NoNetworkOrPersistenceImports",
    "NoClockOrRandomness",
    "NoOpenIssueDefaults",
  ] as const),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

export const ExecutiveJournalRuntimeValidationConstants = Object.freeze({
  phaseIdentifier: "RTC-2:4",
  canonicalIdentifier: ExecutiveJournalRuntimeValidationId,
  version: ExecutiveJournalRuntimeValidationVersion,
  name: ExecutiveJournalRuntimeValidationName,
  namespace: ExecutiveJournalRuntimeValidationNamespace,
  status: ExecutiveJournalRuntimeValidationStatus,
  readiness: ExecutiveJournalRuntimeValidationReadiness,
  nextPhase: ExecutiveJournalRuntimeValidationNextPhase,
  ruleCount: ExecutiveJournalRuntimeValidationRules.length,
  familyCount: ExecutiveJournalRuntimeValidationRuleFamilies.length,
  lifecycleStateCount: ExecutiveJournalRuntimeValidationLifecycle.stateCount,
  openIssueCount: ExecutiveJournalRuntimeValidationOpenIssues.length,
  principleCount: ExecutiveJournalRuntimeValidationPrinciples.length,
} as const);

export const ExecutiveJournalRuntimeValidationMetadata = Object.freeze({
  constants: ExecutiveJournalRuntimeValidationConstants,
  principles: ExecutiveJournalRuntimeValidationPrinciples,
  openIssues: ExecutiveJournalRuntimeValidationOpenIssues,
  ownership: ExecutiveJournalRuntimeValidationOwnership,
  boundaries: ExecutiveJournalRuntimeValidationBoundaries,
  readiness: ExecutiveJournalRuntimeValidationReadiness,
  nextPhase: ExecutiveJournalRuntimeValidationNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
