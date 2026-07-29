/**
 * RTC-2:7 — Executive Journal Runtime Execution Contract Metadata.
 *
 * Principles, architecture decisions, boundaries, and unresolved open issues.
 *
 * Ownership: owned exclusively by RTC-2:7.
 */

import { ExecutiveJournalRuntimeEnforcement } from "./executiveJournalRuntimeEnforcement.ts";
import { ExecutiveJournalRuntimeExecutionContracts } from "./executiveJournalRuntimeExecutionContracts.ts";
import {
  ExecutiveJournalRuntimeExecutionArchitectureDivergence,
  ExecutiveJournalRuntimeExecutionId,
  ExecutiveJournalRuntimeExecutionName,
  ExecutiveJournalRuntimeExecutionNamespace,
  ExecutiveJournalRuntimeExecutionNextPhase,
  ExecutiveJournalRuntimeExecutionReadiness,
  ExecutiveJournalRuntimeExecutionStatus,
  ExecutiveJournalRuntimeExecutionVersion,
} from "./executiveJournalRuntimeExecutionIdentity.ts";
import {
  ExecutiveJournalRuntimeExecutionLifecycle,
  ExecutiveJournalRuntimeExecutionStepKinds,
} from "./executiveJournalRuntimeExecutionLifecycle.ts";
import { ExecutiveJournalRuntimeExecutionRules } from "./executiveJournalRuntimeExecutionRules.ts";
import type { ExecutiveJournalRuntimeArchitectureDecision } from "./executiveJournalRuntimeExecutionTypes.ts";

/** Upstream AI prohibitions preserved by reference through enforcement → policy. */
export const ExecutiveJournalExecutionAiMustNot =
  ExecutiveJournalRuntimeEnforcement.aiMustNot;

export const ExecutiveJournalRuntimeExecutionOpenIssues = Object.freeze(
  ExecutiveJournalRuntimeEnforcement.openIssues.map((item) =>
    Object.freeze({
      issueId: item.issueId,
      issue: item.issue,
      requiredResolution: item.requiredResolution,
      accountableOwner: item.accountableOwner,
      resolved: false as const,
      resolvedByExecution: false as const,
      sourcePhase: "RTC-2:1" as const,
      carriedByPhase: "RTC-2:7" as const,
    })
  ),
);

/**
 * Canonical architecture decision AD-RTC2-07.
 * Retains RTC-2:7 as Execution Contract with ReadyForAssurance readiness.
 */
export const ExecutiveJournalRuntimeArchitectureDecisionAdrtc207:
  ExecutiveJournalRuntimeArchitectureDecision = Object.freeze({
    decisionId: "AD-RTC2-07" as const,
    title:
      "Retain RTC-2:7 as Executive Journal Runtime Execution Contract" as const,
    decision:
      "RTC-2 intentionally diverges from the RTC-1:7 phase role. RTC-1:7 is a Certification gate, while RTC-2:7 is an Execution Contract that converts canonical enforceable plans into side-effect-free execution intents and explicit outcomes into receipts. This divergence is required because the Executive Journal runtime has append-only execution, idempotency, concurrency, atomic-batch, receipt, confirmation-binding, privacy, and AI-authority boundaries that must be modeled before reconciliation and certification. RTC-2:7 therefore remains ExecutionContract and advances to ReadyForAssurance, not ReadyForFreeze.",
    consequences: Object.freeze([
      "RTC-2:7 remains metadata-only and side-effect free.",
      "RTC-2:7 does not perform certification.",
      "RTC-2:7 does not perform persistence.",
      "RTC-2:8 is Reconciliation & Assurance, not RTC-1-style Freeze.",
      "RTC-2:9 remains Certification & Release Readiness.",
      "RTC-1 remains unchanged.",
      "The divergence is explicit, intentional, bounded to RTC-2, and testable.",
      "No RTC-2:1 control or open issue is changed.",
    ] as const),
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Architecture decisions owned by RTC-2:7. */
export const ExecutiveJournalRuntimeExecutionDecisions = Object.freeze([
  ExecutiveJournalRuntimeArchitectureDecisionAdrtc207,
] as const);

export const ExecutiveJournalRuntimeExecutionPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-2:7/Principle/01",
    name: "Contract only",
    description:
      "Execution-contract transforms describe intents and receipts; they never persist or mutate state.",
  }),
  Object.freeze({
    principleId: "RTC-2:7/Principle/02",
    name: "Enforceable only",
    description:
      "Blocked and AwaitingConfirmation results are rejected; only Enforceable plans form intents.",
  }),
  Object.freeze({
    principleId: "RTC-2:7/Principle/03",
    name: "Explicit outcomes",
    description:
      "Receipts require caller-supplied outcome evidence; RTC-2:7 never invents commit facts.",
  }),
  Object.freeze({
    principleId: "RTC-2:7/Principle/04",
    name: "Atomic batch integrity",
    description:
      "Partial commit cannot be Committed; uncertain outcomes are Indeterminate.",
  }),
  Object.freeze({
    principleId: "RTC-2:7/Principle/05",
    name: "No open-issue defaults",
    description:
      "OI-01 through OI-06 remain unresolved; execution rejects plans that require those defaults.",
  }),
] as const);

export const ExecutiveJournalRuntimeExecutionProhibitedSurfaces = Object.freeze([
  "React",
  "Next.js",
  "rendering",
  "Decision Journal APP-8 implementation",
  "authentication infrastructure",
  "live authority registry",
  "database access",
  "network access",
  "message brokers",
  "export generation",
  "retention scheduling",
  "cryptographic execution",
  "real journal append",
  "real timestamp generation",
  "resolve open issues OI-01 through OI-06",
  "system clock",
  "random identifiers",
] as const);

export const ExecutiveJournalRuntimeExecutionOwnership = Object.freeze({
  ownershipId: "RTC-2:7/ExecutiveJournalRuntimeExecutionOwnership",
  sourcePhase: "RTC-2:7" as const,
  owns: Object.freeze([
    "Execution intent vocabulary",
    "Execution receipt vocabulary",
    "Idempotency and concurrency contracts",
    "Atomic batch descriptors",
    "Outcome-to-receipt transforms",
  ]),
  doesNotOwn: Object.freeze([
    "Enforcement planning",
    "Policy evaluation",
    "Validation evaluation",
    "Model entities",
    "Registry resolution",
    "Foundation controls",
    "Actual persistence or messaging",
    "OI-01 through OI-06 resolutions",
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

export const ExecutiveJournalRuntimeExecutionBoundaries = Object.freeze({
  boundaryId: "RTC-2:7/ExecutiveJournalRuntimeExecutionBoundaries",
  sourcePhase: "RTC-2:7" as const,
  acceptsOnlyEnforceablePlans: true as const,
  neverExecutesIntents: true as const,
  neverInventOutcomes: true as const,
  failClosed: true as const,
  preservesUpstreamReferences: true as const,
  resolvesOpenIssues: false as const,
  createsAuthority: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  usesRandomness: false as const,
  selectsExportFormat: false as const,
  selectsRetentionPeriod: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

export const ExecutiveJournalRuntimeExecutionMetadata = Object.freeze({
  metadataId: "RTC-2:7/ExecutiveJournalRuntimeExecutionMetadata",
  executionId: ExecutiveJournalRuntimeExecutionId,
  version: ExecutiveJournalRuntimeExecutionVersion,
  name: ExecutiveJournalRuntimeExecutionName,
  namespace: ExecutiveJournalRuntimeExecutionNamespace,
  status: ExecutiveJournalRuntimeExecutionStatus,
  readiness: ExecutiveJournalRuntimeExecutionReadiness,
  nextPhase: ExecutiveJournalRuntimeExecutionNextPhase,
  architectureDivergence:
    ExecutiveJournalRuntimeExecutionArchitectureDivergence,
  architectureDecisionIds: Object.freeze(["AD-RTC2-07"] as const),
  sourceEnforcement: ExecutiveJournalRuntimeEnforcement.identity.id,
  lifecycleState: ExecutiveJournalRuntimeExecutionLifecycle.currentState,
  ruleCount: ExecutiveJournalRuntimeExecutionRules.length,
  contractCount: ExecutiveJournalRuntimeExecutionContracts.length,
  stepKindCount: ExecutiveJournalRuntimeExecutionStepKinds.length,
  openIssueCount: ExecutiveJournalRuntimeExecutionOpenIssues.length,
  principleCount: ExecutiveJournalRuntimeExecutionPrinciples.length,
  decisionCount: ExecutiveJournalRuntimeExecutionDecisions.length,
  principles: ExecutiveJournalRuntimeExecutionPrinciples,
  decisions: ExecutiveJournalRuntimeExecutionDecisions,
  openIssues: ExecutiveJournalRuntimeExecutionOpenIssues,
  ownership: ExecutiveJournalRuntimeExecutionOwnership,
  boundaries: ExecutiveJournalRuntimeExecutionBoundaries,
  prohibitedSurfaces: ExecutiveJournalRuntimeExecutionProhibitedSurfaces,
  aiMustNot: ExecutiveJournalExecutionAiMustNot,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
