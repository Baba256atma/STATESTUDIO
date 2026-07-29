/**
 * RTC-2:2 — Executive Journal Runtime Registry Metadata.
 *
 * Principles, decisions, boundaries, and unresolved open issues carried
 * forward from RTC-2:1 without selecting defaults.
 *
 * Ownership: owned exclusively by RTC-2:2.
 */

import { ExecutiveJournalRuntimeFoundation } from "./executiveJournalRuntimeFoundation.ts";
import {
  ExecutiveJournalRuntimeRegistryId,
  ExecutiveJournalRuntimeRegistryName,
  ExecutiveJournalRuntimeRegistryNamespace,
  ExecutiveJournalRuntimeRegistryNextPhase,
  ExecutiveJournalRuntimeRegistryReadiness,
  ExecutiveJournalRuntimeRegistryStatus,
  ExecutiveJournalRuntimeRegistryVersion,
} from "./executiveJournalRuntimeRegistryIdentity.ts";
import { ExecutiveJournalRuntimeRegistryContracts } from "./executiveJournalRuntimeRegistryContracts.ts";
import { ExecutiveJournalRuntimeRegistryCanonicalEntries } from "./executiveJournalRuntimeRegistryEntries.ts";
import { ExecutiveJournalRuntimeRegistryLifecycle } from "./executiveJournalRuntimeRegistryLifecycle.ts";

/** Foundation AI prohibitions referenced unchanged (exact array reference). */
export const ExecutiveJournalAiMustNot =
  ExecutiveJournalRuntimeFoundation.boundaries.aiMustNot;

/**
 * Open issues carried forward unresolved from RTC-2:1.
 * RTC-2:2 MUST NOT resolve these through defaults or aliases.
 */
export const ExecutiveJournalRuntimeRegistryOpenIssues = Object.freeze(
  ExecutiveJournalRuntimeFoundation.openIssues.map((issue) =>
    Object.freeze({
      issueId: issue.issueId,
      issue: issue.issue,
      requiredResolution: issue.requiredResolution,
      accountableOwner: issue.accountableOwner,
      resolved: false as const,
      resolvedByRegistry: false as const,
      sourcePhase: "RTC-2:1" as const,
      carriedByPhase: "RTC-2:2" as const,
    })
  ),
);

/** Registry principles. */
export const ExecutiveJournalRuntimeRegistryPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-2:2/Principle/01",
    name: "Closed-world discovery",
    description:
      "Only explicitly registered identities may resolve; unknown and malformed queries fail closed.",
  }),
  Object.freeze({
    principleId: "RTC-2:2/Principle/02",
    name: "Exact object identity",
    description:
      "Successful resolution returns the canonical entry reference without cloning the foundation.",
  }),
  Object.freeze({
    principleId: "RTC-2:2/Principle/03",
    name: "Conflict rejection",
    description:
      "Duplicate control IDs, namespaces, and alias collisions make registration impossible.",
  }),
  Object.freeze({
    principleId: "RTC-2:2/Principle/04",
    name: "Preserve foundation controls",
    description:
      "The registry exposes RTC-2:1 controls by reference and MUST NOT weaken them.",
  }),
  Object.freeze({
    principleId: "RTC-2:2/Principle/05",
    name: "No open-issue resolution",
    description:
      "OI-01 through OI-06 remain unresolved; the registry selects no defaults for them.",
  }),
] as const);

/** Registry-level decisions (non-product; structural only). */
export const ExecutiveJournalRuntimeRegistryDecisions = Object.freeze([
  Object.freeze({
    decisionId: "RTC-2:2/D-01",
    statement:
      "Register exactly one canonical RTC-2:1 foundation entry by import reference.",
  }),
  Object.freeze({
    decisionId: "RTC-2:2/D-02",
    statement:
      "Use ReadyForModel readiness vocabulary established by RTC-1:2.",
  }),
  Object.freeze({
    decisionId: "RTC-2:2/D-03",
    statement:
      "Return discriminated resolve results; never silent undefined for unknown identities.",
  }),
] as const);

/** Surfaces the registry shall never own. */
export const ExecutiveJournalRuntimeRegistryProhibitedSurfaces = Object.freeze([
  "React",
  "Next.js",
  "rendering",
  "Decision Journal APP-8 implementation",
  "resolve open issues OI-01 through OI-06",
  "weaken append-only controls",
  "weaken AI non-delegable boundary",
  "journal payload in routine telemetry",
  "network clients",
  "database clients",
  "dynamic module discovery",
] as const);

/** Ownership declaration. */
export const ExecutiveJournalRuntimeRegistryOwnership = Object.freeze({
  ownershipId: "RTC-2:2/ExecutiveJournalRuntimeRegistryOwnership",
  sourcePhase: "RTC-2:2" as const,
  owns: Object.freeze([
    "Canonical foundation registration",
    "Closed-world identity resolution",
    "Alias resolution to canonical entries",
    "Registration conflict rejection",
    "Deterministic registry summary",
  ] as const),
  doesNotOwn: ExecutiveJournalRuntimeRegistryProhibitedSurfaces,
  importsFoundationByReference: true as const,
  recreatesFoundationAggregate: false as const,
  ownsUi: false as const,
  ownsBusinessLogic: false as const,
  ownsAiAuthority: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Architectural boundaries. */
export const ExecutiveJournalRuntimeRegistryBoundaries = Object.freeze({
  boundariesId: "RTC-2:2/ExecutiveJournalRuntimeRegistryBoundaries",
  sourcePhase: "RTC-2:2" as const,
  foundationControlsPreserved: Object.freeze([
    "appendOnly",
    "correctionsDoNotErase",
    "authority_ref required",
    "integrity required",
    "private reflection separate category",
    "fail-closed disclosure",
    "no journal payload in routine telemetry",
    "explainable replayable projections",
    "AI must not confirm decisions",
    "AI must not create authority",
    "AI must not close commitments",
    "AI must not disclose restricted material",
    "AI must not alter retention state",
  ] as const),
  foundationAiMustNot: ExecutiveJournalAiMustNot,
  foundationBoundaries: ExecutiveJournalRuntimeFoundation.boundaries,
  openIssuesUnresolved: true as const,
  prohibitedSurfaces: ExecutiveJournalRuntimeRegistryProhibitedSurfaces,
  dependencyRules: Object.freeze([
    "ImportRtc21FoundationOnly",
    "NoDecisionJournalApp8Imports",
    "NoUiFrameworkImports",
    "NoReactOrNextImports",
    "NoNetworkOrPersistenceImports",
    "NoDynamicModuleDiscovery",
    "NoOpenIssueDefaults",
  ] as const),
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Foundation constants for publication. */
export const ExecutiveJournalRuntimeRegistryConstants = Object.freeze({
  phaseIdentifier: "RTC-2:2",
  canonicalIdentifier: ExecutiveJournalRuntimeRegistryId,
  version: ExecutiveJournalRuntimeRegistryVersion,
  name: ExecutiveJournalRuntimeRegistryName,
  namespace: ExecutiveJournalRuntimeRegistryNamespace,
  status: ExecutiveJournalRuntimeRegistryStatus,
  readiness: ExecutiveJournalRuntimeRegistryReadiness,
  nextPhase: ExecutiveJournalRuntimeRegistryNextPhase,
  layer: "Runtime Layer",
  architecture: "NPA-T vNext",
  domain: "Executive Journal Runtime",
  entryCount: ExecutiveJournalRuntimeRegistryCanonicalEntries.length,
  contractCount: ExecutiveJournalRuntimeRegistryContracts.length,
  lifecycleStateCount: ExecutiveJournalRuntimeRegistryLifecycle.stateCount,
  openIssueCount: ExecutiveJournalRuntimeRegistryOpenIssues.length,
  principleCount: ExecutiveJournalRuntimeRegistryPrinciples.length,
} as const);

/** Publication metadata aggregate. */
export const ExecutiveJournalRuntimeRegistryMetadata = Object.freeze({
  constants: ExecutiveJournalRuntimeRegistryConstants,
  principles: ExecutiveJournalRuntimeRegistryPrinciples,
  decisions: ExecutiveJournalRuntimeRegistryDecisions,
  openIssues: ExecutiveJournalRuntimeRegistryOpenIssues,
  ownership: ExecutiveJournalRuntimeRegistryOwnership,
  boundaries: ExecutiveJournalRuntimeRegistryBoundaries,
  readiness: ExecutiveJournalRuntimeRegistryReadiness,
  nextPhase: ExecutiveJournalRuntimeRegistryNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
