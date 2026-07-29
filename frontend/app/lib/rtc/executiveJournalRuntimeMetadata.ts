/**
 * RTC-2:1 — Executive Journal Runtime Metadata.
 *
 * Principles, responsibilities, guarantees, consumers, capture sources,
 * event families, information classes, decisions, open issues, ownership,
 * and prohibited surfaces. Metadata only.
 *
 * Ownership: owned exclusively by RTC-2:1.
 */

import {
  ExecutiveJournalRuntimeFoundationId,
  ExecutiveJournalRuntimeFoundationName,
  ExecutiveJournalRuntimeFoundationNamespace,
  ExecutiveJournalRuntimeFoundationNextPhase,
  ExecutiveJournalRuntimeFoundationReadiness,
  ExecutiveJournalRuntimeFoundationStatus,
  ExecutiveJournalRuntimeFoundationVersion,
  ExecutiveJournalRuntimeIdentity,
} from "./executiveJournalRuntimeIdentity.ts";
import { ExecutiveJournalRuntimeContracts } from "./executiveJournalRuntimeContracts.ts";
import { ExecutiveJournalRuntimeEvents } from "./executiveJournalRuntimeEvents.ts";
import { ExecutiveJournalRuntimeLifecycle } from "./executiveJournalRuntimeLifecycle.ts";
import type {
  ExecutiveJournalCaptureSourceDeclaration,
  ExecutiveJournalRuntimeConsumerDeclaration,
  ExecutiveJournalRuntimeConsumerName,
} from "./executiveJournalRuntimeTypes.ts";

const consumer = (
  consumerName: ExecutiveJournalRuntimeConsumerName,
  order: number,
): ExecutiveJournalRuntimeConsumerDeclaration =>
  Object.freeze({
    consumerId: `RTC-2:1/Consumer/${consumerName}` as const,
    consumerName,
    accessMode: "ReadOnly" as const,
    mayMutateJournal: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

const capture = (
  category: ExecutiveJournalCaptureSourceDeclaration["category"],
  action: string,
  description: string,
  order: number,
): ExecutiveJournalCaptureSourceDeclaration =>
  Object.freeze({
    sourceId: `RTC-2:1/Capture/${category}/${action}` as const,
    category,
    action,
    description,
    mayAcceptAsDecision: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Foundation design principles (§1.4). */
export const ExecutiveJournalRuntimePrinciples = Object.freeze([
  Object.freeze({
    principleId: "RTC-2:1/Principle/01",
    name: "Authority before automation",
    description:
      "No action becomes official until an authorized human or policy-bound service attests to it.",
  }),
  Object.freeze({
    principleId: "RTC-2:1/Principle/02",
    name: "Append, do not rewrite",
    description:
      "Corrections supersede prior events; they do not erase them.",
  }),
  Object.freeze({
    principleId: "RTC-2:1/Principle/03",
    name: "Minimum necessary capture",
    description:
      "Store the smallest durable evidence needed for continuity and accountability.",
  }),
  Object.freeze({
    principleId: "RTC-2:1/Principle/04",
    name: "Private by construction",
    description:
      "Private reflection is a distinct record category, not a visibility flag on shared content.",
  }),
  Object.freeze({
    principleId: "RTC-2:1/Principle/05",
    name: "Explain every projection",
    description:
      "Each displayed fact links to the events and sources that produced it.",
  }),
  Object.freeze({
    principleId: "RTC-2:1/Principle/06",
    name: "Graceful uncertainty",
    description:
      "Unknown, disputed, and pending states remain explicit; the runtime does not force false closure.",
  }),
] as const);

/** Runtime capabilities / responsibilities (§1.1). */
export const ExecutiveJournalRuntimeResponsibilities = Object.freeze([
  "Capture",
  "Validate",
  "Persist",
  "Project",
  "Disclose",
  "Recover",
] as const);

/** Normative guarantees (§5.1). */
export const ExecutiveJournalRuntimeGuarantees = Object.freeze([
  "Durability",
  "Integrity",
  "Determinism",
  "Isolation",
  "Traceability",
  "Recoverability",
  "Reversibility",
] as const);

/** Surfaces and behaviors Foundation shall never own (§1.3, §4.3, UI ban). */
export const ExecutiveJournalRuntimeProhibitedSurfaces = Object.freeze([
  "continuous employee monitoring",
  "sentiment scoring",
  "covert capture",
  "infer approval from silence",
  "edit history in place",
  "delete outside disposition",
  "autonomous commitments",
  "autonomous delegation",
  "autonomous disclosure",
  "autonomous external communication",
  "AI confirm decisions",
  "AI create authority",
  "AI close commitments",
  "AI disclose restricted material",
  "AI alter retention state",
  "replace finance system of record",
  "replace HR system of record",
  "replace legal system of record",
  "journal payload in routine telemetry",
  "React",
  "Next.js",
  "rendering",
  "animations",
  "Decision Journal APP-8 implementation",
] as const);

/** Foundation event families with representative types (§3.2). */
export const ExecutiveJournalEventFamilies = Object.freeze([
  Object.freeze({
    familyId: "RTC-2:1/Family/Intent",
    familyName: "Intent" as const,
    representativeTypes: Object.freeze([
      "intent.recorded",
      "objective.reframed",
      "constraint.declared",
    ]),
    projection: "Executive context",
  }),
  Object.freeze({
    familyId: "RTC-2:1/Family/Decision",
    familyName: "Decision" as const,
    representativeTypes: Object.freeze([
      "decision.proposed",
      "decision.confirmed",
      "decision.superseded",
      "decision.disputed",
    ]),
    projection: "Decision register",
  }),
  Object.freeze({
    familyId: "RTC-2:1/Family/Commitment",
    familyName: "Commitment" as const,
    representativeTypes: Object.freeze([
      "commitment.created",
      "owner.changed",
      "due_date.changed",
      "commitment.closed",
    ]),
    projection: "Commitment ledger",
  }),
  Object.freeze({
    familyId: "RTC-2:1/Family/RiskException",
    familyName: "RiskException" as const,
    representativeTypes: Object.freeze([
      "risk.raised",
      "risk.accepted",
      "exception.granted",
      "escalation.opened",
    ]),
    projection: "Risk/exception register",
  }),
  Object.freeze({
    familyId: "RTC-2:1/Family/Outcome",
    familyName: "Outcome" as const,
    representativeTypes: Object.freeze([
      "outcome.observed",
      "metric.attested",
      "benefit.realized",
      "lesson.recorded",
    ]),
    projection: "Outcome timeline",
  }),
  Object.freeze({
    familyId: "RTC-2:1/Family/Governance",
    familyName: "Governance" as const,
    representativeTypes: Object.freeze([
      "access.granted",
      "disclosure.exported",
      "correction.applied",
      "retention.disposed",
    ]),
    projection: "Control evidence",
  }),
] as const);

/** Information classes (§4.2). */
export const ExecutiveJournalInformationClasses = Object.freeze([
  Object.freeze({
    classId: "RTC-2:1/InfoClass/PrivateReflection",
    className: "PrivateReflection" as const,
    defaultAudience: "Originating executive only",
    keyTreatment:
      "Separate encryption and index; never used for automated action without explicit promotion",
  }),
  Object.freeze({
    classId: "RTC-2:1/InfoClass/RestrictedWorking",
    className: "RestrictedWorking" as const,
    defaultAudience: "Named collaborators and approved services",
    keyTreatment: "Purpose-bound access; no broad discovery",
  }),
  Object.freeze({
    classId: "RTC-2:1/InfoClass/ExecutiveRecord",
    className: "ExecutiveRecord" as const,
    defaultAudience: "Authorized leadership and control functions",
    keyTreatment: "Canonical, retained, reportable, export-controlled",
  }),
  Object.freeze({
    classId: "RTC-2:1/InfoClass/RegulatedPrivileged",
    className: "RegulatedPrivileged" as const,
    defaultAudience: "Explicitly entitled roles only",
    keyTreatment:
      "Jurisdiction, legal hold, redaction, and export restrictions",
  }),
] as const);

/**
 * Decisions proposed for ratification (§8.1).
 * Encoded as foundation control positions; product features MUST NOT weaken them.
 */
export const ExecutiveJournalFoundationDecisions = Object.freeze([
  Object.freeze({
    decisionId: "D-01",
    statement: "Adopt append-only events as the canonical executive-journal record.",
  }),
  Object.freeze({
    decisionId: "D-02",
    statement: "Treat private reflection as a separately governed record category.",
  }),
  Object.freeze({
    decisionId: "D-03",
    statement:
      "Require explicit authority reference for consequential events.",
  }),
  Object.freeze({
    decisionId: "D-04",
    statement:
      "Constrain AI to proposal and assistance roles at control boundaries.",
  }),
  Object.freeze({
    decisionId: "D-05",
    statement:
      "Require deterministic replay and provenance for every projection.",
  }),
  Object.freeze({
    decisionId: "D-06",
    statement:
      "Begin with a narrow, reversible pilot before enterprise integration.",
  }),
] as const);

/**
 * Open issues requiring owners (§8.2).
 * Foundation MUST NOT invent resolutions for these.
 */
export const ExecutiveJournalOpenIssues = Object.freeze([
  Object.freeze({
    issueId: "OI-01",
    issue: "Record boundary",
    requiredResolution:
      "Which executive actions become official records by default?",
    accountableOwner: "Records / legal",
  }),
  Object.freeze({
    issueId: "OI-02",
    issue: "Private-entry lifecycle",
    requiredResolution:
      "Retention, succession, incapacity, and estate treatment.",
    accountableOwner: "Privacy + legal",
  }),
  Object.freeze({
    issueId: "OI-03",
    issue: "Authority registry",
    requiredResolution:
      "Authoritative source and update latency for mandates/delegations.",
    accountableOwner: "Executive governance",
  }),
  Object.freeze({
    issueId: "OI-04",
    issue: "Jurisdiction",
    requiredResolution:
      "Residency, cross-border access, and encryption-key control.",
    accountableOwner: "Privacy + security",
  }),
  Object.freeze({
    issueId: "OI-05",
    issue: "Evidence durability",
    requiredResolution:
      "Which referenced sources require preservation or content pinning?",
    accountableOwner: "Journal steward",
  }),
  Object.freeze({
    issueId: "OI-06",
    issue: "Export posture",
    requiredResolution:
      "Permitted formats, watermarking, redaction, and onward-use controls.",
    accountableOwner: "Policy authority",
  }),
] as const);

/** AI non-delegable boundary MUST NOT list (§4.3). */
export const ExecutiveJournalAiMustNot = Object.freeze([
  "confirm decisions",
  "create authority",
  "close commitments",
  "disclose restricted material",
  "alter retention state",
] as const);

/** Read-only projection / assurance consumers. */
export const ExecutiveJournalRuntimeConsumers:
  readonly ExecutiveJournalRuntimeConsumerDeclaration[] = Object.freeze([
    consumer("DecisionRegister", 1),
    consumer("CommitmentLedger", 2),
    consumer("RiskExceptionRegister", 3),
    consumer("OutcomeTimeline", 4),
    consumer("ControlEvidence", 5),
    consumer("ExecutiveExperience", 6),
    consumer("IndependentAssurance", 7),
  ]);

/** Declared capture sources. Raw inputs MUST NOT become accepted decisions. */
export const ExecutiveJournalCaptureSources:
  readonly ExecutiveJournalCaptureSourceDeclaration[] = Object.freeze([
    capture(
      "JournalUI",
      "structured-entry",
      "Executive submits a structured journal event through the approved UI.",
      1,
    ),
    capture(
      "MeetingWorkflow",
      "attested-summary",
      "Approved meeting workflow proposes candidate events for confirmation.",
      2,
    ),
    capture(
      "ApprovedAPI",
      "typed-propose",
      "Authenticated API adapter submits a typed proposal with provenance.",
      3,
    ),
    capture(
      "ApprovedConnector",
      "normalized-propose",
      "Approved connector normalizes external input into a typed proposal.",
      4,
    ),
    capture(
      "CorrectionWorkflow",
      "correction-propose",
      "Authorized correction workflow proposes a superseding event.",
      5,
    ),
    capture(
      "RetentionDisposition",
      "disposition-propose",
      "Retention process proposes a recorded disposition action.",
      6,
    ),
  ]);

/** Ownership declaration. */
export const ExecutiveJournalRuntimeOwnership = Object.freeze({
  ownershipId: "RTC-2:1/ExecutiveJournalRuntimeOwnership",
  sourcePhase: "RTC-2:1" as const,
  owns: Object.freeze([
    "Append-only journal event contract",
    "Authority and attestation vocabulary",
    "Information category vocabulary",
    "Processing lifecycle vocabulary",
    "Projection provenance contract",
    "Disclosure and export control contract",
    "Correction and dispute semantics",
    "Integrity and replay guarantees",
    "AI non-delegable boundary",
    "Journal and event identity format",
  ] as const),
  doesNotOwn: ExecutiveJournalRuntimeProhibitedSurfaces,
  rootRuntimePackage: true as const,
  downstreamRuntimeDependency: false as const,
  declaredUpstream: "RTC-1 Executive Context Runtime Public Index" as const,
  ownsUi: false as const,
  ownsBusinessLogic: false as const,
  ownsAiAuthority: false as const,
  ownsSystemsOfRecord: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Architectural boundaries. */
export const ExecutiveJournalRuntimeBoundaries = Object.freeze({
  boundariesId: "RTC-2:1/ExecutiveJournalRuntimeBoundaries",
  sourcePhase: "RTC-2:1" as const,
  dependsOnRuntimeModules: false as const,
  downstreamDependencyPermitted: false as const,
  consumersReadOnly: true as const,
  appendOnlyAcceptedEvents: true as const,
  privateReflectionSeparateClass: true as const,
  failClosedOnPolicyUnavailable: true as const,
  prohibitedSurfaces: ExecutiveJournalRuntimeProhibitedSurfaces,
  aiMustNot: ExecutiveJournalAiMustNot,
  dependencyRules: Object.freeze([
    "NoDownstreamRuntimeDependencies",
    "RootJournalRuntimePackage",
    "NoUiFrameworkImports",
    "NoReactOrNextImports",
    "NoDecisionJournalApp8Imports",
    "NoDeepRtc1InternalImports",
    "NoRegistryModelValidationManifestPlatform",
    "ConsumeContextPublicIndexOnlyInLaterPhases",
  ] as const),
  inScope: Object.freeze([
    "Executive decisions and alternatives, rationale, constraints, approval state",
    "Commitments, owners, due dates, dependencies, changes, closure evidence",
    "Material risks, assumptions, exceptions, escalations, outcome observations",
    "Source references, attestations, access decisions, corrections, retention actions",
    "Private working entries when explicitly created and governed separately",
  ] as const),
  outOfScope: Object.freeze([
    "Continuous employee monitoring, sentiment scoring, or covert capture",
    "Replacing systems of record for finance, HR, legal, or delivery execution",
    "Inferring approval from silence, attendance, title, or model confidence",
    "Editing history in place or deleting outside authorized disposition",
    "Autonomous commitments, delegation, disclosure, or external communication",
  ] as const),
  runtimeEnforcement: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Evidence pipeline philosophy (§2). */
export const ExecutiveJournalEvidencePhilosophy = Object.freeze({
  philosophyId: "RTC-2:1/EvidencePhilosophy",
  sourcePhase: "RTC-2:1" as const,
  sequence: Object.freeze([
    "Propose",
    "Evaluate",
    "Confirm",
    "Commit",
    "Project",
    "Notify",
    "Review",
    "Dispose",
  ] as const),
  favorsTrustworthyEvidenceOverNarrativeCompleteness: true as const,
  currentStateRebuildableFromAcceptedEvents: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Foundation constants. */
export const ExecutiveJournalRuntimeFoundationConstants = Object.freeze({
  phaseIdentifier: "RTC-2:1",
  canonicalIdentifier: ExecutiveJournalRuntimeFoundationId,
  version: ExecutiveJournalRuntimeFoundationVersion,
  name: ExecutiveJournalRuntimeFoundationName,
  namespace: ExecutiveJournalRuntimeFoundationNamespace,
  status: ExecutiveJournalRuntimeFoundationStatus,
  readiness: ExecutiveJournalRuntimeFoundationReadiness,
  nextPhase: ExecutiveJournalRuntimeFoundationNextPhase,
  layer: "Runtime Layer",
  architecture: "NPA-T vNext",
  domain: "Executive Journal Runtime",
  ownership: "RTC-2 Executive Journal Runtime Foundation",
  documentClass: "Runtime foundation / executive design authority",
  release: "Foundation baseline 1.0",
  contractCount: ExecutiveJournalRuntimeContracts.length,
  eventCount: ExecutiveJournalRuntimeEvents.length,
  lifecycleStateCount: ExecutiveJournalRuntimeLifecycle.stateCount,
  consumerCount: ExecutiveJournalRuntimeConsumers.length,
  responsibilityCount: ExecutiveJournalRuntimeResponsibilities.length,
  guaranteeCount: ExecutiveJournalRuntimeGuarantees.length,
  principleCount: ExecutiveJournalRuntimePrinciples.length,
  captureSourceCount: ExecutiveJournalCaptureSources.length,
  eventFamilyCount: ExecutiveJournalEventFamilies.length,
  informationClassCount: ExecutiveJournalInformationClasses.length,
  decisionCount: ExecutiveJournalFoundationDecisions.length,
  openIssueCount: ExecutiveJournalOpenIssues.length,
} as const);

/** Publication metadata aggregate. */
export const ExecutiveJournalRuntimeMetadata = Object.freeze({
  identity: ExecutiveJournalRuntimeIdentity,
  constants: ExecutiveJournalRuntimeFoundationConstants,
  principles: ExecutiveJournalRuntimePrinciples,
  responsibilities: ExecutiveJournalRuntimeResponsibilities,
  guarantees: ExecutiveJournalRuntimeGuarantees,
  consumers: ExecutiveJournalRuntimeConsumers,
  captureSources: ExecutiveJournalCaptureSources,
  eventFamilies: ExecutiveJournalEventFamilies,
  informationClasses: ExecutiveJournalInformationClasses,
  foundationDecisions: ExecutiveJournalFoundationDecisions,
  openIssues: ExecutiveJournalOpenIssues,
  ownership: ExecutiveJournalRuntimeOwnership,
  boundaries: ExecutiveJournalRuntimeBoundaries,
  evidencePhilosophy: ExecutiveJournalEvidencePhilosophy,
  readiness: ExecutiveJournalRuntimeFoundationReadiness,
  nextPhase: ExecutiveJournalRuntimeFoundationNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
