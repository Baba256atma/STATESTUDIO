/**
 * NPA-T TIMELINE-PROJ:1 — read-only Canonical Historical Projection.
 * Reconstructs rows from caller-supplied authority records.
 * Admission, timestamp meaning, and placeability come from the Historical Truth Contract.
 */

import type { NexoraExecutiveDecision } from "../conversational-control/executiveDecisionCandidate.ts";
import type { NexoraCanonicalExecution } from "../conversational-control/executiveExecutionRuntimeAdapter.ts";
import {
  resolveDataRealityEvidenceForManagedSubject,
  type CanonicalManagedSubjectCatalog,
} from "../managed-subject-identity/managedSubjectIdentity.ts";
import type { GroundedLearningCandidate } from "../executive-intelligence/nexoraGroundedLearningIntelligence.ts";
import type { CapturedOutcomeObservation } from "../executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import type { ExecutiveOutcomeAssessment } from "../executive-intelligence/nexoraLiveOutcomeIntelligence.ts";
import {
  describeHistoricalFact,
  type HistoricalCanonicalRef,
  type HistoricalPersistence,
  type HistoricalTimestampBinding,
  type HistoricalTruthClass,
  type HistoricalTruthDescription,
  type HistoricalTruthFact,
  type HistoricalTruthRefusalReason,
} from "./historicalTruthContract.ts";

export const historicalTruthProjectionIdentity =
  "NPA-T TIMELINE-PROJ:1/CanonicalHistoricalProjection" as const;

export const HISTORICAL_PROJECTION_BOUNDARY = Object.freeze({
  role: "read-projection" as const,
  persists: false as const,
  mutatesAuthorities: false as const,
  establishesCausation: false as const,
  mintsCanonicalIds: false as const,
  readsFlowTimeline: false as const,
  readsJournal: false as const,
  admitsRmsGroundTruth: false as const,
  admitsPresentationHistory: false as const,
  implementsPareto: false as const,
  implementsNexoCause: false as const,
  mergesSubjectAliases: false as const,
  wiresTimelineDock: false as const,
  wiresActivity: false as const,
  ownsManagedSubjectIdentity: false as const,
  consumesManagedSubjectIdentity: true as const,
});

export const HISTORICAL_PROJECTION_FACT_TYPES = Object.freeze([
  "decision-approved",
  "decision-rejected",
  "execution-created",
  "execution-started",
  "execution-completed",
  "execution-current-status",
  "observation-recorded",
  "outcome-capture-link",
  "outcome-assessment-available",
  "learning-supported",
] as const);

export type HistoricalProjectionFactType =
  (typeof HISTORICAL_PROJECTION_FACT_TYPES)[number];

export type HistoricalProjectionRow = Readonly<{
  readonly projectionKey: string;
  readonly factType: HistoricalProjectionFactType;
  readonly subjectId: string;
  readonly sourceAuthority: string;
  readonly sourceRecordType: string;
  readonly sourceId: string | null;
  readonly truthClass: HistoricalTruthClass;
  readonly timestamps: readonly HistoricalTimestampBinding[];
  readonly orderingTimestamp: string | null;
  readonly placeable: boolean;
  readonly relatedRefs: readonly HistoricalCanonicalRef[];
  readonly summary: string;
  readonly recordStatus: string | null;
  readonly establishesCausation: false;
  readonly persistence: HistoricalPersistence;
  readonly measurement: Readonly<{ readonly value: number; readonly unit: string }> | null;
}>;

export type HistoricalProjectionRefusal = Readonly<{
  readonly sourceKind: string;
  readonly sourceId: string | null;
  readonly reason: HistoricalTruthRefusalReason;
}>;

export type HistoricalProjection = Readonly<{
  readonly subjectId: string;
  readonly chronological: readonly HistoricalProjectionRow[];
  readonly unplaced: readonly HistoricalProjectionRow[];
  readonly refused: readonly HistoricalProjectionRefusal[];
  readonly establishesCausation: false;
  readonly persisted: false;
}>;

export type HistoricalObservationInput = Readonly<{
  readonly observationId: string;
  readonly kpiId: string;
  readonly objectKey: string;
  readonly nexoraObjectId: string;
  readonly value: number;
  readonly unit: string;
  readonly observedAt: string;
  readonly committedAt?: string | null;
}>;

export type ProjectHistoricalTruthInput = Readonly<{
  readonly subjectId: string;
  readonly decisions?: readonly NexoraExecutiveDecision[];
  readonly executions?: readonly NexoraCanonicalExecution[];
  readonly observations?: readonly HistoricalObservationInput[];
  readonly outcomeCaptures?: readonly CapturedOutcomeObservation[];
  readonly outcomeAssessments?: readonly ExecutiveOutcomeAssessment[];
  readonly learnings?: readonly GroundedLearningCandidate[];
  readonly range?: Readonly<{ readonly from?: string | null; readonly to?: string | null }>;
  readonly subjectMembershipCatalog?: CanonicalManagedSubjectCatalog;
}>;

const SUMMARIES: Readonly<Record<HistoricalProjectionFactType, string>> = Object.freeze({
  "decision-approved": "Decision approved",
  "decision-rejected": "Decision rejected",
  "execution-created": "Execution created",
  "execution-started": "Execution started",
  "execution-completed": "Execution completed",
  "execution-current-status": "Execution current status",
  "observation-recorded": "Observation recorded",
  "outcome-capture-link": "Outcome capture linked",
  "outcome-assessment-available": "Outcome assessment available",
  "learning-supported": "Learning supported",
});

const ADMITTED_SUBJECT_MEMBERSHIP = Object.freeze([
  "EXACT_CANONICAL_IDENTITY",
  "EVIDENCE_FOR_MANAGED_SUBJECT",
] as const);

function exactMember(values: readonly string[] | undefined, subjectId: string): boolean {
  return (values ?? []).some((value) => value === subjectId);
}

export function observationBelongsToHistoricalSubject(
  observation: HistoricalObservationInput,
  requestedSubjectId: string,
  catalog?: CanonicalManagedSubjectCatalog,
): boolean {
  if (
    observation.nexoraObjectId === requestedSubjectId ||
    observation.objectKey === requestedSubjectId
  ) {
    return true;
  }
  const resolved = resolveDataRealityEvidenceForManagedSubject({
    objectKey: observation.objectKey,
    nexoraObjectId: observation.nexoraObjectId,
    evidenceId: observation.kpiId,
    catalog,
  });
  return (
    resolved.status === "resolved" &&
    resolved.canonicalSubjectId === requestedSubjectId &&
    ADMITTED_SUBJECT_MEMBERSHIP.includes(resolved.relationship)
  );
}

function binding(
  fact: HistoricalTruthFact,
  field: string,
): HistoricalTimestampBinding | null {
  return fact.timestamps.find((entry) => entry.field === field) ?? null;
}

function projectionKey(factType: HistoricalProjectionFactType, sourceId: string): string {
  return `historical:${factType}:${sourceId}`;
}

function compareProjectionKeys(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function inRange(
  timestamp: string,
  range: ProjectHistoricalTruthInput["range"],
): boolean {
  if (range?.from != null && range.from.length > 0 && timestamp < range.from) return false;
  if (range?.to != null && range.to.length > 0 && timestamp > range.to) return false;
  return true;
}

function makeRow(input: {
  readonly factType: HistoricalProjectionFactType;
  readonly subjectId: string;
  readonly fact: HistoricalTruthFact;
  readonly timestamps: readonly HistoricalTimestampBinding[];
  readonly ordering: HistoricalTimestampBinding | null;
  readonly keyIdentity?: string;
  readonly measurement?: HistoricalProjectionRow["measurement"];
}): HistoricalProjectionRow {
  const placeable = input.ordering?.placeable === true && input.ordering.value != null;
  return Object.freeze({
    projectionKey: projectionKey(
      input.factType,
      input.keyIdentity ?? input.fact.sourceId ?? input.subjectId,
    ),
    factType: input.factType,
    subjectId: input.subjectId,
    sourceAuthority: input.fact.authority,
    sourceRecordType: input.fact.sourceRecordType,
    sourceId: input.fact.sourceId,
    truthClass: input.fact.truthClass,
    timestamps: Object.freeze([...input.timestamps]),
    orderingTimestamp: placeable ? input.ordering?.value ?? null : null,
    placeable,
    relatedRefs: input.fact.relatedRefs,
    summary: SUMMARIES[input.factType],
    recordStatus: input.fact.recordStatus,
    establishesCausation: false as const,
    persistence: input.fact.persistence,
    measurement: input.measurement ?? null,
  });
}

function isProjectionRowList(
  value: HistoricalProjectionRow | readonly HistoricalProjectionRow[],
): value is readonly HistoricalProjectionRow[] {
  return Array.isArray(value);
}

function pushAdmitted(
  rows: HistoricalProjectionRow[],
  refused: HistoricalProjectionRefusal[],
  described: HistoricalTruthDescription,
  sourceKind: string,
  sourceId: string | null,
  build: (fact: HistoricalTruthFact) => HistoricalProjectionRow | readonly HistoricalProjectionRow[] | null,
) {
  if (!described.admitted) {
    refused.push(Object.freeze({ sourceKind, sourceId, reason: described.reason }));
    return;
  }
  const built = build(described.fact);
  if (built == null) return;
  if (isProjectionRowList(built)) rows.push(...built);
  else rows.push(built);
}

/**
 * Forwards one candidate to the Historical Truth Contract.
 * Forbidden sources, fixture execution ids, and presentation timestamps are refused there.
 */
export function screenHistoricalProjectionInput(input: {
  readonly factType: string;
  readonly sourceKind: string;
  readonly sourceId?: string | null;
  readonly subjectIds?: readonly string[];
  readonly relatedRefs?: readonly HistoricalCanonicalRef[];
  readonly provenance?: readonly string[];
  readonly recordStatus?: string | null;
  readonly fields?: Readonly<Record<string, string | null | undefined>>;
}): HistoricalTruthDescription {
  return describeHistoricalFact(input);
}

export function projectHistoricalTruth(
  input: ProjectHistoricalTruthInput,
): HistoricalProjection {
  const subjectId = input.subjectId;
  const decisions = (input.decisions ?? []).filter((decision) =>
    exactMember(decision.subjectIds, subjectId),
  );
  const decisionIds = new Set(decisions.map((decision) => decision.decisionId));
  const observations = (input.observations ?? []).filter((observation) =>
    observationBelongsToHistoricalSubject(
      observation,
      subjectId,
      input.subjectMembershipCatalog,
    ),
  );
  const observationIds = new Set(observations.map((observation) => observation.observationId));
  const executions = (input.executions ?? []).filter((execution) =>
    decisionIds.has(execution.decisionId),
  );
  const executionIds = new Set(
    executions
      .map((execution) => execution.executionId)
      .filter((executionId) => !executionId.startsWith("ctx-execution-")),
  );
  const rows: HistoricalProjectionRow[] = [];
  const refused: HistoricalProjectionRefusal[] = [];

  for (const execution of input.executions ?? []) {
    if (decisionIds.has(execution.decisionId)) continue;
    if (!execution.executionId.startsWith("ctx-execution-")) continue;
    const described = describeHistoricalFact({
      factType: "execution-status",
      sourceKind: "cc11-execution",
      sourceId: execution.executionId,
      subjectIds: [subjectId],
      recordStatus: execution.status,
    });
    if (!described.admitted) {
      refused.push(
        Object.freeze({
          sourceKind: "cc11-execution",
          sourceId: execution.executionId,
          reason: described.reason,
        }),
      );
    }
  }

  for (const decision of decisions) {
    if (decision.status !== "Approved" && decision.status !== "Rejected") continue;
    const factType = decision.status === "Approved" ? "decision-committed" : "decision-rejected";
    const projectionFactType =
      decision.status === "Approved" ? "decision-approved" : "decision-rejected";
    pushAdmitted(
      rows,
      refused,
      describeHistoricalFact({
        factType,
        sourceKind: "cc10-decision",
        sourceId: decision.decisionId,
        subjectIds: decision.subjectIds,
        recordStatus: decision.status,
        fields: { committedAt: decision.committedAt },
        relatedRefs: decision.scenarioId
          ? [{ kind: "scenario", id: decision.scenarioId }]
          : [],
      }),
      "cc10-decision",
      decision.decisionId,
      (fact) => {
        const committed = binding(fact, "committedAt");
        return makeRow({
          factType: projectionFactType,
          subjectId,
          fact,
          timestamps: committed ? [committed] : [],
          ordering: committed,
        });
      },
    );
  }

  for (const execution of executions) {
    const relatedRefs: HistoricalCanonicalRef[] = [
      { kind: "decision", id: execution.decisionId },
      { kind: "subject", id: subjectId },
    ];
    pushAdmitted(
      rows,
      refused,
      describeHistoricalFact({
        factType: "execution-status",
        sourceKind: "cc11-execution",
        sourceId: execution.executionId,
        subjectIds: [subjectId],
        recordStatus: execution.status,
        fields: {
          createdAt: execution.createdAt,
          startedAt: execution.startedAt,
          completedAt: execution.completedAt,
        },
        relatedRefs,
      }),
      "cc11-execution",
      execution.executionId,
      (fact) => {
        const lifecycle: HistoricalProjectionRow[] = [];
        const created = binding(fact, "createdAt");
        const started = binding(fact, "startedAt");
        const completed = binding(fact, "completedAt");
        if (created?.status === "present") {
          lifecycle.push(
            makeRow({
              factType: "execution-created",
              subjectId,
              fact,
              timestamps: [created],
              ordering: created,
            }),
          );
        }
        if (started?.status === "present") {
          lifecycle.push(
            makeRow({
              factType: "execution-started",
              subjectId,
              fact,
              timestamps: [started],
              ordering: started,
            }),
          );
        }
        if (completed?.status === "present") {
          lifecycle.push(
            makeRow({
              factType: "execution-completed",
              subjectId,
              fact,
              timestamps: [completed],
              ordering: completed,
            }),
          );
        }
        const describedStatus = describeHistoricalFact({
          factType: "execution-status",
          sourceKind: "cc11-execution",
          sourceId: execution.executionId,
          subjectIds: [subjectId],
          recordStatus: execution.status,
          relatedRefs,
        });
        if (describedStatus.admitted) {
          lifecycle.push(
            makeRow({
              factType: "execution-current-status",
              subjectId,
              fact: describedStatus.fact,
              timestamps: [],
              ordering: null,
            }),
          );
        }
        return lifecycle;
      },
    );
  }

  for (const observation of observations) {
    const membership = resolveDataRealityEvidenceForManagedSubject({
      objectKey: observation.objectKey,
      nexoraObjectId: observation.nexoraObjectId,
      evidenceId: observation.kpiId,
      catalog: input.subjectMembershipCatalog,
    });
    const membershipProvenance =
      membership.status === "resolved" &&
      membership.canonicalSubjectId === subjectId &&
      membership.provenance != null
        ? [membership.provenance.declarationId]
        : [];
    pushAdmitted(
      rows,
      refused,
      describeHistoricalFact({
        factType: "observation-published",
        sourceKind: "data-reality-observation",
        sourceId: observation.observationId,
        subjectIds: [subjectId],
        fields: {
          observedAt: observation.observedAt,
          committedAt: observation.committedAt,
        },
        relatedRefs: [{ kind: "subject", id: subjectId }],
        provenance: membershipProvenance,
      }),
      "data-reality-observation",
      observation.observationId,
      (fact) => {
        const observed = binding(fact, "observedAt");
        return makeRow({
          factType: "observation-recorded",
          subjectId,
          fact,
          timestamps: fact.timestamps,
          ordering: observed,
          measurement: Object.freeze({ value: observation.value, unit: observation.unit }),
        });
      },
    );
  }

  for (const capture of input.outcomeCaptures ?? []) {
    const linkedToSubject =
      capture.subjectId === subjectId ||
      (capture.decisionId != null && decisionIds.has(capture.decisionId)) ||
      (capture.executionId != null && executionIds.has(capture.executionId));
    if (!linkedToSubject) continue;
    const sourceObservationId =
      capture.provenanceRefs.find((ref) => observationIds.has(ref)) ??
      (capture.sourceId != null && observationIds.has(capture.sourceId) ? capture.sourceId : null);
    const relatedRefs: HistoricalCanonicalRef[] = [];
    if (sourceObservationId) {
      relatedRefs.push({ kind: "data-reality-observation", id: sourceObservationId });
    }
    if (capture.decisionId) relatedRefs.push({ kind: "decision", id: capture.decisionId });
    if (capture.executionId) relatedRefs.push({ kind: "execution", id: capture.executionId });
    relatedRefs.push({ kind: "subject", id: capture.subjectId });
    pushAdmitted(
      rows,
      refused,
      describeHistoricalFact({
        factType: "outcome-capture",
        sourceKind: "core-out-1a-capture",
        sourceId: capture.observationId,
        subjectIds: [capture.subjectId],
        fields: {
          observedAt: capture.observedAt,
          capturedAt: capture.capturedAt,
        },
        relatedRefs,
        provenance: capture.provenanceRefs,
      }),
      "core-out-1a-capture",
      capture.observationId,
      (fact) => {
        const captured = binding(fact, "capturedAt");
        return makeRow({
          factType: "outcome-capture-link",
          subjectId,
          fact,
          timestamps: fact.timestamps,
          ordering: captured,
        });
      },
    );
  }

  for (const assessment of input.outcomeAssessments ?? []) {
    const linked =
      assessment.subjectId === subjectId ||
      (assessment.decisionId != null && decisionIds.has(assessment.decisionId)) ||
      (assessment.executionId != null && executionIds.has(assessment.executionId));
    if (!linked) continue;
    const relatedRefs: HistoricalCanonicalRef[] = [];
    if (assessment.subjectId) relatedRefs.push({ kind: "subject", id: assessment.subjectId });
    if (assessment.decisionId) relatedRefs.push({ kind: "decision", id: assessment.decisionId });
    if (assessment.executionId) relatedRefs.push({ kind: "execution", id: assessment.executionId });
    pushAdmitted(
      rows,
      refused,
      describeHistoricalFact({
        factType: "outcome-evaluation",
        sourceKind: "core-out-1-assessment",
        sourceId: null,
        subjectIds: assessment.subjectId ? [assessment.subjectId] : [subjectId],
        recordStatus: assessment.status,
        relatedRefs,
        provenance: assessment.provenanceRefs,
      }),
      "core-out-1-assessment",
      null,
      (fact) =>
        makeRow({
          factType: "outcome-assessment-available",
          subjectId,
          fact,
          timestamps: fact.timestamps,
          ordering: null,
          keyIdentity: [
            subjectId,
            assessment.decisionId ?? "none",
            assessment.executionId ?? "none",
            assessment.status,
          ].join(":"),
        }),
    );
  }

  for (const learning of input.learnings ?? []) {
    if (learning.status !== "supported") continue;
    const linked =
      learning.subjectId === subjectId ||
      learning.decisionRefs.some((id) => decisionIds.has(id)) ||
      learning.executionRefs.some((id) => executionIds.has(id)) ||
      learning.observationRefs.some((id) => observationIds.has(id));
    if (!linked) continue;
    const relatedRefs: HistoricalCanonicalRef[] = [
      ...learning.decisionRefs.map((id) => ({ kind: "decision" as const, id })),
      ...learning.executionRefs.map((id) => ({ kind: "execution" as const, id })),
      ...learning.observationRefs.map((id) => ({ kind: "data-reality-observation" as const, id })),
    ];
    if (learning.subjectId) relatedRefs.push({ kind: "subject", id: learning.subjectId });
    pushAdmitted(
      rows,
      refused,
      describeHistoricalFact({
        factType: "learning-record",
        sourceKind: "core-out-2-learning",
        sourceId: learning.learningId,
        subjectIds: learning.subjectId ? [learning.subjectId] : [subjectId],
        recordStatus: learning.status,
        fields: { createdAt: learning.createdAt },
        relatedRefs,
      }),
      "core-out-2-learning",
      learning.learningId,
      (fact) => {
        const created = binding(fact, "createdAt");
        return makeRow({
          factType: "learning-supported",
          subjectId,
          fact,
          timestamps: created ? [created] : fact.timestamps,
          ordering: created?.placeable === true ? created : null,
        });
      },
    );
  }

  const chronological = rows
    .filter(
      (row) =>
        row.placeable &&
        row.orderingTimestamp != null &&
        inRange(row.orderingTimestamp, input.range),
    )
    .sort((left, right) => {
      const byTime = compareProjectionKeys(left.orderingTimestamp ?? "", right.orderingTimestamp ?? "");
      if (byTime !== 0) return byTime;
      return compareProjectionKeys(left.projectionKey, right.projectionKey);
    });
  const unplaced = rows
    .filter((row) => !row.placeable || row.orderingTimestamp == null)
    .sort((left, right) => compareProjectionKeys(left.projectionKey, right.projectionKey));

  return Object.freeze({
    subjectId,
    chronological: Object.freeze(chronological),
    unplaced: Object.freeze(unplaced),
    refused: Object.freeze(refused),
    establishesCausation: false as const,
    persisted: false as const,
  });
}
