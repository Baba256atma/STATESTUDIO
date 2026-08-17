/**
 * PM:1 — deterministic proactive monitoring intelligence.
 *
 * Compares validated canonical observations, evaluates whether the change is
 * executive-significant, and proposes DRI-6 attention signals. It performs no
 * observation, scheduling, Runtime mutation, focus mutation, notification,
 * Advisor initiation, Stage mutation, or durable-memory promotion.
 */
import {
  classifyExecutiveSourceComparison,
  compareExecutiveSources,
  executiveSourceIntelligenceIdentity,
  type ExecutiveSourceAdvisorContext,
  type ExecutiveSourceComparison,
  type ExecutiveSourceMetricDelta,
  type ExecutiveSourceProjectionInput,
  type ExecutiveSourceProvenance,
  type ExecutiveSourceStateTransition,
} from "./executiveSourceIntelligence.ts";
import type { NexoraExecutiveState } from "./dataRealityContracts.ts";
import { NEXORA_EXECUTIVE_STATE_SEVERITY } from "./executiveStateResolution.ts";
import {
  createDirectorRuntimeAttentionSignal,
  createDirectorRuntimeAttentionSignalBatch,
  type DirectorRuntimeAttentionSignal,
} from "../dri/directorRuntimeAttentionSignalContracts.ts";
import {
  resolveDirectorRuntimeAttentionPriority,
  type DirectorRuntimeAttentionPriorityResolutionResult,
} from "../dri/directorRuntimeAttentionPriorityResolution.ts";

export const proactiveMonitoringFoundationIdentity =
  "PM:1/NexoraProactiveMonitoringFoundation" as const;
export const proactiveMonitoringFoundationVersion = "1.0.0" as const;
export const proactiveMonitoringFoundationNamespace =
  "nexora.proactive-monitoring.foundation" as const;

export const PROACTIVE_MONITORING_AUTHORITY_BOUNDARY = Object.freeze({
  observesExternalReality: false as const,
  computesKpis: false as const,
  resolvesExecutiveState: false as const,
  mutatesRuntime: false as const,
  resolvesAttentionPriority: false as const,
  mutatesFocus: false as const,
  mutatesStage: false as const,
  initiatesAdvisor: false as const,
  promotesDurableMemory: false as const,
  sendsNotifications: false as const,
  schedulesObservation: false as const,
  usesLlmSignificance: false as const,
  reusesRdi3Comparison: true as const,
  reusesDri6Attention: true as const,
});

export const NEXORA_MONITORING_SIGNIFICANCE_LEVELS = Object.freeze([
  "none",
  "minor",
  "meaningful",
  "critical",
] as const);
export type NexoraMonitoringSignificance =
  (typeof NEXORA_MONITORING_SIGNIFICANCE_LEVELS)[number];

export const NEXORA_MONITORING_DIRECTIONS = Object.freeze([
  "improved",
  "deteriorated",
  "mixed",
  "unchanged",
] as const);
export type NexoraMonitoringDirection =
  (typeof NEXORA_MONITORING_DIRECTIONS)[number];

export const NEXORA_MONITORING_EVENT_LIFECYCLES = Object.freeze([
  "detected",
  "evaluated",
  "suppressed",
  "attention-candidate",
  "acknowledged",
  "resolved",
] as const);
export type NexoraMonitoringEventLifecycle =
  (typeof NEXORA_MONITORING_EVENT_LIFECYCLES)[number];

export type NexoraMonitoringConditionKind =
  | "new-condition"
  | "changed-condition"
  | "persistent-condition"
  | "escalated-condition"
  | "resolved-condition";

export type NexoraMonitoringTarget = Readonly<{
  targetId: string;
  workspaceId: string;
  sourceId: string;
  connectionId?: string;
  subjectIds: readonly string[];
  metricIds: readonly string[];
  status: "active" | "paused" | "closed";
  createdAt: string;
}>;

export type NexoraMonitoringPolicy = Readonly<{
  policyId: string;
  meaningfulAbsoluteKpiDelta: number;
  criticalAbsoluteKpiDelta: number;
  criticalAffectedSubjectCount: number;
}>;

export const DEFAULT_NEXORA_MONITORING_POLICY: NexoraMonitoringPolicy =
  Object.freeze({
    policyId: "pm1:default-significance-policy",
    meaningfulAbsoluteKpiDelta: 2,
    criticalAbsoluteKpiDelta: 15,
    criticalAffectedSubjectCount: 3,
  });

export type NexoraMonitoringObservationPair = Readonly<{
  previous: ExecutiveSourceProjectionInput;
  current: ExecutiveSourceProjectionInput;
}>;

export type NexoraMonitoringEventProvenance = Readonly<{
  previousObservationId: string;
  currentObservationId: string;
  previous: ExecutiveSourceProvenance;
  current: ExecutiveSourceProvenance;
  comparisonAuthority: typeof executiveSourceIntelligenceIdentity;
  significancePolicyId: string;
}>;

export type NexoraMonitoringChange = Readonly<{
  changeId: string;
  workspaceId: string;
  targetId: string;
  previousObservationId: string;
  currentObservationId: string;
  detectedAt: string;
  objectKey: string;
  subjectId: string;
  subjectLabel: string;
  metricChanges: readonly ExecutiveSourceMetricDelta[];
  stateTransition: ExecutiveSourceStateTransition | null;
  direction: NexoraMonitoringDirection;
  significance: NexoraMonitoringSignificance;
  conditionKind: NexoraMonitoringConditionKind;
  lifecycle: NexoraMonitoringEventLifecycle;
  reasons: readonly string[];
  provenance: NexoraMonitoringEventProvenance;
  memoryDisposition: "candidate-only";
}>;

export type NexoraMonitoringAttentionCandidate = Readonly<{
  candidateId: string;
  eventId: string;
  workspaceId: string;
  subjectId: string;
  significance: "meaningful" | "critical";
  direction: NexoraMonitoringDirection;
  signal: DirectorRuntimeAttentionSignal;
  focusPolicy: "never-steal-explicit-user-focus";
}>;

export type NexoraMonitoringEvaluationStatus =
  | "evaluated"
  | "incompatible"
  | "invalid-observation-pair";

export type NexoraMonitoringResult = Readonly<{
  identity: typeof proactiveMonitoringFoundationIdentity;
  version: typeof proactiveMonitoringFoundationVersion;
  namespace: typeof proactiveMonitoringFoundationNamespace;
  evaluationId: string;
  status: NexoraMonitoringEvaluationStatus;
  compatibilityReason: string;
  target: NexoraMonitoringTarget | null;
  observationPair: Readonly<{
    previousObservationId: string;
    currentObservationId: string;
  }>;
  comparison: ExecutiveSourceComparison;
  events: readonly NexoraMonitoringChange[];
  attentionCandidates: readonly NexoraMonitoringAttentionCandidate[];
  technicalChangeCount: number;
  meaningfulChangeCount: number;
  suppressedChangeCount: number;
  attentionCandidateCount: number;
  direction: NexoraMonitoringDirection;
  significance: NexoraMonitoringSignificance;
  summary: string;
  runtimeDisposition: "read-only";
  memoryDisposition: "no-automatic-promotion";
}>;

const SIGNIFICANCE_RANK: Readonly<Record<NexoraMonitoringSignificance, number>> =
  Object.freeze({ none: 0, minor: 1, meaningful: 2, critical: 3 });

function token(value: string): string {
  return value.trim().replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function observationId(source: ExecutiveSourceProjectionInput): string {
  return source.snapshot.snapshotId;
}

function validObservation(source: ExecutiveSourceProjectionInput): boolean {
  return (
    source.snapshot.validation.state === "valid" &&
    source.dataReality.status !== "invalid" &&
    source.dataReality.kpis.length > 0 &&
    source.dataReality.objectStates.length > 0
  );
}

function emptyComparison(
  pair: NexoraMonitoringObservationPair,
  reason: string,
): ExecutiveSourceComparison {
  return Object.freeze({
    identity: executiveSourceIntelligenceIdentity,
    baseSourceId: pair.previous.sourceContextId,
    comparisonSourceId: pair.current.sourceContextId,
    workspaceId: pair.previous.workspaceId,
    readiness: "incompatible",
    readinessReason: reason,
    changedObjects: Object.freeze([]),
    improvedObjects: Object.freeze([]),
    deterioratedObjects: Object.freeze([]),
    unchangedObjects: Object.freeze([]),
    metricDeltas: Object.freeze([]),
    stateTransitions: Object.freeze([]),
    topChanges: Object.freeze([]),
    summary: reason,
    provenance: Object.freeze([]),
  });
}

export function classifyMonitoringObservationPair(
  pair: NexoraMonitoringObservationPair,
): Readonly<{
  compatible: boolean;
  status: NexoraMonitoringEvaluationStatus;
  reason: string;
}> {
  if (!validObservation(pair.previous) || !validObservation(pair.current)) {
    return Object.freeze({
      compatible: false,
      status: "invalid-observation-pair",
      reason: "Both monitoring observations must be validated canonical RDI/Data Reality results.",
    });
  }
  if (pair.previous.workspaceId !== pair.current.workspaceId) {
    return Object.freeze({
      compatible: false,
      status: "incompatible",
      reason: "Monitoring observations belong to different workspaces.",
    });
  }
  if (pair.previous.sourceContextId !== pair.current.sourceContextId) {
    return Object.freeze({
      compatible: false,
      status: "incompatible",
      reason: "PM:1 source monitoring requires observations from the same source target.",
    });
  }
  if (observationId(pair.previous) === observationId(pair.current)) {
    return Object.freeze({
      compatible: false,
      status: "invalid-observation-pair",
      reason: "Previous and current monitoring observations must be distinct.",
    });
  }
  if (pair.current.committedAt < pair.previous.committedAt) {
    return Object.freeze({
      compatible: false,
      status: "invalid-observation-pair",
      reason: "Current observation cannot precede the previous observation.",
    });
  }
  const rdiCompatibility = classifyExecutiveSourceComparison(
    pair.previous,
    pair.current,
  );
  return Object.freeze({
    compatible: rdiCompatibility.readiness !== "incompatible",
    status:
      rdiCompatibility.readiness === "incompatible"
        ? "incompatible"
        : "evaluated",
    reason: rdiCompatibility.reason,
  });
}

export function createNexoraMonitoringTarget(
  pair: NexoraMonitoringObservationPair,
  comparison: ExecutiveSourceComparison,
): NexoraMonitoringTarget {
  const sourceId = pair.current.sourceContextId;
  const connectionId = pair.current.snapshot.source.identity.connectionId;
  return Object.freeze({
    targetId: `pm1:target:${token(pair.current.workspaceId)}:${token(sourceId)}`,
    workspaceId: pair.current.workspaceId,
    sourceId,
    ...(connectionId ? { connectionId } : {}),
    subjectIds: Object.freeze(
      [...new Set(comparison.stateTransitions.map((entry) =>
        entry.stageObjectId ?? entry.objectKey))].sort(),
    ),
    metricIds: Object.freeze(
      [...new Set(comparison.metricDeltas.map((entry) => entry.kpiId))].sort(),
    ),
    status: "active",
    createdAt: pair.previous.committedAt,
  });
}

function maxSignificance(
  values: readonly NexoraMonitoringSignificance[],
): NexoraMonitoringSignificance {
  return values.reduce<NexoraMonitoringSignificance>(
    (current, candidate) =>
      SIGNIFICANCE_RANK[candidate] > SIGNIFICANCE_RANK[current]
        ? candidate
        : current,
    "none",
  );
}

function stateRank(state: NexoraExecutiveState): number {
  return NEXORA_EXECUTIVE_STATE_SEVERITY[state];
}

function eventDirection(
  transition: ExecutiveSourceStateTransition | undefined,
  deltas: readonly ExecutiveSourceMetricDelta[],
): NexoraMonitoringDirection {
  if (transition && transition.direction !== "unchanged") {
    return transition.direction;
  }
  const directions = new Set(
    deltas
      .filter((entry) => entry.delta !== 0)
      .map((entry) => entry.direction),
  );
  if (directions.has("improved") && directions.has("deteriorated")) return "mixed";
  if (directions.has("deteriorated")) return "deteriorated";
  if (directions.has("improved")) return "improved";
  return "unchanged";
}

function significanceFor(
  transition: ExecutiveSourceStateTransition | undefined,
  deltas: readonly ExecutiveSourceMetricDelta[],
  policy: NexoraMonitoringPolicy,
): NexoraMonitoringSignificance {
  if (transition && transition.from !== transition.to) {
    if (
      transition.direction === "deteriorated" &&
      transition.to === "critical"
    ) {
      return "critical";
    }
    return "meaningful";
  }
  const magnitude = Math.max(0, ...deltas.map((entry) => Math.abs(entry.delta)));
  if (magnitude >= policy.criticalAbsoluteKpiDelta) return "critical";
  if (magnitude >= policy.meaningfulAbsoluteKpiDelta) return "meaningful";
  if (magnitude > 0) return "minor";
  return "none";
}

function conditionKindFor(
  transition: ExecutiveSourceStateTransition | undefined,
  direction: NexoraMonitoringDirection,
  significance: NexoraMonitoringSignificance,
): NexoraMonitoringConditionKind {
  if (!transition) return "changed-condition";
  if (transition.from !== transition.to) {
    if (stateRank(transition.to) > stateRank(transition.from)) {
      return transition.from === "normal"
        ? "new-condition"
        : "escalated-condition";
    }
    return "resolved-condition";
  }
  if (
    transition.to !== "normal" &&
    direction === "deteriorated" &&
    SIGNIFICANCE_RANK[significance] >= SIGNIFICANCE_RANK.meaningful
  ) {
    return "escalated-condition";
  }
  return transition.to === "normal"
    ? "changed-condition"
    : "persistent-condition";
}

function reasonsFor(
  transition: ExecutiveSourceStateTransition | undefined,
  deltas: readonly ExecutiveSourceMetricDelta[],
  significance: NexoraMonitoringSignificance,
  conditionKind: NexoraMonitoringConditionKind,
  policy: NexoraMonitoringPolicy,
): readonly string[] {
  const reasons: string[] = [];
  if (transition?.from !== transition?.to) {
    reasons.push(
      `Canonical executive state changed ${transition?.from} → ${transition?.to}.`,
    );
  }
  const largest = [...deltas].sort(
    (left, right) => Math.abs(right.delta) - Math.abs(left.delta),
  )[0];
  if (largest && largest.delta !== 0) {
    reasons.push(
      `${largest.label} changed ${largest.baseValue.toFixed(1)} → ${largest.comparisonValue.toFixed(1)}${largest.unit}.`,
    );
  }
  if (significance === "minor") {
    reasons.push(
      `Canonical movement is below the ${policy.meaningfulAbsoluteKpiDelta}${largest?.unit ?? ""} executive-significance threshold.`,
    );
  }
  if (conditionKind === "persistent-condition") {
    reasons.push("The existing condition persisted without material escalation.");
  }
  return Object.freeze(reasons);
}

function lifecycleFor(
  significance: NexoraMonitoringSignificance,
  conditionKind: NexoraMonitoringConditionKind,
): NexoraMonitoringEventLifecycle {
  if (significance === "none" || significance === "minor") return "suppressed";
  if (conditionKind === "persistent-condition") return "suppressed";
  if (conditionKind === "resolved-condition") return "resolved";
  return "attention-candidate";
}

function createAttentionCandidate(
  event: NexoraMonitoringChange,
): NexoraMonitoringAttentionCandidate | null {
  if (
    event.lifecycle !== "attention-candidate" &&
    event.lifecycle !== "resolved"
  ) {
    return null;
  }
  if (event.significance !== "meaningful" && event.significance !== "critical") {
    return null;
  }
  const candidateId = `pm1:attention:${token(event.changeId)}`;
  const reason =
    event.significance === "critical"
      ? "critical-state"
      : event.direction === "deteriorated"
        ? "risk"
        : "context-relevance";
  const signal = createDirectorRuntimeAttentionSignal({
    signalId: candidateId,
    subject: Object.freeze({ subjectId: event.subjectId, subjectKind: "object" }),
    source: "kpi",
    reason,
    scope: "workspace",
    requestedLevel:
      event.direction === "improved" ? "context" : "secondary",
    persistence: "session",
    intent: "request-awareness",
    origin: Object.freeze({ source: "kpi", originId: event.changeId }),
    correlationId: event.currentObservationId,
    groupId: event.targetId,
  });
  return Object.freeze({
    candidateId,
    eventId: event.changeId,
    workspaceId: event.workspaceId,
    subjectId: event.subjectId,
    significance: event.significance,
    direction: event.direction,
    signal,
    focusPolicy: "never-steal-explicit-user-focus",
  });
}

function overallDirection(
  events: readonly NexoraMonitoringChange[],
): NexoraMonitoringDirection {
  const meaningful = events.filter(
    (event) => SIGNIFICANCE_RANK[event.significance] >= SIGNIFICANCE_RANK.meaningful,
  );
  const values = new Set(meaningful.map((event) => event.direction));
  if (values.has("mixed") || (values.has("improved") && values.has("deteriorated"))) {
    return "mixed";
  }
  if (values.has("deteriorated")) return "deteriorated";
  if (values.has("improved")) return "improved";
  return "unchanged";
}

function monitoringSummary(
  meaningfulCount: number,
  candidateCount: number,
  direction: NexoraMonitoringDirection,
): string {
  if (meaningfulCount === 0) {
    return "No meaningful change detected; technical evidence was preserved without executive interruption.";
  }
  return `${meaningfulCount} meaningful change${meaningfulCount === 1 ? "" : "s"} detected (${direction}); ${candidateCount} may require executive attention.`;
}

export function evaluateProactiveMonitoring(
  pair: NexoraMonitoringObservationPair,
  policy: NexoraMonitoringPolicy = DEFAULT_NEXORA_MONITORING_POLICY,
): NexoraMonitoringResult {
  const classification = classifyMonitoringObservationPair(pair);
  const previousObservationId = observationId(pair.previous);
  const currentObservationId = observationId(pair.current);
  const evaluationId = `pm1:evaluation:${token(pair.previous.workspaceId)}:${token(previousObservationId)}:${token(currentObservationId)}:${token(policy.policyId)}`;
  if (!classification.compatible) {
    const comparison = emptyComparison(pair, classification.reason);
    return Object.freeze({
      identity: proactiveMonitoringFoundationIdentity,
      version: proactiveMonitoringFoundationVersion,
      namespace: proactiveMonitoringFoundationNamespace,
      evaluationId,
      status: classification.status,
      compatibilityReason: classification.reason,
      target: null,
      observationPair: Object.freeze({ previousObservationId, currentObservationId }),
      comparison,
      events: Object.freeze([]),
      attentionCandidates: Object.freeze([]),
      technicalChangeCount: 0,
      meaningfulChangeCount: 0,
      suppressedChangeCount: 0,
      attentionCandidateCount: 0,
      direction: "unchanged",
      significance: "none",
      summary: classification.reason,
      runtimeDisposition: "read-only",
      memoryDisposition: "no-automatic-promotion",
    });
  }

  const comparison = compareExecutiveSources(pair.previous, pair.current);
  const target = createNexoraMonitoringTarget(pair, comparison);
  const transitionByObject = new Map(
    comparison.stateTransitions.map((entry) => [entry.objectKey, entry]),
  );
  const deltasByObject = new Map<string, ExecutiveSourceMetricDelta[]>();
  for (const delta of comparison.metricDeltas) {
    const current = deltasByObject.get(delta.objectKey) ?? [];
    current.push(delta);
    deltasByObject.set(delta.objectKey, current);
  }
  const objectKeys = [...new Set([
    ...transitionByObject.keys(),
    ...deltasByObject.keys(),
  ])].sort();
  const provenance = Object.freeze({
    previousObservationId,
    currentObservationId,
    previous: comparison.provenance[0]!,
    current: comparison.provenance[1]!,
    comparisonAuthority: comparison.identity,
    significancePolicyId: policy.policyId,
  });
  const events = Object.freeze(objectKeys.flatMap((objectKey) => {
    const transition = transitionByObject.get(objectKey);
    const deltas = Object.freeze([...(deltasByObject.get(objectKey) ?? [])]);
    const hasTechnicalDelta = deltas.some((entry) => entry.delta !== 0);
    const hasStateChange = transition !== undefined && transition.from !== transition.to;
    const hasPersistentCondition = transition !== undefined && transition.to !== "normal";
    if (!hasTechnicalDelta && !hasStateChange && !hasPersistentCondition) return [];
    const direction = eventDirection(transition, deltas);
    const significance = significanceFor(transition, deltas, policy);
    const conditionKind = conditionKindFor(transition, direction, significance);
    const subjectId = transition?.stageObjectId ?? objectKey;
    const subjectLabel = transition?.objectLabel ?? deltas[0]?.objectLabel ?? objectKey;
    const lifecycle = lifecycleFor(significance, conditionKind);
    return [Object.freeze({
      changeId: `pm1:change:${token(target.targetId)}:${token(objectKey)}:${token(previousObservationId)}:${token(currentObservationId)}`,
      workspaceId: pair.current.workspaceId,
      targetId: target.targetId,
      previousObservationId,
      currentObservationId,
      detectedAt: pair.current.committedAt,
      objectKey,
      subjectId,
      subjectLabel,
      metricChanges: deltas,
      stateTransition: transition ?? null,
      direction,
      significance,
      conditionKind,
      lifecycle,
      reasons: reasonsFor(transition, deltas, significance, conditionKind, policy),
      provenance,
      memoryDisposition: "candidate-only" as const,
    })];
  }));

  const attentionCandidates = Object.freeze(
    events.flatMap((event) => {
      const candidate = createAttentionCandidate(event);
      return candidate ? [candidate] : [];
    }),
  );
  const meaningfulEvents = events.filter(
    (event) => SIGNIFICANCE_RANK[event.significance] >= SIGNIFICANCE_RANK.meaningful,
  );
  let significance = maxSignificance(events.map((event) => event.significance));
  if (
    meaningfulEvents.length >= policy.criticalAffectedSubjectCount &&
    significance === "meaningful"
  ) {
    significance = "critical";
  }
  const direction = overallDirection(events);

  return Object.freeze({
    identity: proactiveMonitoringFoundationIdentity,
    version: proactiveMonitoringFoundationVersion,
    namespace: proactiveMonitoringFoundationNamespace,
    evaluationId,
    status: "evaluated",
    compatibilityReason: classification.reason,
    target,
    observationPair: Object.freeze({ previousObservationId, currentObservationId }),
    comparison,
    events,
    attentionCandidates,
    technicalChangeCount: events.filter((event) =>
      event.metricChanges.some((entry) => entry.delta !== 0) ||
      event.stateTransition?.from !== event.stateTransition?.to).length,
    meaningfulChangeCount: meaningfulEvents.length,
    suppressedChangeCount: events.filter((event) => event.lifecycle === "suppressed").length,
    attentionCandidateCount: attentionCandidates.length,
    direction,
    significance,
    summary: monitoringSummary(meaningfulEvents.length, attentionCandidates.length, direction),
    runtimeDisposition: "read-only",
    memoryDisposition: "no-automatic-promotion",
  });
}

export function resolveMonitoringAttentionWithExistingSignals(
  result: NexoraMonitoringResult,
  existingSignals: readonly DirectorRuntimeAttentionSignal[] = Object.freeze([]),
): DirectorRuntimeAttentionPriorityResolutionResult {
  return resolveDirectorRuntimeAttentionPriority(
    createDirectorRuntimeAttentionSignalBatch({
      batchId: `pm1:attention-batch:${token(result.evaluationId)}`,
      correlationId: result.observationPair.currentObservationId,
      signals: Object.freeze([
        ...existingSignals,
        ...result.attentionCandidates.map((entry) => entry.signal),
      ]),
    }),
  );
}

export function createMonitoringAdvisorContext(
  result: NexoraMonitoringResult,
): ExecutiveSourceAdvisorContext {
  const eventKeys = new Set(result.events
    .filter((event) => event.significance === "meaningful" || event.significance === "critical")
    .map((event) => event.objectKey));
  return Object.freeze({
    contextKind: "source-comparison",
    workspaceId: result.comparison.workspaceId,
    title: "Monitoring changes",
    summary: result.summary,
    sourceIds: Object.freeze([
      result.comparison.baseSourceId,
      result.comparison.comparisonSourceId,
    ]),
    affectedStageObjectIds: Object.freeze(result.events
      .filter((event) => eventKeys.has(event.objectKey))
      .map((event) => event.subjectId)),
    stateTransitions: Object.freeze(result.comparison.stateTransitions
      .filter((entry) => eventKeys.has(entry.objectKey))),
    metricDeltas: Object.freeze(result.comparison.metricDeltas
      .filter((entry) => eventKeys.has(entry.objectKey))),
    provenance: result.comparison.provenance,
    memoryPolicy: "current-facts-override-history",
  });
}

export function acknowledgeMonitoringChange(
  event: NexoraMonitoringChange,
): NexoraMonitoringChange {
  return Object.freeze({ ...event, lifecycle: "acknowledged" });
}

export type ProactiveMonitoringCertificationGate =
  | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I"
  | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R";

export function certifyProactiveMonitoringFoundation(
  evidence: Readonly<Record<ProactiveMonitoringCertificationGate, boolean>>,
) {
  const gates = Object.freeze(
    (Object.keys(evidence) as ProactiveMonitoringCertificationGate[])
      .sort()
      .map((gate) => Object.freeze({ gate, passed: evidence[gate] })),
  );
  return Object.freeze({
    certified: gates.length === 18 && gates.every((entry) => entry.passed),
    passedGateCount: gates.filter((entry) => entry.passed).length,
    failedGateCount: gates.filter((entry) => !entry.passed).length,
    gates,
  });
}
