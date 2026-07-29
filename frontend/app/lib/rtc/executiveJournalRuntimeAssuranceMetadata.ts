/**
 * RTC-2:8 — Executive Journal Runtime Reconciliation & Assurance Metadata.
 *
 * Principles, boundaries, and unresolved open issues.
 *
 * Ownership: owned exclusively by RTC-2:8.
 */

import { ExecutiveJournalRuntimeExecution } from "./executiveJournalRuntimeExecution.ts";
import { ExecutiveJournalRuntimeAssuranceContracts } from "./executiveJournalRuntimeAssuranceContracts.ts";
import {
  ExecutiveJournalRuntimeAssuranceId,
  ExecutiveJournalRuntimeAssuranceName,
  ExecutiveJournalRuntimeAssuranceNamespace,
  ExecutiveJournalRuntimeAssuranceNextPhase,
  ExecutiveJournalRuntimeAssurancePreviousPhase,
  ExecutiveJournalRuntimeAssuranceReadiness,
  ExecutiveJournalRuntimeAssuranceStatus,
  ExecutiveJournalRuntimeAssuranceVersion,
} from "./executiveJournalRuntimeAssuranceIdentity.ts";
import {
  ExecutiveJournalRuntimeAssuranceLifecycle,
  ExecutiveJournalRuntimeAssuranceSubjectKinds,
} from "./executiveJournalRuntimeAssuranceLifecycle.ts";
import { ExecutiveJournalRuntimeAssuranceRules } from "./executiveJournalRuntimeAssuranceRules.ts";

/** Upstream AI prohibitions preserved by reference through execution → enforcement. */
export const ExecutiveJournalAssuranceAiMustNot =
  ExecutiveJournalRuntimeExecution.aiMustNot;

export const ExecutiveJournalRuntimeAssuranceOpenIssues = Object.freeze(
  ExecutiveJournalRuntimeExecution.openIssues.map((item) =>
    Object.freeze({
      issueId: item.issueId,
      issue: item.issue,
      requiredResolution: item.requiredResolution,
      accountableOwner: item.accountableOwner,
      resolved: false as const,
      resolvedByAssurance: false as const,
      sourcePhase: "RTC-2:1" as const,
      carriedByPhase: "RTC-2:8" as const,
    })
  ),
);

export const ExecutiveJournalRuntimeAssurancePrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-2:8/Principle/01",
    name: "Evidence only",
    description:
      "Assurance evaluates explicitly supplied immutable evidence and never fetches or invents facts.",
  }),
  Object.freeze({
    principleId: "RTC-2:8/Principle/02",
    name: "Detect, do not repair",
    description:
      "Divergence is reported; records, sequences, and idempotency keys are never repaired.",
  }),
  Object.freeze({
    principleId: "RTC-2:8/Principle/03",
    name: "Invalid precedence",
    description:
      "Invalid overrides Divergent, Indeterminate, and Reconciled; lower results never hide higher ones.",
  }),
  Object.freeze({
    principleId: "RTC-2:8/Principle/04",
    name: "Metadata-only findings",
    description:
      "Findings never include payloads, private content, secrets, timestamps, or random identifiers.",
  }),
  Object.freeze({
    principleId: "RTC-2:8/Principle/05",
    name: "No open-issue defaults",
    description:
      "OI-01 through OI-06 remain unresolved; missing unresolved decisions stay Indeterminate.",
  }),
] as const);

export const ExecutiveJournalRuntimeAssuranceProhibitedSurfaces = Object.freeze([
  "React",
  "Next.js",
  "rendering",
  "Decision Journal APP-8 implementation",
  "database access",
  "event-store queries",
  "network access",
  "message brokers",
  "cryptographic verification",
  "replay engines",
  "recovery services",
  "export generation",
  "retention scheduling",
  "evidence repair",
  "resolve open issues OI-01 through OI-06",
  "system clock",
  "random identifiers",
] as const);

export const ExecutiveJournalRuntimeAssuranceOwnership = Object.freeze({
  ownershipId: "RTC-2:8/ExecutiveJournalRuntimeAssuranceOwnership",
  sourcePhase: "RTC-2:8" as const,
  owns: Object.freeze([
    "Assurance result vocabulary",
    "Finding severity and subject vocabularies",
    "Evidence-bundle contracts",
    "Reconciliation rules",
    "Deterministic assurance summaries",
  ]),
  doesNotOwn: Object.freeze([
    "Execution intents and receipts",
    "Enforcement planning",
    "Policy evaluation",
    "Actual cryptographic verification",
    "Replay or recovery execution",
    "OI-01 through OI-06 resolutions",
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

export const ExecutiveJournalRuntimeAssuranceBoundaries = Object.freeze({
  boundaryId: "RTC-2:8/ExecutiveJournalRuntimeAssuranceBoundaries",
  sourcePhase: "RTC-2:8" as const,
  acceptsOnlySuppliedEvidence: true as const,
  neverRepairs: true as const,
  neverFetches: true as const,
  neverVerifiesCryptography: true as const,
  failClosed: true as const,
  preservesUpstreamReferences: true as const,
  resolvesOpenIssues: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  usesRandomness: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

export const ExecutiveJournalRuntimeAssuranceMetadata = Object.freeze({
  metadataId: "RTC-2:8/ExecutiveJournalRuntimeAssuranceMetadata",
  assuranceId: ExecutiveJournalRuntimeAssuranceId,
  version: ExecutiveJournalRuntimeAssuranceVersion,
  name: ExecutiveJournalRuntimeAssuranceName,
  namespace: ExecutiveJournalRuntimeAssuranceNamespace,
  status: ExecutiveJournalRuntimeAssuranceStatus,
  readiness: ExecutiveJournalRuntimeAssuranceReadiness,
  previousPhase: ExecutiveJournalRuntimeAssurancePreviousPhase,
  nextPhase: ExecutiveJournalRuntimeAssuranceNextPhase,
  sourceExecution: ExecutiveJournalRuntimeExecution.identity.id,
  lifecycleState: ExecutiveJournalRuntimeAssuranceLifecycle.currentState,
  ruleCount: ExecutiveJournalRuntimeAssuranceRules.length,
  contractCount: ExecutiveJournalRuntimeAssuranceContracts.length,
  subjectKindCount: ExecutiveJournalRuntimeAssuranceSubjectKinds.length,
  openIssueCount: ExecutiveJournalRuntimeAssuranceOpenIssues.length,
  principleCount: ExecutiveJournalRuntimeAssurancePrinciples.length,
  principles: ExecutiveJournalRuntimeAssurancePrinciples,
  openIssues: ExecutiveJournalRuntimeAssuranceOpenIssues,
  ownership: ExecutiveJournalRuntimeAssuranceOwnership,
  boundaries: ExecutiveJournalRuntimeAssuranceBoundaries,
  prohibitedSurfaces: ExecutiveJournalRuntimeAssuranceProhibitedSurfaces,
  aiMustNot: ExecutiveJournalAssuranceAiMustNot,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
