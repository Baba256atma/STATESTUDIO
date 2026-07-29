/**
 * RTC-3:9 — Executive Decision Register Certification Metadata.
 *
 * Principles, D-49 through D-54, AD-RTC3-09, boundaries, architecture-decision
 * preservation, OI-01 through OI-06 carry-forward, terminal decision marker.
 * No termination architecture decision and no RTC-3:10 are created here.
 *
 * Ownership: owned exclusively by RTC-3:9.
 */

import { ExecutiveDecisionRegisterAssurance } from "./executiveDecisionRegisterAssurance.ts";
import {
  ExecutiveDecisionRegisterCertificationId,
  ExecutiveDecisionRegisterCertificationPreviousPhase,
  ExecutiveDecisionRegisterCertificationReadiness,
  ExecutiveDecisionRegisterCertificationSourceAssurance,
  ExecutiveDecisionRegisterCertificationStatus,
  ExecutiveDecisionRegisterCertificationTerminalDecisionMarker,
} from "./executiveDecisionRegisterCertificationIdentity.ts";
import {
  SCOPED_TYPESCRIPT_POLICY_SOURCE,
  SCOPED_TYPESCRIPT_SUFFICIENT_FOR_CERTIFICATION,
} from "./executiveDecisionRegisterCertificationLifecycle.ts";
import type { ExecutiveDecisionRegisterCertificationArchitectureDecision } from "./executiveDecisionRegisterCertificationTypes.ts";

/** Exact upstream AD-RTC3-06 reference — unchanged. */
export const ExecutiveDecisionRegisterCertificationUpstreamAdrtc306 =
  ExecutiveDecisionRegisterAssurance.upstreamArchitectureDecisionAdrtc306;

/** Exact upstream AD-RTC3-07 reference — unchanged. */
export const ExecutiveDecisionRegisterCertificationUpstreamAdrtc307 =
  ExecutiveDecisionRegisterAssurance.upstreamArchitectureDecisionAdrtc307;

/** Exact upstream AD-RTC3-08 reference — unchanged. */
export const ExecutiveDecisionRegisterCertificationUpstreamAdrtc308 =
  ExecutiveDecisionRegisterAssurance.architectureDecision;

/**
 * Canonical architecture decision AD-RTC3-09.
 * Permits scoped TypeScript certification with truthful full-project disclosure.
 * Does not modify AD-RTC3-06, AD-RTC3-07, or AD-RTC3-08.
 * Does not authorize consumption, integration, deployment, or RTC-3:10.
 */
export const ExecutiveDecisionRegisterArchitectureDecisionAdrtc309:
  ExecutiveDecisionRegisterCertificationArchitectureDecision = Object.freeze({
    decisionId: "AD-RTC3-09" as const,
    title:
      "Permit RTC-3 Scoped TypeScript Certification with Full-Project Disclosure" as const,
    status: "Accepted" as const,
    decision:
      "RTC-3 certification may reach ReadyForAuthorization when every RTC-3 Blocking gate passes. RTC-3 scoped sources-and-tests strict TypeScript MUST pass. RTC-3 production-source TypeScript MUST pass. RTC-3 diagnostics MUST be zero. Full-project TypeScript status MUST be evaluated and truthfully disclosed. Unrelated full-project diagnostics do not block RTC-3 certification when they contain zero RTC-3 diagnostics. G-24 is therefore a Disclosure gate, not a Blocking gate. A full-project runner crash remains NotEvaluated, not Pass. Full-project diagnostics remain Fail, not Pass. Any RTC-3 diagnostic makes the applicable RTC-3 TypeScript Blocking gate fail and certification NotReady.",
    rationale:
      "RTC-3 must not claim ownership of unrelated project diagnostics. Scoped strict validation is authoritative for the RTC-3 package. Full-project health remains visible for governance and future remediation. Certification must distinguish component readiness from repository-wide health.",
    consequences: Object.freeze([
      "G-01 through G-23 remain Blocking.",
      "G-24 remains Disclosure-only.",
      "No diagnostic is suppressed or reclassified as success.",
      "No consumption, integration, deployment, Public Index, or RTC-3:10 authorization is granted.",
      "Human authorization remains required.",
      "RTC-1 and RTC-2 remain unchanged.",
      "AD-RTC3-06, AD-RTC3-07, and AD-RTC3-08 remain Accepted and unmodified.",
    ] as const),
    metadataOnly: true as const,
    immutable: true as const,
  });

export const ExecutiveDecisionRegisterCertificationArchitectureDecisions =
  Object.freeze([
    ExecutiveDecisionRegisterCertificationUpstreamAdrtc306,
    ExecutiveDecisionRegisterCertificationUpstreamAdrtc307,
    ExecutiveDecisionRegisterCertificationUpstreamAdrtc308,
    ExecutiveDecisionRegisterArchitectureDecisionAdrtc309,
  ] as const);

export const ExecutiveDecisionRegisterCertificationUpstreamFoundationDecisions =
  ExecutiveDecisionRegisterAssurance.upstreamFoundationDecisions;
export const ExecutiveDecisionRegisterCertificationUpstreamRegistryDecisions =
  ExecutiveDecisionRegisterAssurance.upstreamRegistryDecisions;
export const ExecutiveDecisionRegisterCertificationUpstreamModelDecisions =
  ExecutiveDecisionRegisterAssurance.upstreamModelDecisions;
export const ExecutiveDecisionRegisterCertificationUpstreamValidationDecisions =
  ExecutiveDecisionRegisterAssurance.upstreamValidationDecisions;
export const ExecutiveDecisionRegisterCertificationUpstreamPolicyDecisions =
  ExecutiveDecisionRegisterAssurance.upstreamPolicyDecisions;
export const ExecutiveDecisionRegisterCertificationUpstreamEnforcementDecisions =
  ExecutiveDecisionRegisterAssurance.upstreamEnforcementDecisions;
export const ExecutiveDecisionRegisterCertificationUpstreamExecutionDecisions =
  ExecutiveDecisionRegisterAssurance.upstreamExecutionDecisions;
export const ExecutiveDecisionRegisterCertificationUpstreamAssuranceDecisions =
  ExecutiveDecisionRegisterAssurance.decisions;

export const ExecutiveDecisionRegisterCertificationOpenIssues = Object.freeze(
  ExecutiveDecisionRegisterAssurance.openIssues.map((item) =>
    Object.freeze({
      issueId: item.issueId,
      issue: item.issue,
      requiredResolution: item.requiredResolution,
      accountableOwner: item.accountableOwner,
      resolved: false as const,
      resolvedByCertification: false as const,
      sourcePhase: "RTC-3:1" as const,
      carriedByPhase: "RTC-3:9" as const,
    })
  ),
);

export const ExecutiveDecisionRegisterCertificationPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-3:9/Principle/01",
    name: "Evidence only",
    description:
      "Certification evaluates explicitly supplied verification evidence and never generates missing facts.",
  }),
  Object.freeze({
    principleId: "RTC-3:9/Principle/02",
    name: "No authorization",
    description:
      "ReadyForAuthorization and ReadyForConsumer never authorize consumption, integration, or deployment.",
  }),
  Object.freeze({
    principleId: "RTC-3:9/Principle/03",
    name: "Truthful gates",
    description:
      "Failed and not-evaluated gates remain distinct and are recorded truthfully in the manifest.",
  }),
  Object.freeze({
    principleId: "RTC-3:9/Principle/04",
    name: "Scoped TypeScript disclosure",
    description:
      "Scoped RTC-3 TypeScript success does not rewrite unrelated full-project failures or runner crashes.",
  }),
  Object.freeze({
    principleId: "RTC-3:9/Principle/05",
    name: "Preserve upstream controls",
    description:
      "Authority, AI, privacy, append-only, provenance, projection, retention, and telemetry boundaries remain binding.",
  }),
  Object.freeze({
    principleId: "RTC-3:9/Principle/06",
    name: "No invented next phase",
    description:
      "RTC-3:9 creates no RTC-3:10 identity; nextPhaseDecisionRequired remains true until a separate AD.",
  }),
] as const);

export const ExecutiveDecisionRegisterCertificationDecisions = Object.freeze([
  Object.freeze({
    decisionId: "D-49",
    statement:
      "RTC-3:9 certifies supplied verification evidence but performs no execution, repair, authorization, or deployment.",
  }),
  Object.freeze({
    decisionId: "D-50",
    statement:
      "Every Blocking certification gate must pass before RTC-3 may be ReadyForAuthorization; Disclosure gates must be evaluated and recorded truthfully but do not block when an accepted architecture decision explicitly permits scoped certification.",
  }),
  Object.freeze({
    decisionId: "D-51",
    statement:
      "Not-evaluated and failed gates remain distinct and are recorded truthfully in the certification manifest.",
  }),
  Object.freeze({
    decisionId: "D-52",
    statement:
      "Scoped RTC-3 TypeScript success does not rewrite unrelated full-project failures or runner crashes.",
  }),
  Object.freeze({
    decisionId: "D-53",
    statement:
      "Certification preserves all upstream authority, AI, privacy, append-only, provenance, projection, retention, and telemetry boundaries.",
  }),
  Object.freeze({
    decisionId: "D-54",
    statement:
      "RTC-3:9 consumes the canonical assurance layer only through RTC-3:8 and creates no post-certification phase.",
  }),
] as const);

export const ExecutiveDecisionRegisterCertificationAiMustNot = Object.freeze([
  ...ExecutiveDecisionRegisterAssurance.aiMustNot,
  "authorize metadata consumption",
  "authorize integration",
  "authorize deployment",
  "create RTC-3:10",
  "record human authorization",
  "invent nextPhase",
  "reinterpret NotAssured as certifiable",
  "reinterpret Indeterminate as certifiable",
  "repair assurance evidence",
  "generate missing verification evidence",
] as const);

export const ExecutiveDecisionRegisterCertificationBoundaries = Object.freeze({
  certificationId: ExecutiveDecisionRegisterCertificationId,
  status: ExecutiveDecisionRegisterCertificationStatus,
  readiness: ExecutiveDecisionRegisterCertificationReadiness,
  previousPhase: ExecutiveDecisionRegisterCertificationPreviousPhase,
  sourceAssurance: ExecutiveDecisionRegisterCertificationSourceAssurance,
  nextPhaseDecisionRequired: true as const,
  nextPhase: null,
  terminalDecisionMarker:
    ExecutiveDecisionRegisterCertificationTerminalDecisionMarker,
  humanAuthorizationRequired: true as const,
  authorizationRecorded: false as const,
  consumptionAuthorized: false as const,
  integrationAuthorized: false as const,
  deploymentAuthorized: false as const,
  publicIndexAuthorized: false as const,
  rtc310CreationAuthorized: false as const,
  publicIndexPhase: false as const,
  scopedTypeScriptSufficientForCertification:
    SCOPED_TYPESCRIPT_SUFFICIENT_FOR_CERTIFICATION,
  scopedTypeScriptPolicySource: SCOPED_TYPESCRIPT_POLICY_SOURCE,
  openIssuesUnresolved: true as const,
  architectureDecisionsAcceptedUnchanged: true as const,
  metadataOnly: true as const,
  immutable: true as const,
} as const);

export const ExecutiveDecisionRegisterCertificationProhibitedSurfaces =
  Object.freeze([
    "React",
    "Next",
    "APP-8",
    "UI",
    "RTC-1 Public Index",
    "RTC-2 runtime consumption",
    "network",
    "database or persistence",
    "filesystem writes",
    "queues",
    "workers",
    "event buses",
    "process execution",
    "clock",
    "randomness",
    "deployment",
    "public-index publication",
  ] as const);

export const ExecutiveDecisionRegisterCertificationOwnership = Object.freeze({
  ownedBy: "RTC-3:9",
  identity: ExecutiveDecisionRegisterCertificationId,
  importsAssuranceOnly: true as const,
  importsRtc31ThroughRtc37Directly: false as const,
  metadataOnly: true as const,
} as const);

export const ExecutiveDecisionRegisterCertificationMetadata = Object.freeze({
  certificationId: ExecutiveDecisionRegisterCertificationId,
  principles: ExecutiveDecisionRegisterCertificationPrinciples,
  decisions: ExecutiveDecisionRegisterCertificationDecisions,
  architectureDecisions:
    ExecutiveDecisionRegisterCertificationArchitectureDecisions,
  architectureDecisionIds: Object.freeze([
    "AD-RTC3-06",
    "AD-RTC3-07",
    "AD-RTC3-08",
    "AD-RTC3-09",
  ] as const),
  architectureDecisionAdrtc309:
    ExecutiveDecisionRegisterArchitectureDecisionAdrtc309,
  openIssues: ExecutiveDecisionRegisterCertificationOpenIssues,
  ownership: ExecutiveDecisionRegisterCertificationOwnership,
  boundaries: ExecutiveDecisionRegisterCertificationBoundaries,
  prohibitedSurfaces: ExecutiveDecisionRegisterCertificationProhibitedSurfaces,
  aiMustNot: ExecutiveDecisionRegisterCertificationAiMustNot,
  upstreamFoundationDecisions:
    ExecutiveDecisionRegisterCertificationUpstreamFoundationDecisions,
  upstreamRegistryDecisions:
    ExecutiveDecisionRegisterCertificationUpstreamRegistryDecisions,
  upstreamModelDecisions:
    ExecutiveDecisionRegisterCertificationUpstreamModelDecisions,
  upstreamValidationDecisions:
    ExecutiveDecisionRegisterCertificationUpstreamValidationDecisions,
  upstreamPolicyDecisions:
    ExecutiveDecisionRegisterCertificationUpstreamPolicyDecisions,
  upstreamEnforcementDecisions:
    ExecutiveDecisionRegisterCertificationUpstreamEnforcementDecisions,
  upstreamExecutionDecisions:
    ExecutiveDecisionRegisterCertificationUpstreamExecutionDecisions,
  upstreamAssuranceDecisions:
    ExecutiveDecisionRegisterCertificationUpstreamAssuranceDecisions,
  metadataOnly: true as const,
  immutable: true as const,
} as const);
