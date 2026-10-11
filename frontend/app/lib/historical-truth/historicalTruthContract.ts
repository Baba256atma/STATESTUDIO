/**
 * NPA-T TIMELINE-FOUNDATION:1 — Historical Truth Contract.
 *
 * Read contract over existing authorities. It does not own Decision,
 * Execution, Data Reality, Outcome, or Learning, and it does not store events.
 *
 * Timeline does not decide what happened. A known fact with an unknown time
 * remains a known fact with an unknown time.
 */

import type { NexoraExecutiveDecision } from "../conversational-control/executiveDecisionCandidate.ts";
import type { NexoraExecutiveScenario } from "../conversational-control/executiveScenarioDefinition.ts";
import type { NexoraCanonicalExecution } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import type { CsvPublishedKpiObservation } from "../data-reality/csvRealDataImportStore.ts";
import type { CapturedOutcomeObservation } from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import type { ExecutiveOutcomeAssessment } from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import type { GroundedLearningCandidate } from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import type { WorkspaceRisk } from "../risk/workspaceRiskContract.ts";

export const historicalTruthContractIdentity =
  "NPA-T TIMELINE-FOUNDATION:1/HistoricalTruthContract" as const;

export const HISTORICAL_TRUTH_NON_CHRONOLOGICAL_SENTINEL =
  "core-out2:session" as const;

export const HISTORICAL_TRUTH_CLASSES = Object.freeze([
  "CANONICAL_MANAGEMENT",
  "OBSERVED_DATA",
  "DERIVED",
  "PRESENTATION_ONLY",
  "SIMULATION",
] as const);

export type HistoricalTruthClass = (typeof HISTORICAL_TRUTH_CLASSES)[number];

export const HISTORICAL_TIMESTAMP_SEMANTICS = Object.freeze([
  "OBSERVED_TIME",
  "RECORDED_TIME",
  "COMMITTED_TIME",
  "OCCURRENCE_TIME",
  "UNKNOWN",
  "NON_CHRONOLOGICAL",
] as const);

export type HistoricalTimestampSemantic =
  (typeof HISTORICAL_TIMESTAMP_SEMANTICS)[number];

export const HISTORICAL_TIMESTAMP_STATUSES = Object.freeze([
  "present",
  "missing",
  "unsupported",
  "non-chronological",
] as const);

export type HistoricalTimestampStatus =
  (typeof HISTORICAL_TIMESTAMP_STATUSES)[number];

export const HISTORICAL_TRUTH_FACT_TYPES = Object.freeze([
  "decision-known",
  "decision-committed",
  "decision-rejected",
  "execution-status",
  "observation-published",
  "outcome-capture",
  "outcome-evaluation",
  "learning-record",
  "scenario-identity",
  "risk-current-state",
] as const);

export type HistoricalFactType = (typeof HISTORICAL_TRUTH_FACT_TYPES)[number];

export const HISTORICAL_TRUTH_FORBIDDEN_SOURCES = Object.freeze([
  "flowDomain.timelineEvents",
  "journalPacks",
  "NEXORA_MVP_FLOW_TIMELINE_SEED",
  "business-timeline",
  "decision-timeline",
  "scenario-timeline",
  "simulation/timeline",
  "cognitive-timeline",
  "MRP TimelineWorkspace",
  "ExecutiveTimelineHud",
  "saved-scene",
  "stage-selection",
  "guided-attention",
  "rms-ground-truth",
  "app-4",
  "eca-12",
  "nexo-cause",
  "pareto",
] as const);

export type HistoricalTruthForbiddenSource =
  (typeof HISTORICAL_TRUTH_FORBIDDEN_SOURCES)[number];

export const HISTORICAL_TRUTH_SOURCE_KINDS = Object.freeze([
  "cc10-decision",
  "cc11-execution",
  "data-reality-observation",
  "core-out-1a-capture",
  "core-out-1-assessment",
  "core-out-2-learning",
  "cc9-scenario",
  "workspace-risk",
] as const);

export type HistoricalTruthSourceKind =
  (typeof HISTORICAL_TRUTH_SOURCE_KINDS)[number];

export type HistoricalPersistence =
  | "session-storage"
  | "session-state"
  | "process-memory"
  | "data-reality-durable"
  | "ephemeral"
  | "local-current-state";

export type HistoricalCanonicalRef = Readonly<{
  readonly kind:
    | "subject"
    | "scenario"
    | "decision"
    | "execution"
    | "data-reality-observation"
    | "outcome-capture"
    | "learning";
  readonly id: string;
}>;

export type HistoricalTimestampBinding = Readonly<{
  readonly field: string;
  readonly value: string | null;
  readonly semantics: HistoricalTimestampSemantic;
  readonly status: HistoricalTimestampStatus;
  readonly placeable: boolean;
}>;

export type HistoricalTruthFact = Readonly<{
  readonly factType: HistoricalFactType;
  readonly authority: string;
  readonly sourceRecordType: string;
  readonly sourceId: string | null;
  readonly sourceIdStatus: "present" | "missing";
  readonly subjectIds: readonly string[];
  readonly relatedRefs: readonly HistoricalCanonicalRef[];
  readonly truthClass: HistoricalTruthClass;
  readonly timestamps: readonly HistoricalTimestampBinding[];
  readonly provenance: readonly string[];
  readonly persistence: HistoricalPersistence;
  readonly recordStatus: string | null;
  readonly establishesCausation: false;
  readonly sourceObservationTrace: "referenced" | "missing" | "not-applicable";
  readonly discardedFields: readonly string[];
  readonly eventHistoryComplete: boolean;
}>;

export type HistoricalTruthRefusalReason =
  | "unsupported-fact"
  | "forbidden-source"
  | "rms-ground-truth"
  | "presentation-timestamp"
  | "presentation-ledger-id"
  | "flow-execution-id"
  | "source-kind-mismatch"
  | "status-mismatch"
  | "missing-source-id";

export type HistoricalTruthDescription =
  | {
      readonly admitted: true;
      readonly fact: HistoricalTruthFact;
    }
  | {
      readonly admitted: false;
      readonly reason: HistoricalTruthRefusalReason;
    };

export const HISTORICAL_TRUTH_BOUNDARY = Object.freeze({
  role: "read-contract" as const,
  ownsDecision: false as const,
  ownsExecution: false as const,
  ownsDataReality: false as const,
  ownsOutcomeCapture: false as const,
  ownsOutcomeEvaluation: false as const,
  ownsLearning: false as const,
  ownsScenarioComparison: false as const,
  ownsProblemOccurrence: false as const,
  createsEventLedger: false as const,
  createsEventBus: false as const,
  createsEventStore: false as const,
  mintsTimestamps: false as const,
  mintsSourceIds: false as const,
  mintsProjectionRowKeys: false as const,
  projectionRowKeyReplacesSourceId: false as const,
  readsFlowTimeline: false as const,
  admitsFixtureChronology: false as const,
  admitsRmsGroundTruth: false as const,
  establishesCausation: false as const,
  implementsPareto: false as const,
  implementsNexoCause: false as const,
  app4IsDefaultLearningOwner: false as const,
  eca12WritesLearning: false as const,
  borrowsExecutionTimeFromFlowTimeline: false as const,
});

export const HISTORICAL_TRUTH_AUTHORITIES = Object.freeze({
  decision: "CC:10/NexoraExecutiveDecision",
  execution: "CC:11/NexoraCanonicalExecution",
  observation: "Data Reality/RDI",
  outcomeCapture: "CORE-OUT:1A/CapturedOutcomeObservation",
  outcomeEvaluation: "CORE-OUT:1/ExecutiveOutcomeAssessment",
  learning: "CORE-OUT:2/GroundedLearningCandidate",
  scenario: "CC:9/NexoraExecutiveScenario",
  risk: "DS-6/WorkspaceRisk",
} as const);

/**
 * Compile-time seal. CC:11 lifecycle fields are nullable recording times.
 * Assignment fails if they disappear or stop being string | null.
 * Outcome chronology and causation stay sealed as unsupported.
 */
export const historicalTruthExecutionCreatedAtIsRecorded: NexoraCanonicalExecution["createdAt"] extends
  | string
  | null
  ? true
  : never = true;
export const historicalTruthExecutionStartedAtIsRecorded: NexoraCanonicalExecution["startedAt"] extends
  | string
  | null
  ? true
  : never = true;
export const historicalTruthExecutionCompletedAtIsRecorded: NexoraCanonicalExecution["completedAt"] extends
  | string
  | null
  ? true
  : never = true;
export const historicalTruthOutcomeHasNoAssessmentId: "assessmentId" extends keyof ExecutiveOutcomeAssessment
  ? never
  : true = true;
export const historicalTruthOutcomeHasNoEvaluatedAt: "evaluatedAt" extends keyof ExecutiveOutcomeAssessment
  ? never
  : true = true;
export const historicalTruthOutcomeRefusesCausation: ExecutiveOutcomeAssessment["establishesCausation"] extends false
  ? true
  : never = true;
export const historicalTruthLearningRefusesCausation: GroundedLearningCandidate["establishesCausation"] extends false
  ? true
  : never = true;

type _DecisionFields = NexoraExecutiveDecision["decisionId" | "status" | "subjectIds" | "committedAt" | "scenarioId"];
type _ScenarioFields = NexoraExecutiveScenario["scenarioId" | "subjectIds"];
type _ObservationFields = CsvPublishedKpiObservation["observationId" | "observedAt" | "committedAt" | "nexoraObjectId" | "objectKey"];
type _CaptureFields = CapturedOutcomeObservation["observationId" | "observedAt" | "capturedAt" | "decisionId" | "executionId" | "subjectId" | "provenanceRefs"];
type _LearningFields = GroundedLearningCandidate["learningId" | "status" | "subjectId" | "createdAt" | "decisionRefs" | "executionRefs" | "observationRefs"];
type _RiskFields = WorkspaceRisk["riskId" | "createdAt" | "updatedAt" | "status"];
export type HistoricalTruthReferencedFields =
  | _DecisionFields
  | _ScenarioFields
  | _ObservationFields
  | _CaptureFields
  | _LearningFields
  | _RiskFields;

export const HISTORICAL_TIMESTAMP_FIELD_MAP = Object.freeze({
  "Decision.committedAt": Object.freeze({
    semantics: "RECORDED_TIME" as const,
    meaning:
      "Software time supplied when CC:10 status becomes Approved or Rejected. Not a manager-declared business occurrence time.",
  }),
  "Data Reality.observedAt": Object.freeze({
    semantics: "OBSERVED_TIME" as const,
    meaning:
      "Measurement or dataset time. CSV selects dataset capturedAt, then snapshot observedAt, then falls back to committedAt.",
  }),
  "Data Reality.committedAt": Object.freeze({
    semantics: "COMMITTED_TIME" as const,
    meaning: "Software time of the Data Reality import or publication commit. Not measurement time.",
  }),
  "CORE-OUT:1A.observedAt": Object.freeze({
    semantics: "OBSERVED_TIME" as const,
    meaning: "Copied from the Data Reality observation. CORE-OUT:1A does not invent it.",
  }),
  "CORE-OUT:1A.capturedAt": Object.freeze({
    semantics: "RECORDED_TIME" as const,
    meaning:
      "Capture recording time copied from the publication commit. Not a second measurement time.",
  }),
  "CORE-OUT:2.createdAt": Object.freeze({
    semantics: "NON_CHRONOLOGICAL" as const,
    meaning:
      "core-out2:session is a sentinel. Any other value is copied from observation or expectation time and is not a Learning occurrence time.",
  }),
  "Risk.createdAt": Object.freeze({
    semantics: "RECORDED_TIME" as const,
    meaning: "Time on the current WorkspaceRisk record. Not a Risk event history.",
  }),
  "Risk.updatedAt": Object.freeze({
    semantics: "RECORDED_TIME" as const,
    meaning: "Latest write time on the current WorkspaceRisk record. Not a change ledger.",
  }),
  "flowDomain.occurredAt": Object.freeze({
    semantics: "UNKNOWN" as const,
    admitted: false as const,
    meaning:
      "Fixture or button-journal time. Presentation chronology. Not a historical timestamp.",
  }),
  "Execution.createdAt": Object.freeze({
    semantics: "RECORDED_TIME" as const,
    meaning:
      "When CC:11 first stored the Execution. Null if that write predates the field. Not a business occurrence time. flowDomain.occurredAt must not fill it.",
  }),
  "Execution.startedAt": Object.freeze({
    semantics: "RECORDED_TIME" as const,
    meaning:
      "When CC:11 first accepted in-progress. Resume does not replace it. Not a business occurrence time. flowDomain.occurredAt must not fill it.",
  }),
  "Execution.completedAt": Object.freeze({
    semantics: "RECORDED_TIME" as const,
    meaning:
      "When CC:11 accepted completion. Not a business occurrence time. flowDomain.occurredAt must not fill it.",
  }),
  "Outcome.evaluatedAt": Object.freeze({
    semantics: "OCCURRENCE_TIME" as const,
    status: "unsupported" as const,
    meaning: "CORE-OUT:1 has no evaluatedAt. Recomputation is not an occurrence.",
  }),
});

export const HISTORICAL_TRUTH_IDENTITY = Object.freeze({
  subject: Object.freeze({
    authority: "MO:1",
    field: "objectId",
    requiredOnEveryFact: false,
  }),
  scenario: Object.freeze({
    authority: "CC:9",
    field: "scenarioId",
    requiredOnEveryFact: false,
    comparisonOccurrence: false as const,
  }),
  decision: Object.freeze({
    authority: "CC:10",
    field: "decisionId",
    authoritativeId: "NexoraExecutiveDecision.decisionId",
  }),
  execution: Object.freeze({
    authority: "CC:11",
    field: "executionId",
    authoritativeId: "NexoraCanonicalExecution.executionId",
    shape: "execution-${decision.decisionId}",
  }),
  observation: Object.freeze({
    authority: "Data Reality/RDI",
    field: "observationId",
    authoritativeId: "CsvPublishedKpiObservation.observationId",
  }),
  outcomeCapture: Object.freeze({
    authority: "CORE-OUT:1A",
    field: "observationId",
    note: "Capture id is obs:{source}:{dataset}:{metric}:{observedAt}. It does not replace the Data Reality observation id.",
  }),
  learning: Object.freeze({
    authority: "CORE-OUT:2",
    field: "learningId",
  }),
  projectionRowKey: Object.freeze({
    isManagementIdentity: false as const,
    replacesSourceId: false as const,
    mintedByThisContract: false as const,
  }),
});

export const HISTORICAL_TRUTH_IDENTITY_HAZARDS = Object.freeze([
  Object.freeze({
    id: "fixture-decision-id",
    rule: "CC:10 decisionId is authoritative, including bootstrapped ctx-decision-* records. A tl-* or pack-* id is not a Decision id.",
  }),
  Object.freeze({
    id: "flow-execution-id",
    rule: "ctx-execution-* is a presentation row key. Historical Execution identity is CC:11 executionId, including execution-ctx-decision-*.",
  }),
  Object.freeze({
    id: "observation-id-remint",
    rule: "CSV observationId csv:{importId}:{kpiId} and CORE-OUT obs:… are two ids for one publication. Data Reality keeps the measurement id.",
  }),
  Object.freeze({
    id: "do-nothing-scenario-id",
    rule: "cc9:scenario:do-nothing:do-nothing:v{n} is shared across subjects. Subject identity stays on subjectIds.",
  }),
  Object.freeze({
    id: "capacity-object-alias",
    rule: "production, nexora.executive-operations.object.production, and obj-capacity are aliases. This contract does not collapse them.",
  }),
  Object.freeze({
    id: "problem-identity",
    rule: "No durable Problem id. ctx-problem-* fixtures are not a Problem occurrence authority.",
  }),
] as const);

export const HISTORICAL_TRUTH_GAPS = Object.freeze([
  Object.freeze({
    id: "HT-GAP-01",
    fixed: true as const,
    summary:
      "CLOSED for CC:11 canonical lifecycle recording time. createdAt, startedAt, and completedAt are RECORDED_TIME. External business occurrence time remains outside current authority.",
  }),
  Object.freeze({
    id: "HT-GAP-02",
    fixed: false as const,
    summary: "CORE-OUT:1 has no assessmentId and no evaluatedAt. The assessment is ephemeral.",
  }),
  Object.freeze({
    id: "HT-GAP-03",
    fixed: false as const,
    summary: "No durable Problem occurrence authority.",
  }),
  Object.freeze({
    id: "HT-GAP-04",
    fixed: false as const,
    summary: "CC:9 has no comparison or review timestamp.",
  }),
  Object.freeze({
    id: "HT-GAP-05",
    fixed: true as const,
    summary:
      "CLOSED: Timeline and Activity read the same Historical Projection. Live Capacity Utilization evidence is admitted through Canonical Managed Subject Identity (cmsi:capacity:kpi.production.capacity-utilization) without rewriting the Data Reality observation or collapsing Production into Capacity.",
  }),
  Object.freeze({
    id: "HT-GAP-06",
    fixed: false as const,
    summary: "Outcome window openedAt is reused as decisionAt and executionAt inside evaluation. Those fields are not CC:10 committedAt or a CC:11 start time.",
  }),
  Object.freeze({
    id: "HT-GAP-07",
    fixed: false as const,
    summary: "Learning createdAt may be the sentinel core-out2:session. Supported Learning is process memory. APP-4 is not the default owner.",
  }),
  Object.freeze({
    id: "HT-GAP-08",
    fixed: false as const,
    summary:
      "PARTIALLY CLOSED: Execution historical identity is NexoraCanonicalExecution.executionId. Remaining: do-nothing Scenario ids collide across subjects, and fixture Decision ids can share the Decision runtime.",
  }),
  Object.freeze({
    id: "HT-GAP-09",
    fixed: false as const,
    summary: "One KPI publication can be addressed as csv:{importId}:{kpiId} and again as obs:….",
  }),
  Object.freeze({
    id: "HT-GAP-10",
    fixed: false as const,
    summary: "Decision.committedAt is optional software recording time and can be replaced on re-approve. No business-occurrence timestamp exists.",
  }),
] as const);

export const HISTORICAL_TRUTH_INVARIANTS = Object.freeze([
  Object.freeze({
    id: "HT-INV-01",
    name: "Single Authority",
    holds: true as const,
    rule: "A historical fact does not gain a second management owner through this contract.",
  }),
  Object.freeze({
    id: "HT-INV-02",
    name: "Source Identity Preservation",
    holds: true as const,
    rule: "Descriptions preserve the authority source id and do not replace it with a projection id.",
  }),
  Object.freeze({
    id: "HT-INV-03",
    name: "No Invented Time",
    holds: true as const,
    rule: "Missing occurrence timestamps stay missing. This module does not call Date.now or new Date.",
  }),
  Object.freeze({
    id: "HT-INV-04",
    name: "Timestamp Semantics",
    holds: true as const,
    rule: "Observed, committed, recorded, occurrence, unknown, and non-chronological timestamps stay distinct.",
  }),
  Object.freeze({
    id: "HT-INV-05",
    name: "Presentation Is Not History",
    holds: true as const,
    rule: "Fixture rows, Stage state, attention state, and UI chronology cannot establish management history.",
  }),
  Object.freeze({
    id: "HT-INV-06",
    name: "Simulation Isolation",
    holds: true as const,
    rule: "RMS Ground Truth cannot directly become live historical truth.",
  }),
  Object.freeze({
    id: "HT-INV-07",
    name: "No Causation Promotion",
    holds: true as const,
    rule: "Outcome evaluation, ordering, and NexoCause presentation do not establish causation.",
  }),
  Object.freeze({
    id: "HT-INV-08",
    name: "No Parallel Registry",
    holds: true as const,
    rule: "This contract creates no Timeline or event registry.",
  }),
  Object.freeze({
    id: "HT-INV-09",
    name: "Gaps Remain Visible",
    holds: true as const,
    rule: "Unsupported Problem, Scenario, Execution-time, Outcome-time, and Learning-time claims are not repaired here.",
  }),
  Object.freeze({
    id: "HT-INV-10",
    name: "Existing Authorities Survive",
    holds: true as const,
    rule: "CC:10, CC:11, Data Reality/RDI, CORE-OUT:1A, CORE-OUT:1, and CORE-OUT:2 keep their ownership.",
  }),
] as const);

export const HISTORICAL_TRUTH_STATEMENT_VERDICTS = Object.freeze([
  "SUPPORTED",
  "SUPPORTED_WITH_TIMESTAMP_SEMANTIC",
  "SUPPORTED_WITHOUT_OCCURRENCE_TIME",
  "DERIVED_ONLY",
  "UNSUPPORTED",
  "SIMULATION_ONLY",
  "PRESENTATION_ONLY",
] as const);

export type HistoricalTruthStatementVerdict =
  (typeof HISTORICAL_TRUTH_STATEMENT_VERDICTS)[number];

export const HISTORICAL_TRUTH_CAPACITY_PROOF = Object.freeze([
  Object.freeze({
    statementId: "capacity-observed",
    statement: "Capacity observed at 68%",
    verdict: "SUPPORTED_WITH_TIMESTAMP_SEMANTIC" as const,
    authority: HISTORICAL_TRUTH_AUTHORITIES.observation,
    sourceRecordType: "CsvPublishedKpiObservation",
    sourceId: "observationId",
    subjectId: "nexoraObjectId; obj-capacity remains a stage alias",
    timestamp: "observedAt distinct from committedAt",
    timestampSemantics: "OBSERVED_TIME and COMMITTED_TIME",
    truthClass: "OBSERVED_DATA" as const,
    persistence: "data-reality-durable" as const,
    note: "Admits the fact type. Does not assert that a live value is 68%.",
  }),
  Object.freeze({
    statementId: "decision-committed",
    statement: "Decision D17 committed",
    verdict: "SUPPORTED_WITH_TIMESTAMP_SEMANTIC" as const,
    authority: HISTORICAL_TRUTH_AUTHORITIES.decision,
    sourceRecordType: "NexoraExecutiveDecision",
    sourceId: "decisionId",
    subjectId: "subjectIds",
    timestamp: "committedAt when present",
    timestampSemantics: "RECORDED_TIME",
    truthClass: "CANONICAL_MANAGEMENT" as const,
    persistence: "session-storage" as const,
    note: "D17 is a label, not decisionId. Absent committedAt leaves the Approved fact known and the time missing.",
  }),
  Object.freeze({
    statementId: "execution-exists",
    statement: "Execution E8 exists",
    verdict: "SUPPORTED_WITH_TIMESTAMP_SEMANTIC" as const,
    authority: HISTORICAL_TRUTH_AUTHORITIES.execution,
    sourceRecordType: "NexoraCanonicalExecution",
    sourceId: "executionId",
    subjectId: "via decisionId, not a display label",
    timestamp: "createdAt when present",
    timestampSemantics: "RECORDED_TIME",
    truthClass: "CANONICAL_MANAGEMENT" as const,
    persistence: "session-storage" as const,
    note: "E8 is a label. The canonical id is execution-${decisionId}. createdAt is when CC:11 recorded creation. Absent createdAt leaves the Execution known and the recording time missing.",
  }),
  Object.freeze({
    statementId: "execution-in-progress",
    statement: "Execution E8 is in progress",
    verdict: "SUPPORTED_WITH_TIMESTAMP_SEMANTIC" as const,
    authority: HISTORICAL_TRUTH_AUTHORITIES.execution,
    sourceRecordType: "NexoraCanonicalExecution",
    sourceId: "executionId",
    subjectId: "via decisionId",
    timestamp: "startedAt when present",
    timestampSemantics: "RECORDED_TIME",
    truthClass: "CANONICAL_MANAGEMENT" as const,
    persistence: "session-storage" as const,
    note: "status in-progress is knowable. startedAt is the first accepted start recording time. Absence leaves the status known and the recording time missing.",
  }),
  Object.freeze({
    statementId: "execution-started-at",
    statement: "Execution E8 was canonically recorded as started",
    verdict: "SUPPORTED_WITH_TIMESTAMP_SEMANTIC" as const,
    authority: HISTORICAL_TRUTH_AUTHORITIES.execution,
    sourceRecordType: "NexoraCanonicalExecution",
    sourceId: "executionId",
    subjectId: "via decisionId",
    timestamp: "startedAt",
    timestampSemantics: "RECORDED_TIME",
    truthClass: "CANONICAL_MANAGEMENT" as const,
    persistence: "session-storage" as const,
    note: "Recording time of the first accepted transition into in-progress. Not an external business occurrence. flowDomain.occurredAt is not a substitute.",
  }),
  Object.freeze({
    statementId: "execution-completed-at",
    statement: "Execution E8 was canonically recorded as completed",
    verdict: "SUPPORTED_WITH_TIMESTAMP_SEMANTIC" as const,
    authority: HISTORICAL_TRUTH_AUTHORITIES.execution,
    sourceRecordType: "NexoraCanonicalExecution",
    sourceId: "executionId",
    subjectId: "via decisionId",
    timestamp: "completedAt",
    timestampSemantics: "RECORDED_TIME",
    truthClass: "CANONICAL_MANAGEMENT" as const,
    persistence: "session-storage" as const,
    note: "Recording time of accepted completion. Completed status can still be known when completedAt is missing. Not an external business occurrence.",
  }),
  Object.freeze({
    statementId: "outcome-evaluated-on-friday",
    statement: "Outcome evaluated on Friday",
    verdict: "UNSUPPORTED" as const,
    authority: HISTORICAL_TRUTH_AUTHORITIES.outcomeEvaluation,
    sourceRecordType: "ExecutiveOutcomeAssessment",
    sourceId: "missing",
    subjectId: "subjectId when the ephemeral assessment carries one",
    timestamp: "evaluatedAt missing",
    timestampSemantics: "OCCURRENCE_TIME",
    truthClass: "DERIVED" as const,
    persistence: "ephemeral" as const,
    note: "An untimed assessment may exist as DERIVED_ONLY while the process holds it. Friday is not proved.",
  }),
  Object.freeze({
    statementId: "learning-supported",
    statement: "Learning L2 is supported",
    verdict: "SUPPORTED_WITHOUT_OCCURRENCE_TIME" as const,
    authority: HISTORICAL_TRUTH_AUTHORITIES.learning,
    sourceRecordType: "GroundedLearningCandidate",
    sourceId: "learningId",
    subjectId: "subjectId",
    timestamp: "createdAt is not an occurrence time",
    timestampSemantics: "NON_CHRONOLOGICAL",
    truthClass: "CANONICAL_MANAGEMENT" as const,
    persistence: "process-memory" as const,
    note: "status supported is the fact. core-out2:session is NON_CHRONOLOGICAL. A copied ISO is kept as UNKNOWN and is not placeable. APP-4 is not the owner.",
  }),
  Object.freeze({
    statementId: "problem-identified-at",
    statement: "Capacity Gap was identified at 09:18",
    verdict: "UNSUPPORTED" as const,
    authority: "none",
    sourceRecordType: "none",
    sourceId: "none",
    subjectId: "fixture ctx-problem-capacity is not a Problem store",
    timestamp: "none",
    timestampSemantics: "UNKNOWN",
    truthClass: "PRESENTATION_ONLY" as const,
    persistence: "none",
    note: "Seed row tl-capacity-gap is presentation. NPS createsProblemStore is false.",
  }),
  Object.freeze({
    statementId: "scenario-compared-at",
    statement: "Scenario A was compared at 10:05",
    verdict: "UNSUPPORTED" as const,
    authority: HISTORICAL_TRUTH_AUTHORITIES.scenario,
    sourceRecordType: "NexoraExecutiveScenario",
    sourceId: "scenarioId",
    subjectId: "subjectIds",
    timestamp: "none",
    timestampSemantics: "UNKNOWN",
    truthClass: "CANONICAL_MANAGEMENT" as const,
    persistence: "session-state" as const,
    note: "CC:9 can prove scenario identity. It cannot prove a comparison time. HT-GAP-04.",
  }),
] as const);

const PRESENTATION_LEDGER_PREFIXES = Object.freeze([
  "tl-",
  "pack-",
  "activity:",
  "business-event-",
]);

const EXECUTION_TIME_FIELDS = Object.freeze([
  "createdAt",
  "startedAt",
  "completedAt",
] as const);

type DescribeInput = Readonly<{
  factType: string;
  sourceKind: string;
  sourceId?: string | null;
  subjectIds?: readonly string[];
  relatedRefs?: readonly HistoricalCanonicalRef[];
  provenance?: readonly string[];
  recordStatus?: string | null;
  fields?: Readonly<Record<string, string | null | undefined>>;
}>;

function isFactType(value: string): value is HistoricalFactType {
  return (HISTORICAL_TRUTH_FACT_TYPES as readonly string[]).includes(value);
}

function isForbiddenSource(value: string): value is HistoricalTruthForbiddenSource {
  return (HISTORICAL_TRUTH_FORBIDDEN_SOURCES as readonly string[]).includes(value);
}

function isPresentationLedgerId(sourceId: string): boolean {
  return PRESENTATION_LEDGER_PREFIXES.some((prefix) => sourceId.startsWith(prefix));
}

function cleanList(values: readonly string[] | undefined): readonly string[] {
  return Object.freeze([...(values ?? [])].filter((value) => value.length > 0));
}

function fieldValue(
  fields: DescribeInput["fields"],
  name: string,
): string | null {
  const value = fields?.[name];
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function binding(input: {
  readonly field: string;
  readonly value: string | null;
  readonly semantics: HistoricalTimestampSemantic;
  readonly status: HistoricalTimestampStatus;
}): HistoricalTimestampBinding {
  const placeable =
    input.status === "present" &&
    (input.semantics === "OBSERVED_TIME" ||
      input.semantics === "RECORDED_TIME" ||
      input.semantics === "COMMITTED_TIME");
  return Object.freeze({
    field: input.field,
    value: input.value,
    semantics: input.semantics,
    status: input.status,
    placeable,
  });
}

function recordedBinding(field: string, value: string | null): HistoricalTimestampBinding {
  return binding({
    field,
    value,
    semantics: "RECORDED_TIME",
    status: value == null ? "missing" : "present",
  });
}

function unsupportedOccurrence(field: string): HistoricalTimestampBinding {
  return binding({
    field,
    value: null,
    semantics: "OCCURRENCE_TIME",
    status: "unsupported",
  });
}

function learningCreatedAt(value: string | null): HistoricalTimestampBinding {
  if (value == null) {
    return binding({
      field: "createdAt",
      value: null,
      semantics: "UNKNOWN",
      status: "missing",
    });
  }
  if (value === HISTORICAL_TRUTH_NON_CHRONOLOGICAL_SENTINEL) {
    return binding({
      field: "createdAt",
      value,
      semantics: "NON_CHRONOLOGICAL",
      status: "non-chronological",
    });
  }
  return binding({
    field: "createdAt",
    value,
    semantics: "UNKNOWN",
    status: "present",
  });
}

function refuse(reason: HistoricalTruthRefusalReason): HistoricalTruthDescription {
  return Object.freeze({ admitted: false, reason });
}

function admit(fact: HistoricalTruthFact): HistoricalTruthDescription {
  return Object.freeze({ admitted: true, fact: Object.freeze(fact) });
}

function expectedSource(factType: HistoricalFactType): HistoricalTruthSourceKind {
  switch (factType) {
    case "decision-known":
    case "decision-committed":
    case "decision-rejected":
      return "cc10-decision";
    case "execution-status":
      return "cc11-execution";
    case "observation-published":
      return "data-reality-observation";
    case "outcome-capture":
      return "core-out-1a-capture";
    case "outcome-evaluation":
      return "core-out-1-assessment";
    case "learning-record":
      return "core-out-2-learning";
    case "scenario-identity":
      return "cc9-scenario";
    case "risk-current-state":
      return "workspace-risk";
  }
}

/**
 * Describe one historical fact from caller-supplied authority fields.
 * Does not read stores, mint ids, or fill missing times.
 */
export function describeHistoricalFact(input: DescribeInput): HistoricalTruthDescription {
  if (isForbiddenSource(input.sourceKind)) {
    return refuse(input.sourceKind === "rms-ground-truth" ? "rms-ground-truth" : "forbidden-source");
  }
  if (!isFactType(input.factType)) return refuse("unsupported-fact");
  if (input.sourceKind !== expectedSource(input.factType)) return refuse("source-kind-mismatch");
  if (fieldValue(input.fields, "occurredAt") != null) return refuse("presentation-timestamp");

  const sourceId = input.sourceId?.trim() ?? "";
  if (sourceId.length > 0 && isPresentationLedgerId(sourceId)) {
    return refuse("presentation-ledger-id");
  }

  const subjectIds = cleanList(input.subjectIds);
  const relatedRefs = Object.freeze([...(input.relatedRefs ?? [])]);
  const provenance = cleanList(input.provenance);
  const recordStatus = input.recordStatus ?? null;

  if (input.factType === "decision-committed" && recordStatus != null && recordStatus !== "Approved") {
    return refuse("status-mismatch");
  }
  if (input.factType === "decision-rejected" && recordStatus != null && recordStatus !== "Rejected") {
    return refuse("status-mismatch");
  }
  if (
    input.factType === "decision-known" &&
    (recordStatus === "Approved" || recordStatus === "Rejected")
  ) {
    return refuse("status-mismatch");
  }
  if (
    input.factType === "execution-status" &&
    recordStatus != null &&
    !["planned", "ready", "in-progress", "blocked", "at-risk", "completed", "cancelled"].includes(recordStatus)
  ) {
    return refuse("status-mismatch");
  }

  if (input.factType !== "outcome-evaluation" && sourceId.length === 0) {
    return refuse("missing-source-id");
  }
  if (input.factType === "execution-status" && sourceId.startsWith("ctx-execution-")) {
    return refuse("flow-execution-id");
  }

  const shared = {
    subjectIds,
    relatedRefs,
    provenance,
    recordStatus,
    establishesCausation: false as const,
    sourceObservationTrace: "not-applicable" as const,
    eventHistoryComplete: false,
  };

  if (
    input.factType === "decision-known" ||
    input.factType === "decision-committed" ||
    input.factType === "decision-rejected"
  ) {
    const discarded: string[] = [];
    const timestamps: HistoricalTimestampBinding[] = [];
    if (input.factType === "decision-known") {
      if (fieldValue(input.fields, "committedAt") != null) discarded.push("committedAt");
    } else {
      timestamps.push(recordedBinding("committedAt", fieldValue(input.fields, "committedAt")));
    }
    return admit({
      ...shared,
      factType: input.factType,
      authority: HISTORICAL_TRUTH_AUTHORITIES.decision,
      sourceRecordType: "NexoraExecutiveDecision",
      sourceId,
      sourceIdStatus: "present",
      truthClass: "CANONICAL_MANAGEMENT",
      timestamps: Object.freeze(timestamps),
      persistence: "session-storage",
      discardedFields: Object.freeze(discarded),
    });
  }

  if (input.factType === "execution-status") {
    return admit({
      ...shared,
      factType: "execution-status",
      authority: HISTORICAL_TRUTH_AUTHORITIES.execution,
      sourceRecordType: "NexoraCanonicalExecution",
      sourceId,
      sourceIdStatus: "present",
      truthClass: "CANONICAL_MANAGEMENT",
      timestamps: Object.freeze(
        EXECUTION_TIME_FIELDS.map((field) => recordedBinding(field, fieldValue(input.fields, field))),
      ),
      persistence: "session-storage",
      discardedFields: Object.freeze([]),
      eventHistoryComplete: false,
    });
  }

  if (input.factType === "observation-published") {
    const observedAt = fieldValue(input.fields, "observedAt");
    const committedAt = fieldValue(input.fields, "committedAt");
    return admit({
      ...shared,
      factType: "observation-published",
      authority: HISTORICAL_TRUTH_AUTHORITIES.observation,
      sourceRecordType: "CsvPublishedKpiObservation",
      sourceId,
      sourceIdStatus: "present",
      truthClass: "OBSERVED_DATA",
      timestamps: Object.freeze([
        binding({
          field: "observedAt",
          value: observedAt,
          semantics: "OBSERVED_TIME",
          status: observedAt == null ? "missing" : "present",
        }),
        binding({
          field: "committedAt",
          value: committedAt,
          semantics: "COMMITTED_TIME",
          status: committedAt == null ? "missing" : "present",
        }),
      ]),
      persistence: "data-reality-durable",
      discardedFields: Object.freeze([]),
    });
  }

  if (input.factType === "outcome-capture") {
    const traced = relatedRefs.some((ref) => ref.kind === "data-reality-observation" && ref.id !== sourceId) ||
      provenance.some((ref) => ref !== sourceId);
    return admit({
      ...shared,
      factType: "outcome-capture",
      authority: HISTORICAL_TRUTH_AUTHORITIES.outcomeCapture,
      sourceRecordType: "CapturedOutcomeObservation",
      sourceId,
      sourceIdStatus: "present",
      truthClass: "OBSERVED_DATA",
      timestamps: Object.freeze([
        binding({
          field: "observedAt",
          value: fieldValue(input.fields, "observedAt"),
          semantics: "OBSERVED_TIME",
          status: fieldValue(input.fields, "observedAt") == null ? "missing" : "present",
        }),
        recordedBinding("capturedAt", fieldValue(input.fields, "capturedAt")),
      ]),
      persistence: "process-memory",
      sourceObservationTrace: traced ? "referenced" : "missing",
      discardedFields: Object.freeze([]),
    });
  }

  if (input.factType === "outcome-evaluation") {
    const discarded = fieldValue(input.fields, "evaluatedAt") != null ? ["evaluatedAt"] : [];
    if (sourceId.length > 0) discarded.push("sourceId");
    return admit({
      ...shared,
      factType: "outcome-evaluation",
      authority: HISTORICAL_TRUTH_AUTHORITIES.outcomeEvaluation,
      sourceRecordType: "ExecutiveOutcomeAssessment",
      sourceId: null,
      sourceIdStatus: "missing",
      truthClass: "DERIVED",
      timestamps: Object.freeze([unsupportedOccurrence("evaluatedAt")]),
      persistence: "ephemeral",
      discardedFields: Object.freeze(discarded),
    });
  }

  if (input.factType === "learning-record") {
    return admit({
      ...shared,
      factType: "learning-record",
      authority: HISTORICAL_TRUTH_AUTHORITIES.learning,
      sourceRecordType: "GroundedLearningCandidate",
      sourceId,
      sourceIdStatus: "present",
      truthClass: "CANONICAL_MANAGEMENT",
      timestamps: Object.freeze([learningCreatedAt(fieldValue(input.fields, "createdAt"))]),
      persistence: "process-memory",
      discardedFields: Object.freeze([]),
    });
  }

  if (input.factType === "scenario-identity") {
    const discarded = fieldValue(input.fields, "comparedAt") != null ? ["comparedAt"] : [];
    return admit({
      ...shared,
      factType: "scenario-identity",
      authority: HISTORICAL_TRUTH_AUTHORITIES.scenario,
      sourceRecordType: "NexoraExecutiveScenario",
      sourceId,
      sourceIdStatus: "present",
      truthClass: "CANONICAL_MANAGEMENT",
      timestamps: Object.freeze([unsupportedOccurrence("comparedAt")]),
      persistence: "session-state",
      discardedFields: Object.freeze(discarded),
    });
  }

  return admit({
    ...shared,
    factType: "risk-current-state",
    authority: HISTORICAL_TRUTH_AUTHORITIES.risk,
    sourceRecordType: "WorkspaceRisk",
    sourceId,
    sourceIdStatus: "present",
    truthClass: "CANONICAL_MANAGEMENT",
    timestamps: Object.freeze([
      recordedBinding("createdAt", fieldValue(input.fields, "createdAt")),
      recordedBinding("updatedAt", fieldValue(input.fields, "updatedAt")),
    ]),
    persistence: "local-current-state",
    discardedFields: Object.freeze([]),
  });
}

export function historicalTruthStatement(
  statementId: (typeof HISTORICAL_TRUTH_CAPACITY_PROOF)[number]["statementId"],
): (typeof HISTORICAL_TRUTH_CAPACITY_PROOF)[number] {
  const found = HISTORICAL_TRUTH_CAPACITY_PROOF.find((entry) => entry.statementId === statementId);
  if (found == null) throw new Error(`historical-truth-unknown-statement:${statementId}`);
  return found;
}
