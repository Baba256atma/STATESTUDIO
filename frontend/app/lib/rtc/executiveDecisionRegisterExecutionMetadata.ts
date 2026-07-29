/**
 * RTC-3:7 — Executive Decision Register Execution Contract Metadata.
 *
 * Principles, decisions, AD-RTC3-07, boundaries, and unresolved open issues.
 *
 * Ownership: owned exclusively by RTC-3:7.
 */

import { ExecutiveDecisionRegisterEnforcement } from "./executiveDecisionRegisterEnforcement.ts";
import { ExecutiveDecisionRegisterExecutionContracts } from "./executiveDecisionRegisterExecutionContracts.ts";
import {
  ExecutiveDecisionRegisterExecutionId,
  ExecutiveDecisionRegisterExecutionName,
  ExecutiveDecisionRegisterExecutionNamespace,
  ExecutiveDecisionRegisterExecutionNextPhase,
  ExecutiveDecisionRegisterExecutionReadiness,
  ExecutiveDecisionRegisterExecutionStatus,
  ExecutiveDecisionRegisterExecutionVersion,
} from "./executiveDecisionRegisterExecutionIdentity.ts";
import {
  ExecutiveDecisionRegisterExecutionLifecycle,
  ExecutiveDecisionRegisterExecutionStepKinds,
} from "./executiveDecisionRegisterExecutionLifecycle.ts";
import { ExecutiveDecisionRegisterExecutionRules } from "./executiveDecisionRegisterExecutionRules.ts";
import type { ExecutiveDecisionRegisterArchitectureDecision } from "./executiveDecisionRegisterExecutionTypes.ts";

/** Upstream AI prohibitions preserved by exact enforcement reference. */
export const ExecutiveDecisionRegisterExecutionAiMustNot =
  ExecutiveDecisionRegisterEnforcement.aiMustNot;

/** AD-RTC3-06 preserved by exact upstream enforcement reference. */
export const ExecutiveDecisionRegisterExecutionUpstreamArchitectureDecision =
  ExecutiveDecisionRegisterEnforcement.architectureDecision;

/** D-01…D-36 preserved through the upstream chain. */
export const ExecutiveDecisionRegisterExecutionUpstreamFoundationDecisions =
  ExecutiveDecisionRegisterEnforcement.upstreamFoundationDecisions;
export const ExecutiveDecisionRegisterExecutionUpstreamRegistryDecisions =
  ExecutiveDecisionRegisterEnforcement.upstreamRegistryDecisions;
export const ExecutiveDecisionRegisterExecutionUpstreamModelDecisions =
  ExecutiveDecisionRegisterEnforcement.upstreamModelDecisions;
export const ExecutiveDecisionRegisterExecutionUpstreamValidationDecisions =
  ExecutiveDecisionRegisterEnforcement.upstreamValidationDecisions;
export const ExecutiveDecisionRegisterExecutionUpstreamPolicyDecisions =
  ExecutiveDecisionRegisterEnforcement.upstreamPolicyDecisions;
export const ExecutiveDecisionRegisterExecutionUpstreamEnforcementDecisions =
  ExecutiveDecisionRegisterEnforcement.decisions;

/**
 * Open issues carried forward unresolved from RTC-3:1 through RTC-3:6.
 * RTC-3:7 MUST NOT resolve these through defaults.
 */
export const ExecutiveDecisionRegisterExecutionOpenIssues = Object.freeze(
  ExecutiveDecisionRegisterEnforcement.openIssues.map((item) =>
    Object.freeze({
      issueId: item.issueId,
      issue: item.issue,
      requiredResolution: item.requiredResolution,
      accountableOwner: item.accountableOwner,
      resolved: false as const,
      resolvedByExecution: false as const,
      sourcePhase: "RTC-3:1" as const,
      carriedByPhase: "RTC-3:7" as const,
    })
  ),
);

export const ExecutiveDecisionRegisterExecutionPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-3:7/Principle/01",
    name: "Contract only",
    description:
      "Execution-contract transforms describe intents and receipts; they never persist or mutate state.",
  }),
  Object.freeze({
    principleId: "RTC-3:7/Principle/02",
    name: "Enforceable only",
    description:
      "Blocked and AwaitingConfirmation results are rejected; only Enforceable plans form intents.",
  }),
  Object.freeze({
    principleId: "RTC-3:7/Principle/03",
    name: "Explicit outcomes",
    description:
      "Receipts require caller-supplied outcome evidence; RTC-3:7 never invents commit facts.",
  }),
  Object.freeze({
    principleId: "RTC-3:7/Principle/04",
    name: "Atomic batch integrity",
    description:
      "Partial commit cannot be Committed; uncertain outcomes are Indeterminate.",
  }),
  Object.freeze({
    principleId: "RTC-3:7/Principle/05",
    name: "No open-issue defaults",
    description:
      "OI-01 through OI-06 remain unresolved; execution rejects plans that require those defaults.",
  }),
  Object.freeze({
    principleId: "RTC-3:7/Principle/06",
    name: "Idempotency and concurrency fail closed",
    description:
      "Same key with different digest is Conflict; expected sequence is never silently rebased.",
  }),
] as const);

export const ExecutiveDecisionRegisterExecutionDecisions = Object.freeze([
  Object.freeze({
    decisionId: "D-37",
    statement:
      "RTC-3:7 defines execution boundaries but performs no execution or side effects.",
  }),
  Object.freeze({
    decisionId: "D-38",
    statement:
      "Only RTC-3:6 Enforceable plans may become Executable intents.",
  }),
  Object.freeze({
    decisionId: "D-39",
    statement:
      "Idempotency binds the canonical key and plan digest; mismatched reuse is a conflict.",
  }),
  Object.freeze({
    decisionId: "D-40",
    statement:
      "Concurrency conflicts fail closed and are never silently rebased.",
  }),
  Object.freeze({
    decisionId: "D-41",
    statement:
      "Receipts require explicit external outcome evidence; uncertainty produces Indeterminate.",
  }),
  Object.freeze({
    decisionId: "D-42",
    statement:
      "RTC-3:7 consumes the canonical enforcement layer only through RTC-3:6.",
  }),
] as const);

/**
 * Canonical architecture decision AD-RTC3-07.
 * Authorizes ReadyForAssurance and nextPhase RTC-3:8.
 * Does not modify AD-RTC3-06 or renumber D-37 through D-42.
 */
export const ExecutiveDecisionRegisterArchitectureDecisionAdrtc307:
  ExecutiveDecisionRegisterArchitectureDecision = Object.freeze({
    decisionId: "AD-RTC3-07" as const,
    title:
      "Advance RTC-3 Execution Contract to Reconciliation and Assurance" as const,
    status: "Accepted" as const,
    decision:
      "RTC-3:7 remains ExecutionContract. RTC-3:7 readiness is ReadyForAssurance. RTC-3:8 is Reconciliation & Assurance. RTC-3:7 does not claim certification or execution success.",
    rationale:
      "AD-RTC3-06 authorized ReadyForExecutionContract for RTC-3:6 and identified RTC-3:7 as the intended ExecutionContract phase, but did not authorize ReadyForAssurance or the RTC-3:8 Reconciliation & Assurance next-phase relationship. RTC-3:7 therefore records AD-RTC3-07 to establish that gate explicitly, mirroring the RTC-2:7 → RTC-2:8 assurance transition without copying RTC-1 certification semantics.",
    consequences: Object.freeze([
      "RTC-3:7 remains metadata-only and side-effect free.",
      "Execution occurs only in an external authorized executor.",
      "Receipts require explicit external outcome evidence.",
      "RTC-1 and RTC-2 remain unchanged.",
      "RTC-3:8 is metadata only in nextPhase; no RTC-3:8 files are created by this decision.",
      "AD-RTC3-06 remains Accepted and unmodified.",
      "D-37 through D-42 remain unchanged.",
    ] as const),
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveDecisionRegisterExecutionArchitectureDecisions =
  Object.freeze([
    ExecutiveDecisionRegisterArchitectureDecisionAdrtc307,
  ] as const);

export const ExecutiveDecisionRegisterExecutionProhibitedSurfaces =
  Object.freeze([
    "React",
    "Next.js",
    "rendering",
    "RTC-2 modules",
    "RTC-1 Public Index",
    "Decision Journal APP-8 implementation",
    "direct RTC-3:5 runtime import",
    "direct RTC-3:4 runtime import",
    "direct RTC-3:3 runtime import",
    "direct RTC-3:2 runtime import",
    "direct RTC-3:1 runtime import",
    "authentication infrastructure",
    "live authority registry",
    "database access",
    "network access",
    "message brokers",
    "queues",
    "workers",
    "event buses",
    "export generation",
    "retention scheduling",
    "plan execution",
    "resolve open issues OI-01 through OI-06",
    "system clock",
    "random identifiers",
    "decision payload inspection",
  ] as const);

export const ExecutiveDecisionRegisterExecutionOwnership = Object.freeze({
  ownershipId: "RTC-3:7/ExecutiveDecisionRegisterExecutionOwnership",
  sourcePhase: "RTC-3:7" as const,
  owns: Object.freeze([
    "Execution intent vocabulary",
    "Execution receipt vocabulary",
    "Atomic batch contract",
    "Idempotency and concurrency bindings",
    "Local decisions D-37 through D-42",
    "Architecture decision AD-RTC3-07",
  ]),
  doesNotOwn: Object.freeze([
    "Enforcement planning",
    "Policy evaluation",
    "Validation evaluation",
    "Plan execution",
    "Persistence",
    "Certification",
    "OI-01 through OI-06 resolutions",
  ]),
  importsEnforcementByReference: true as const,
  importsPolicyDirectly: false as const,
  ownsExecution: false as const,
  ownsPersistence: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

export const ExecutiveDecisionRegisterExecutionBoundaries = Object.freeze({
  boundariesId: "RTC-3:7/ExecutiveDecisionRegisterExecutionBoundaries",
  sourcePhase: "RTC-3:7" as const,
  sourceEnforcementId: ExecutiveDecisionRegisterEnforcement.identity.id,
  sourceEnforcementReadiness: ExecutiveDecisionRegisterEnforcement.readiness,
  acceptsOnlyEnforceablePlans: true as const,
  neverExecutesIntents: true as const,
  inventsOutcomes: false as const,
  failClosed: true as const,
  preservesUpstreamReferences: true as const,
  preservesAdrtc306: true as const,
  openIssuesUnresolved: true as const,
  resolvesOpenIssues: false as const,
  createsAuthority: false as const,
  confirmsDecisions: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  usesRandomness: false as const,
  prohibitedSurfaces: ExecutiveDecisionRegisterExecutionProhibitedSurfaces,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

export const ExecutiveDecisionRegisterExecutionConstants = Object.freeze({
  phaseIdentifier: "RTC-3:7",
  canonicalIdentifier: ExecutiveDecisionRegisterExecutionId,
  version: ExecutiveDecisionRegisterExecutionVersion,
  name: ExecutiveDecisionRegisterExecutionName,
  namespace: ExecutiveDecisionRegisterExecutionNamespace,
  status: ExecutiveDecisionRegisterExecutionStatus,
  readiness: ExecutiveDecisionRegisterExecutionReadiness,
  nextPhase: ExecutiveDecisionRegisterExecutionNextPhase,
  ruleCount: ExecutiveDecisionRegisterExecutionRules.length,
  contractCount: ExecutiveDecisionRegisterExecutionContracts.length,
  stepKindCount: ExecutiveDecisionRegisterExecutionStepKinds.length,
  lifecycleStateCount: ExecutiveDecisionRegisterExecutionLifecycle.stateCount,
  openIssueCount: ExecutiveDecisionRegisterExecutionOpenIssues.length,
  decisionCount: ExecutiveDecisionRegisterExecutionDecisions.length,
} as const);

export const ExecutiveDecisionRegisterExecutionMetadata = Object.freeze({
  constants: ExecutiveDecisionRegisterExecutionConstants,
  principles: ExecutiveDecisionRegisterExecutionPrinciples,
  decisions: ExecutiveDecisionRegisterExecutionDecisions,
  architectureDecision: ExecutiveDecisionRegisterArchitectureDecisionAdrtc307,
  architectureDecisions:
    ExecutiveDecisionRegisterExecutionArchitectureDecisions,
  architectureDecisionIds: Object.freeze([
    "AD-RTC3-06",
    "AD-RTC3-07",
  ] as const),
  upstreamArchitectureDecision:
    ExecutiveDecisionRegisterExecutionUpstreamArchitectureDecision,
  openIssues: ExecutiveDecisionRegisterExecutionOpenIssues,
  ownership: ExecutiveDecisionRegisterExecutionOwnership,
  boundaries: ExecutiveDecisionRegisterExecutionBoundaries,
  readiness: ExecutiveDecisionRegisterExecutionReadiness,
  nextPhase: ExecutiveDecisionRegisterExecutionNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
