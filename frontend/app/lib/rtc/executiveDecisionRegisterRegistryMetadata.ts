/**
 * RTC-3:2 — Executive Decision Register Registry Metadata.
 *
 * Principles, decisions, boundaries, and unresolved open issues carried
 * forward from RTC-3:1 without selecting defaults.
 *
 * Ownership: owned exclusively by RTC-3:2.
 */

import { ExecutiveDecisionRegisterFoundation } from "./executiveDecisionRegisterFoundation.ts";
import { ExecutiveDecisionRegisterRegistryContracts } from "./executiveDecisionRegisterRegistryContracts.ts";
import { ExecutiveDecisionRegisterRegistryCanonicalEntries } from "./executiveDecisionRegisterRegistryEntries.ts";
import {
  ExecutiveDecisionRegisterRegistryId,
  ExecutiveDecisionRegisterRegistryName,
  ExecutiveDecisionRegisterRegistryNamespace,
  ExecutiveDecisionRegisterRegistryNextPhase,
  ExecutiveDecisionRegisterRegistryReadiness,
  ExecutiveDecisionRegisterRegistryStatus,
  ExecutiveDecisionRegisterRegistryVersion,
} from "./executiveDecisionRegisterRegistryIdentity.ts";
import { ExecutiveDecisionRegisterRegistryLifecycle } from "./executiveDecisionRegisterRegistryLifecycle.ts";

/** Foundation AI prohibitions referenced unchanged (exact array reference). */
export const ExecutiveDecisionRegisterRegistryAiMustNot =
  ExecutiveDecisionRegisterFoundation.aiMustNot;

/** Foundation architecture decisions D-01…D-06 by exact reference. */
export const ExecutiveDecisionRegisterRegistryUpstreamDecisions =
  ExecutiveDecisionRegisterFoundation.foundationDecisions;

/**
 * Open issues carried forward unresolved from RTC-3:1.
 * RTC-3:2 MUST NOT resolve these through defaults or aliases.
 */
export const ExecutiveDecisionRegisterRegistryOpenIssues = Object.freeze(
  ExecutiveDecisionRegisterFoundation.openIssues.map((issue) =>
    Object.freeze({
      issueId: issue.issueId,
      issue: issue.issue,
      requiredResolution: issue.requiredResolution,
      accountableOwner: issue.accountableOwner,
      resolved: false as const,
      resolvedByRegistry: false as const,
      sourcePhase: "RTC-3:1" as const,
      carriedByPhase: "RTC-3:2" as const,
    })
  ),
);

/** Registry principles. */
export const ExecutiveDecisionRegisterRegistryPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-3:2/Principle/01",
    name: "Closed-world discovery",
    description:
      "Only explicitly registered identities may resolve; unknown and malformed queries fail closed.",
  }),
  Object.freeze({
    principleId: "RTC-3:2/Principle/02",
    name: "Exact object identity",
    description:
      "Successful resolution returns the canonical entry reference without cloning the foundation.",
  }),
  Object.freeze({
    principleId: "RTC-3:2/Principle/03",
    name: "Conflict rejection",
    description:
      "Duplicate control IDs, namespaces, and alias collisions make registration impossible.",
  }),
  Object.freeze({
    principleId: "RTC-3:2/Principle/04",
    name: "Preserve foundation controls",
    description:
      "The registry exposes RTC-3:1 controls by reference and MUST NOT weaken them.",
  }),
  Object.freeze({
    principleId: "RTC-3:2/Principle/05",
    name: "No open-issue resolution",
    description:
      "OI-01 through OI-06 remain unresolved; the registry selects no defaults for them.",
  }),
] as const);

/**
 * Registry-level architecture decisions D-07…D-12.
 * D-01…D-06 remain upstream foundation decisions by reference.
 */
export const ExecutiveDecisionRegisterRegistryDecisions = Object.freeze([
  Object.freeze({
    decisionId: "D-07",
    statement: "Registry is closed-world.",
  }),
  Object.freeze({
    decisionId: "D-08",
    statement:
      "RTC-3:1 is imported and preserved by exact reference.",
  }),
  Object.freeze({
    decisionId: "D-09",
    statement:
      "Duplicate identities, namespaces, and aliases fail deterministically.",
  }),
  Object.freeze({
    decisionId: "D-10",
    statement: "Registry sealing removes runtime registration.",
  }),
  Object.freeze({
    decisionId: "D-11",
    statement: "Resolution is metadata-only and side-effect free.",
  }),
  Object.freeze({
    decisionId: "D-12",
    statement:
      "RTC-3:2 creates no dependency on RTC-2, APP-8, or UI.",
  }),
] as const);

/** Surfaces the registry shall never own. */
export const ExecutiveDecisionRegisterRegistryProhibitedSurfaces = Object.freeze(
  [
    "React",
    "Next.js",
    "rendering",
    "RTC-2 modules",
    "RTC-1 Public Index",
    "Decision Journal APP-8 implementation",
    "resolve open issues OI-01 through OI-06",
    "weaken append-only controls",
    "weaken AI non-delegable boundary",
    "decision claim payload in routine telemetry",
    "network clients",
    "database clients",
    "dynamic module discovery",
    "runtime registration after seal",
  ] as const,
);

/** Ownership declaration. */
export const ExecutiveDecisionRegisterRegistryOwnership = Object.freeze({
  ownershipId: "RTC-3:2/ExecutiveDecisionRegisterRegistryOwnership",
  sourcePhase: "RTC-3:2" as const,
  owns: Object.freeze([
    "Canonical foundation registration",
    "Closed-world identity resolution",
    "Alias resolution to canonical entries",
    "Registration conflict rejection",
    "Deterministic registry summary",
  ] as const),
  doesNotOwn: ExecutiveDecisionRegisterRegistryProhibitedSurfaces,
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
export const ExecutiveDecisionRegisterRegistryBoundaries = Object.freeze({
  boundariesId: "RTC-3:2/ExecutiveDecisionRegisterRegistryBoundaries",
  sourcePhase: "RTC-3:2" as const,
  foundationControlsPreserved: Object.freeze([
    "appendOnly",
    "correctionsDoNotErase",
    "authority_ref required",
    "human confirmation required",
    "private reflection separate category",
    "producing-event provenance",
    "projection cannot create authority",
    "no decision claim payload in routine telemetry",
    "AI must not confirm decisions",
    "AI must not create authority",
    "AI must not make proposals authoritative",
    "AI must not resolve disputes",
    "AI must not supersede or close decisions",
    "AI must not change retention",
    "AI must not dispose records",
  ] as const),
  foundationAiMustNot: ExecutiveDecisionRegisterRegistryAiMustNot,
  foundationBoundaries: ExecutiveDecisionRegisterFoundation.boundaries,
  foundationLifecycle: ExecutiveDecisionRegisterFoundation.lifecycle,
  foundationEvents: ExecutiveDecisionRegisterFoundation.events,
  foundationDecisions: ExecutiveDecisionRegisterRegistryUpstreamDecisions,
  openIssuesUnresolved: true as const,
  prohibitedSurfaces: ExecutiveDecisionRegisterRegistryProhibitedSurfaces,
  dependencyRules: Object.freeze([
    "ImportRtc31FoundationOnly",
    "NoRtc2Imports",
    "NoRtc1PublicIndexImports",
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
export const ExecutiveDecisionRegisterRegistryConstants = Object.freeze({
  phaseIdentifier: "RTC-3:2",
  canonicalIdentifier: ExecutiveDecisionRegisterRegistryId,
  version: ExecutiveDecisionRegisterRegistryVersion,
  name: ExecutiveDecisionRegisterRegistryName,
  namespace: ExecutiveDecisionRegisterRegistryNamespace,
  status: ExecutiveDecisionRegisterRegistryStatus,
  readiness: ExecutiveDecisionRegisterRegistryReadiness,
  nextPhase: ExecutiveDecisionRegisterRegistryNextPhase,
  layer: "Runtime Layer",
  architecture: "NPA-T vNext",
  domain: "Executive Decision Register",
  entryCount: ExecutiveDecisionRegisterRegistryCanonicalEntries.length,
  contractCount: ExecutiveDecisionRegisterRegistryContracts.length,
  lifecycleStateCount: ExecutiveDecisionRegisterRegistryLifecycle.stateCount,
  openIssueCount: ExecutiveDecisionRegisterRegistryOpenIssues.length,
  principleCount: ExecutiveDecisionRegisterRegistryPrinciples.length,
  registryDecisionCount: ExecutiveDecisionRegisterRegistryDecisions.length,
} as const);

/** Publication metadata aggregate. */
export const ExecutiveDecisionRegisterRegistryMetadata = Object.freeze({
  constants: ExecutiveDecisionRegisterRegistryConstants,
  principles: ExecutiveDecisionRegisterRegistryPrinciples,
  decisions: ExecutiveDecisionRegisterRegistryDecisions,
  upstreamDecisions: ExecutiveDecisionRegisterRegistryUpstreamDecisions,
  openIssues: ExecutiveDecisionRegisterRegistryOpenIssues,
  ownership: ExecutiveDecisionRegisterRegistryOwnership,
  boundaries: ExecutiveDecisionRegisterRegistryBoundaries,
  readiness: ExecutiveDecisionRegisterRegistryReadiness,
  nextPhase: ExecutiveDecisionRegisterRegistryNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
