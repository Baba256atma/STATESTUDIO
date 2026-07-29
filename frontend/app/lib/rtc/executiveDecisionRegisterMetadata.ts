/**
 * RTC-3:1 — Executive Decision Register Foundation Metadata.
 *
 * Principles, architecture decisions, boundaries, and unresolved open issues.
 *
 * Ownership: owned exclusively by RTC-3:1.
 */

import {
  ExecutiveDecisionRegisterAiMay,
  ExecutiveDecisionRegisterAiMustNot,
  ExecutiveDecisionRegisterAppendOnlyRules,
  ExecutiveDecisionRegisterAuthorityNonSubstitutes,
  ExecutiveDecisionRegisterContracts,
  ExecutiveDecisionRegisterPrivateReflectionPromotionRequirements,
  ExecutiveDecisionRegisterProjectionNames,
  ExecutiveDecisionRegisterTelemetryAllowed,
  ExecutiveDecisionRegisterTelemetryForbidden,
} from "./executiveDecisionRegisterContracts.ts";
import { ExecutiveDecisionRegisterEvents } from "./executiveDecisionRegisterEvents.ts";
import {
  ExecutiveDecisionRegisterFoundationId,
  ExecutiveDecisionRegisterFoundationName,
  ExecutiveDecisionRegisterFoundationNamespace,
  ExecutiveDecisionRegisterFoundationNextPhase,
  ExecutiveDecisionRegisterFoundationReadiness,
  ExecutiveDecisionRegisterFoundationStatus,
  ExecutiveDecisionRegisterFoundationVersion,
} from "./executiveDecisionRegisterIdentity.ts";
import {
  EXECUTIVE_DECISION_REGISTER_LIFECYCLE_STATES,
  ExecutiveDecisionRegisterLifecycle,
} from "./executiveDecisionRegisterLifecycle.ts";

export const ExecutiveDecisionRegisterPrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-3:1/Principle/01",
    name: "Append-only history",
    description:
      "Decision history is append-only; corrections and supersessions preserve lineage.",
  }),
  Object.freeze({
    principleId: "RTC-3:1/Principle/02",
    name: "Authority before confirmation",
    description:
      "Consequential decision states require explicit authority_ref; titles and silence never substitute.",
  }),
  Object.freeze({
    principleId: "RTC-3:1/Principle/03",
    name: "Human confirmation only",
    description:
      "Only an authorized human may confirm an executive decision against an exact bound proposal.",
  }),
  Object.freeze({
    principleId: "RTC-3:1/Principle/04",
    name: "AI assistance without authority",
    description:
      "AI may draft and assist; AI proposals remain non-authoritative and cannot confirm or resolve.",
  }),
  Object.freeze({
    principleId: "RTC-3:1/Principle/05",
    name: "Provenance for every derived fact",
    description:
      "Projections preserve producing-event provenance and never create authority.",
  }),
  Object.freeze({
    principleId: "RTC-3:1/Principle/06",
    name: "No silent private promotion",
    description:
      "Private reflection must not silently become a Decision Register record.",
  }),
] as const);

export const ExecutiveDecisionRegisterFoundationDecisions = Object.freeze([
  Object.freeze({
    decisionId: "D-01",
    statement: "Decision history is append-only.",
  }),
  Object.freeze({
    decisionId: "D-02",
    statement: "Confirmation requires explicit human authority.",
  }),
  Object.freeze({
    decisionId: "D-03",
    statement: "Corrections and supersessions preserve historical lineage.",
  }),
  Object.freeze({
    decisionId: "D-04",
    statement: "AI proposals remain non-authoritative.",
  }),
  Object.freeze({
    decisionId: "D-05",
    statement:
      "Projections preserve provenance and cannot create authority.",
  }),
  Object.freeze({
    decisionId: "D-06",
    statement: "RTC-3:1 declares no runtime dependency on RTC-2.",
  }),
] as const);

export const ExecutiveDecisionRegisterOpenIssues = Object.freeze([
  Object.freeze({
    issueId: "OI-01",
    issue: "Official-register entry boundary",
    requiredResolution:
      "Which proposed decisions enter the official register by default?",
    accountableOwner: "Records / legal",
    resolved: false as const,
  }),
  Object.freeze({
    issueId: "OI-02",
    issue: "Authority source and latency",
    requiredResolution:
      "Required authority source and acceptable latency for mandates and delegations.",
    accountableOwner: "Executive governance",
    resolved: false as const,
  }),
  Object.freeze({
    issueId: "OI-03",
    issue: "Evidence preservation and pinning",
    requiredResolution:
      "Which evidence sources require preservation or content pinning?",
    accountableOwner: "Journal steward",
    resolved: false as const,
  }),
  Object.freeze({
    issueId: "OI-04",
    issue: "Privileged and regulated classification",
    requiredResolution:
      "How privileged and regulated decision classification is selected and enforced.",
    accountableOwner: "Privacy + legal",
    resolved: false as const,
  }),
  Object.freeze({
    issueId: "OI-05",
    issue: "Decision-outcome closure criteria",
    requiredResolution:
      "What evidence and authority close a decision with an outcome reference.",
    accountableOwner: "Executive governance",
    resolved: false as const,
  }),
  Object.freeze({
    issueId: "OI-06",
    issue: "Consumer discovery and future RTC-2 relationship",
    requiredResolution:
      "Whether and how RTC-3 may later consume RTC-2 metadata under separate authorization.",
    accountableOwner: "Architecture authority",
    resolved: false as const,
  }),
] as const);

export const ExecutiveDecisionRegisterOwnership = Object.freeze({
  ownershipId: "RTC-3:1/ExecutiveDecisionRegisterOwnership",
  sourcePhase: "RTC-3:1" as const,
  owns: Object.freeze([
    "Decision Register foundation identity",
    "Closed decision lifecycle vocabulary",
    "Canonical decision-event descriptors",
    "Authority, confirmation, privacy, and AI boundary contracts",
    "Append-only and provenance rules",
    "Open-issue register for RTC-3:1",
  ]),
  doesNotOwn: Object.freeze([
    "RTC-2 Executive Journal Runtime modules",
    "RTC-1 Public Index",
    "Decision Journal APP-8 implementation",
    "UI, React, or Next.js surfaces",
    "Event persistence or execution",
    "Authority-registry implementation",
    "OI-01 through OI-06 resolutions",
  ]),
  metadataOnly: true as const,
  immutable: true as const,
});

export const ExecutiveDecisionRegisterProhibitedSurfaces = Object.freeze([
  "RTC-2 modules",
  "RTC-1 Public Index",
  "React",
  "Next.js",
  "Decision Journal APP-8 implementation",
  "Executive UI",
  "components",
  "hooks",
  "stores",
  "API clients",
  "database or ORM modules",
  "network clients",
  "telemetry SDKs",
  "browser-only modules",
  "server-only modules",
  "dynamic loaders",
  "environment configuration",
  "clock providers",
  "randomness providers",
  "resolve open issues OI-01 through OI-06",
] as const);

export const ExecutiveDecisionRegisterBoundaries = Object.freeze({
  boundaryId: "RTC-3:1/ExecutiveDecisionRegisterBoundaries",
  sourcePhase: "RTC-3:1" as const,
  importsRtc2: false as const,
  importsRtc1: false as const,
  importsApp8: false as const,
  importsUi: false as const,
  usesNetwork: false as const,
  usesPersistence: false as const,
  usesSystemClock: false as const,
  usesRandomness: false as const,
  rtc2DeclaredAsPotentialFutureMetadataAuthority: true as const,
  rtc2DependencyRequiresSeparateAuthorization: true as const,
  appendOnlyRules: ExecutiveDecisionRegisterAppendOnlyRules,
  authorityNonSubstitutes: ExecutiveDecisionRegisterAuthorityNonSubstitutes,
  aiMay: ExecutiveDecisionRegisterAiMay,
  aiMustNot: ExecutiveDecisionRegisterAiMustNot,
  projectionNames: ExecutiveDecisionRegisterProjectionNames,
  telemetryAllowed: ExecutiveDecisionRegisterTelemetryAllowed,
  telemetryForbidden: ExecutiveDecisionRegisterTelemetryForbidden,
  privacyCategories: Object.freeze([
    "SharedExecutiveRecord",
    "RestrictedExecutiveRecord",
    "RegulatedOrPrivilegedRecord",
  ] as const),
  evidenceKinds: Object.freeze([
    "EvidenceReference",
    "VersionPinnedEvidence",
    "ContentAddressedEvidence",
    "UnavailableEvidence",
    "DisputedEvidence",
  ] as const),
  privateReflectionSilentPromotionForbidden: true as const,
  privateReflectionPromotionRequirements:
    ExecutiveDecisionRegisterPrivateReflectionPromotionRequirements,
  selectsLiveAuthorityRegistry: false as const,
  resolvesOpenIssues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

export const ExecutiveDecisionRegisterMetadata = Object.freeze({
  metadataId: "RTC-3:1/ExecutiveDecisionRegisterMetadata",
  foundationId: ExecutiveDecisionRegisterFoundationId,
  version: ExecutiveDecisionRegisterFoundationVersion,
  name: ExecutiveDecisionRegisterFoundationName,
  namespace: ExecutiveDecisionRegisterFoundationNamespace,
  status: ExecutiveDecisionRegisterFoundationStatus,
  readiness: ExecutiveDecisionRegisterFoundationReadiness,
  nextPhase: ExecutiveDecisionRegisterFoundationNextPhase,
  lifecycleState: "Declared" as const,
  lifecycleStateCount: EXECUTIVE_DECISION_REGISTER_LIFECYCLE_STATES.length,
  lifecycle: ExecutiveDecisionRegisterLifecycle,
  contractCount: ExecutiveDecisionRegisterContracts.length,
  eventCount: ExecutiveDecisionRegisterEvents.length,
  principleCount: ExecutiveDecisionRegisterPrinciples.length,
  decisionCount: ExecutiveDecisionRegisterFoundationDecisions.length,
  openIssueCount: ExecutiveDecisionRegisterOpenIssues.length,
  principles: ExecutiveDecisionRegisterPrinciples,
  decisions: ExecutiveDecisionRegisterFoundationDecisions,
  openIssues: ExecutiveDecisionRegisterOpenIssues,
  ownership: ExecutiveDecisionRegisterOwnership,
  boundaries: ExecutiveDecisionRegisterBoundaries,
  prohibitedSurfaces: ExecutiveDecisionRegisterProhibitedSurfaces,
  aiMustNot: ExecutiveDecisionRegisterAiMustNot,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
