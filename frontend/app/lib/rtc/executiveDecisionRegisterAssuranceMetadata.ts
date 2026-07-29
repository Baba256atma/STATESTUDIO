/**
 * RTC-3:8 — Executive Decision Register Reconciliation & Assurance Metadata.
 *
 * Principles, decisions, AD-RTC3-08, boundaries, and unresolved open issues.
 *
 * Ownership: owned exclusively by RTC-3:8.
 */

import { ExecutiveDecisionRegisterExecution } from "./executiveDecisionRegisterExecution.ts";
import { ExecutiveDecisionRegisterAssuranceContracts } from "./executiveDecisionRegisterAssuranceContracts.ts";
import {
  ExecutiveDecisionRegisterAssuranceId,
  ExecutiveDecisionRegisterAssuranceName,
  ExecutiveDecisionRegisterAssuranceNamespace,
  ExecutiveDecisionRegisterAssuranceNextPhase,
  ExecutiveDecisionRegisterAssurancePreviousPhase,
  ExecutiveDecisionRegisterAssuranceReadiness,
  ExecutiveDecisionRegisterAssuranceStatus,
  ExecutiveDecisionRegisterAssuranceVersion,
} from "./executiveDecisionRegisterAssuranceIdentity.ts";
import {
  ExecutiveDecisionRegisterAssuranceEvidenceKinds,
  ExecutiveDecisionRegisterAssuranceLifecycle,
  ExecutiveDecisionRegisterAssuranceSubjectKinds,
} from "./executiveDecisionRegisterAssuranceLifecycle.ts";
import {
  ExecutiveDecisionRegisterAssuranceFindingCodes,
  ExecutiveDecisionRegisterAssuranceRules,
} from "./executiveDecisionRegisterAssuranceRules.ts";
import type { ExecutiveDecisionRegisterAssuranceArchitectureDecision } from "./executiveDecisionRegisterAssuranceTypes.ts";

/** Upstream AI prohibitions preserved by exact execution reference. */
export const ExecutiveDecisionRegisterAssuranceAiMustNot =
  ExecutiveDecisionRegisterExecution.aiMustNot;

/** AD-RTC3-06 preserved by exact upstream execution → enforcement reference. */
export const ExecutiveDecisionRegisterAssuranceUpstreamAdrtc306 =
  ExecutiveDecisionRegisterExecution.upstreamArchitectureDecision;

/** AD-RTC3-07 preserved by exact upstream execution reference. */
export const ExecutiveDecisionRegisterAssuranceUpstreamAdrtc307 =
  ExecutiveDecisionRegisterExecution.architectureDecision;

export const ExecutiveDecisionRegisterAssuranceUpstreamFoundationDecisions =
  ExecutiveDecisionRegisterExecution.upstreamFoundationDecisions;
export const ExecutiveDecisionRegisterAssuranceUpstreamRegistryDecisions =
  ExecutiveDecisionRegisterExecution.upstreamRegistryDecisions;
export const ExecutiveDecisionRegisterAssuranceUpstreamModelDecisions =
  ExecutiveDecisionRegisterExecution.upstreamModelDecisions;
export const ExecutiveDecisionRegisterAssuranceUpstreamValidationDecisions =
  ExecutiveDecisionRegisterExecution.upstreamValidationDecisions;
export const ExecutiveDecisionRegisterAssuranceUpstreamPolicyDecisions =
  ExecutiveDecisionRegisterExecution.upstreamPolicyDecisions;
export const ExecutiveDecisionRegisterAssuranceUpstreamEnforcementDecisions =
  ExecutiveDecisionRegisterExecution.upstreamEnforcementDecisions;
export const ExecutiveDecisionRegisterAssuranceUpstreamExecutionDecisions =
  ExecutiveDecisionRegisterExecution.decisions;

export const ExecutiveDecisionRegisterAssuranceOpenIssues = Object.freeze(
  ExecutiveDecisionRegisterExecution.openIssues.map((item) =>
    Object.freeze({
      issueId: item.issueId,
      issue: item.issue,
      requiredResolution: item.requiredResolution,
      accountableOwner: item.accountableOwner,
      resolved: false as const,
      resolvedByAssurance: false as const,
      sourcePhase: "RTC-3:1" as const,
      carriedByPhase: "RTC-3:8" as const,
    })
  ),
);

export const ExecutiveDecisionRegisterAssurancePrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-3:8/Principle/01",
    name: "Evidence only",
    description:
      "Assurance evaluates explicitly supplied immutable evidence and never fetches or invents facts.",
  }),
  Object.freeze({
    principleId: "RTC-3:8/Principle/02",
    name: "Detect, do not repair",
    description:
      "Mismatches are reported; intents, receipts, sequences, and keys are never repaired.",
  }),
  Object.freeze({
    principleId: "RTC-3:8/Principle/03",
    name: "NotAssured precedence",
    description:
      "NotAssured overrides Indeterminate, which overrides Assured; uncertainty never becomes Assured.",
  }),
  Object.freeze({
    principleId: "RTC-3:8/Principle/04",
    name: "No certification",
    description:
      "Assurance findings cannot authorize consumption, integration, deployment, or publication.",
  }),
  Object.freeze({
    principleId: "RTC-3:8/Principle/05",
    name: "No open-issue defaults",
    description:
      "OI-01 through OI-06 remain unresolved; missing unresolved decisions stay Indeterminate.",
  }),
  Object.freeze({
    principleId: "RTC-3:8/Principle/06",
    name: "Preserve upstream controls",
    description:
      "Append-only, authority, confirmation, privacy, projection, retention, and AI controls remain binding.",
  }),
] as const);

export const ExecutiveDecisionRegisterAssuranceDecisions = Object.freeze([
  Object.freeze({
    decisionId: "D-43",
    statement:
      "RTC-3:8 reconciles supplied execution evidence without executing, repairing, or persisting.",
  }),
  Object.freeze({
    decisionId: "D-44",
    statement:
      "Assurance requires exact reconciliation of request, plan, intent, batch, receipt, and evidence bindings.",
  }),
  Object.freeze({
    decisionId: "D-45",
    statement:
      "Unsupported or contradictory execution claims are not assured; missing or incomplete evidence remains indeterminate.",
  }),
  Object.freeze({
    decisionId: "D-46",
    statement:
      "Assurance preserves append-only, authority, confirmation, privacy, provenance, projection, and AI controls.",
  }),
  Object.freeze({
    decisionId: "D-47",
    statement:
      "Assurance findings are deterministic, immutable, and cannot authorize deployment or consumption.",
  }),
  Object.freeze({
    decisionId: "D-48",
    statement:
      "RTC-3:8 consumes the canonical execution-contract layer only through RTC-3:7.",
  }),
] as const);

/**
 * Canonical architecture decision AD-RTC3-08.
 * Authorizes ReadyForCertification and nextPhase RTC-3:9.
 * Does not modify AD-RTC3-06 or AD-RTC3-07.
 */
export const ExecutiveDecisionRegisterArchitectureDecisionAdrtc308:
  ExecutiveDecisionRegisterAssuranceArchitectureDecision = Object.freeze({
    decisionId: "AD-RTC3-08" as const,
    title: "Advance RTC-3 Assurance to Certification" as const,
    status: "Accepted" as const,
    decision:
      "RTC-3:8 is Reconciliation & Assurance. RTC-3:8 readiness is ReadyForCertification. RTC-3:9 is Certification & Release Readiness. Assurance does not itself certify or authorize consumption, integration, deployment, or publication.",
    rationale:
      "AD-RTC3-07 authorized ReadyForAssurance for RTC-3:7 and identified RTC-3:8 as Reconciliation & Assurance, but did not authorize ReadyForCertification or the RTC-3:9 Certification & Release Readiness next-phase relationship. RTC-3:8 therefore records AD-RTC3-08 to establish that gate explicitly without copying RTC-1 freeze or RTC-2 certification semantics into this phase.",
    consequences: Object.freeze([
      "RTC-3:8 remains metadata-only and side-effect free.",
      "RTC-3:8 may evaluate supplied evidence but cannot obtain evidence itself.",
      "RTC-3:8 may report mismatches but cannot repair them.",
      "RTC-1 and RTC-2 remain unchanged.",
      "RTC-3:9 remains metadata only in nextPhase; no RTC-3:9 files are created by this decision.",
      "AD-RTC3-06 and AD-RTC3-07 remain Accepted and unmodified.",
      "D-43 through D-48 remain unchanged.",
    ] as const),
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveDecisionRegisterAssuranceArchitectureDecisions =
  Object.freeze([
    ExecutiveDecisionRegisterArchitectureDecisionAdrtc308,
  ] as const);

export const ExecutiveDecisionRegisterAssuranceProhibitedSurfaces =
  Object.freeze([
    "React",
    "Next.js",
    "rendering",
    "Decision Journal APP-8 implementation",
    "database access",
    "event-store queries",
    "network access",
    "message brokers",
    "cryptographic verification",
    "executor queries",
    "evidence repair",
    "certification",
    "deployment authorization",
    "consumer integration authorization",
    "public-index publication",
    "resolve open issues OI-01 through OI-06",
    "system clock",
    "random identifiers",
  ] as const);

export const ExecutiveDecisionRegisterAssuranceOwnership = Object.freeze({
  ownershipId: "RTC-3:8/ExecutiveDecisionRegisterAssuranceOwnership",
  sourcePhase: "RTC-3:8" as const,
  ownedBy: "RTC-3:8" as const,
  consumes: "RTC-3:7/ExecutiveDecisionRegisterExecutionContract" as const,
  doesNotOwn: Object.freeze([
    "Execution intent construction",
    "Receipt fabrication",
    "Enforcement planning",
    "Policy evaluation",
    "Certification",
  ] as const),
  metadataOnly: true as const,
  immutable: true as const,
});

export const ExecutiveDecisionRegisterAssuranceBoundaries = Object.freeze({
  boundariesId: "RTC-3:8/ExecutiveDecisionRegisterAssuranceBoundaries",
  sourcePhase: "RTC-3:8" as const,
  sourceExecutionId: ExecutiveDecisionRegisterExecution.identity.id,
  sourceExecutionReadiness: ExecutiveDecisionRegisterExecution.readiness,
  evaluatesOnly: true as const,
  repairsEvidence: false as const,
  inventsEvidence: false as const,
  failClosed: true as const,
  preservesUpstreamReferences: true as const,
  preservesAdrtc306: true as const,
  preservesAdrtc307: true as const,
  openIssuesUnresolved: true as const,
  resolvesOpenIssues: false as const,
  createsAuthority: false as const,
  confirmsDecisions: false as const,
  certifies: false as const,
  authorizesConsumption: false as const,
  authorizesIntegration: false as const,
  authorizesDeployment: false as const,
  usesSystemClock: false as const,
  usesNetwork: false as const,
  usesRandomness: false as const,
  prohibitedSurfaces: ExecutiveDecisionRegisterAssuranceProhibitedSurfaces,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

export const ExecutiveDecisionRegisterAssuranceConstants = Object.freeze({
  phaseIdentifier: "RTC-3:8",
  canonicalIdentifier: ExecutiveDecisionRegisterAssuranceId,
  version: ExecutiveDecisionRegisterAssuranceVersion,
  name: ExecutiveDecisionRegisterAssuranceName,
  namespace: ExecutiveDecisionRegisterAssuranceNamespace,
  status: ExecutiveDecisionRegisterAssuranceStatus,
  readiness: ExecutiveDecisionRegisterAssuranceReadiness,
  previousPhase: ExecutiveDecisionRegisterAssurancePreviousPhase,
  nextPhase: ExecutiveDecisionRegisterAssuranceNextPhase,
  ruleCount: ExecutiveDecisionRegisterAssuranceRules.length,
  contractCount: ExecutiveDecisionRegisterAssuranceContracts.length,
  subjectKindCount: ExecutiveDecisionRegisterAssuranceSubjectKinds.length,
  evidenceKindCount: ExecutiveDecisionRegisterAssuranceEvidenceKinds.length,
  findingCodeCount: ExecutiveDecisionRegisterAssuranceFindingCodes.length,
  lifecycleStateCount: ExecutiveDecisionRegisterAssuranceLifecycle.stateCount,
  openIssueCount: ExecutiveDecisionRegisterAssuranceOpenIssues.length,
  decisionCount: ExecutiveDecisionRegisterAssuranceDecisions.length,
} as const);

export const ExecutiveDecisionRegisterAssuranceMetadata = Object.freeze({
  constants: ExecutiveDecisionRegisterAssuranceConstants,
  principles: ExecutiveDecisionRegisterAssurancePrinciples,
  decisions: ExecutiveDecisionRegisterAssuranceDecisions,
  architectureDecision: ExecutiveDecisionRegisterArchitectureDecisionAdrtc308,
  architectureDecisions:
    ExecutiveDecisionRegisterAssuranceArchitectureDecisions,
  architectureDecisionIds: Object.freeze([
    "AD-RTC3-06",
    "AD-RTC3-07",
    "AD-RTC3-08",
  ] as const),
  upstreamArchitectureDecisions: Object.freeze([
    ExecutiveDecisionRegisterAssuranceUpstreamAdrtc306,
    ExecutiveDecisionRegisterAssuranceUpstreamAdrtc307,
  ] as const),
  openIssues: ExecutiveDecisionRegisterAssuranceOpenIssues,
  ownership: ExecutiveDecisionRegisterAssuranceOwnership,
  boundaries: ExecutiveDecisionRegisterAssuranceBoundaries,
  readiness: ExecutiveDecisionRegisterAssuranceReadiness,
  previousPhase: ExecutiveDecisionRegisterAssurancePreviousPhase,
  nextPhase: ExecutiveDecisionRegisterAssuranceNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
