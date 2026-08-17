/** PM:4 — grounded proactive advice delivered through the existing Advisor. */
import {
  createMonitoringAdvisorContext,
  type NexoraMonitoringChange,
  type NexoraMonitoringResult,
} from "./proactiveMonitoringFoundation.ts";
import type { ExecutiveSourceAdvisorContext } from "./executiveSourceIntelligence.ts";
import { buildDurableExecutiveAdvisorMemoryContext } from "../executiveMemory/durableExecutiveMemory.ts";
import { isExecutiveMemoryStorageEngineInitialized } from "../executiveMemory/executiveMemoryStorageEngine.ts";

export const proactiveAdvisorDeliveryIdentity =
  "PM:4/NexoraProactiveAdvisorDelivery" as const;
export const proactiveAdvisorDeliveryVersion = "1.0.0" as const;
export const proactiveAdvisorDeliveryNamespace =
  "nexora.proactive-monitoring.advisor-delivery" as const;

export const PROACTIVE_ADVISOR_AUTHORITY_BOUNDARY = Object.freeze({
  ownsCurrentTruth: false as const,
  ownsBusinessMeaning: false as const,
  ownsSignificance: false as const,
  ownsAttentionPriority: false as const,
  mutatesRuntime: false as const,
  mutatesStageFocus: false as const,
  initiatesBusinessAction: false as const,
  writesDurableMemory: false as const,
  externalNotificationDelivery: false as const,
  deliverySurface: "existing-executive-advisor" as const,
  runtimeScope: "foreground-session" as const,
  attentionDependency: "DRI-6/minimum-delivery-boundary-no-PM3" as const,
});

export const NEXORA_PROACTIVE_ADVISOR_PRIORITIES = Object.freeze([
  "informational",
  "important",
  "urgent",
] as const);
export type NexoraProactiveAdvisorPriority =
  (typeof NEXORA_PROACTIVE_ADVISOR_PRIORITIES)[number];

export const NEXORA_PROACTIVE_ADVISOR_DELIVERY_STATES = Object.freeze([
  "candidate",
  "queued",
  "delivered",
  "acknowledged",
  "dismissed",
  "superseded",
  "resolved",
  "suppressed",
] as const);
export type NexoraProactiveAdvisorDeliveryState =
  (typeof NEXORA_PROACTIVE_ADVISOR_DELIVERY_STATES)[number];

export type NexoraProactiveAdvisorHistoricalContext = Readonly<{
  memoryId: string;
  summary: string;
  source: string;
  confidence: number | null;
  provenance: readonly string[];
}>;

export type NexoraProactiveAdvisorEvidence = Readonly<{
  evidenceId: string;
  monitoringEventId: string;
  subjectId: string;
  kind: "state-transition" | "kpi-delta";
  statement: string;
  previousObservationId: string;
  currentObservationId: string;
  sourceFields: readonly string[];
  transformationRefs: readonly string[];
}>;

export type NexoraProactiveAdvisorBrief = Readonly<{
  identity: typeof proactiveAdvisorDeliveryIdentity;
  version: typeof proactiveAdvisorDeliveryVersion;
  namespace: typeof proactiveAdvisorDeliveryNamespace;
  briefId: string;
  deliveryFingerprint: string;
  workspaceId: string;
  monitoringEventIds: readonly string[];
  attentionCandidateIds: readonly string[];
  subjectIds: readonly string[];
  priority: NexoraProactiveAdvisorPriority;
  status: NexoraProactiveAdvisorDeliveryState;
  headline: string;
  summary: string;
  currentFacts: readonly string[];
  changes: readonly string[];
  evidence: readonly NexoraProactiveAdvisorEvidence[];
  provenance: Readonly<{
    previousObservationId: string;
    currentObservationId: string;
    monitoringEvaluationId: string;
    monitoringAuthority: string;
    sourceIds: readonly string[];
  }>;
  historicalContext: readonly NexoraProactiveAdvisorHistoricalContext[];
  historyBoundary: "current-facts-override-history";
  suggestedNextQuestions: readonly string[];
  advisorContext: ExecutiveSourceAdvisorContext;
  createdAt: string;
  deliveredAt: string | null;
  acknowledgedAt: string | null;
  dismissedAt: string | null;
  supersededBy: string | null;
  generation: "deterministic-canonical-fallback" | "grounded-language-enhancement";
  runtimeDisposition: "read-only";
  memoryDisposition: "no-automatic-promotion";
}>;

export type NexoraProactiveAdvisorEligibility = Readonly<{
  eligible: boolean;
  reason:
    | "eligible"
    | "no-meaningful-change"
    | "no-attention-candidate"
    | "persistent-condition"
    | "not-actionable";
  priority: NexoraProactiveAdvisorPriority | null;
  eventIds: readonly string[];
}>;

const PRIORITY_RANK: Readonly<Record<NexoraProactiveAdvisorPriority, number>> =
  Object.freeze({ urgent: 0, important: 1, informational: 2 });

function stableToken(value: string): string {
  return value.trim().replace(/[^a-zA-Z0-9._-]+/g, "_");
}

function eligibleEvents(result: NexoraMonitoringResult): readonly NexoraMonitoringChange[] {
  const candidateEventIds = new Set(result.attentionCandidates.map((entry) => entry.eventId));
  return Object.freeze(result.events.filter((event) =>
    candidateEventIds.has(event.changeId) &&
    (event.significance === "meaningful" || event.significance === "critical") &&
    event.conditionKind !== "persistent-condition" &&
    (event.lifecycle === "attention-candidate" || event.lifecycle === "resolved")));
}

function priorityFor(events: readonly NexoraMonitoringChange[]): NexoraProactiveAdvisorPriority {
  if (events.some((event) => event.significance === "critical" || event.conditionKind === "escalated-condition")) return "urgent";
  if (events.some((event) => event.direction === "deteriorated" || event.conditionKind === "new-condition")) return "important";
  return "informational";
}

export function evaluateProactiveAdvisorEligibility(
  result: NexoraMonitoringResult,
): NexoraProactiveAdvisorEligibility {
  if (result.meaningfulChangeCount === 0) {
    return Object.freeze({ eligible: false, reason: "no-meaningful-change", priority: null, eventIds: Object.freeze([]) });
  }
  if (result.attentionCandidateCount === 0) {
    return Object.freeze({ eligible: false, reason: "no-attention-candidate", priority: null, eventIds: Object.freeze([]) });
  }
  const events = eligibleEvents(result);
  if (events.length === 0) {
    const persistent = result.events.some((event) => event.conditionKind === "persistent-condition");
    return Object.freeze({ eligible: false, reason: persistent ? "persistent-condition" : "not-actionable", priority: null, eventIds: Object.freeze([]) });
  }
  return Object.freeze({
    eligible: true,
    reason: "eligible",
    priority: priorityFor(events),
    eventIds: Object.freeze(events.map((event) => event.changeId).sort()),
  });
}

function changeStatement(event: NexoraMonitoringChange): string {
  if (event.stateTransition && event.stateTransition.from !== event.stateTransition.to) {
    return `${event.subjectLabel} moved from ${event.stateTransition.from.toUpperCase()} to ${event.stateTransition.to.toUpperCase()}.`;
  }
  const metric = event.metricChanges.find((entry) => entry.delta !== 0);
  return metric
    ? `${event.subjectLabel} ${metric.label} changed from ${metric.baseValue.toFixed(1)} to ${metric.comparisonValue.toFixed(1)}${metric.unit}.`
    : `${event.subjectLabel} changed materially.`;
}

function evidenceFor(event: NexoraMonitoringChange): readonly NexoraProactiveAdvisorEvidence[] {
  const presentSourceField = (field: string | null): field is string => field !== null;
  const stateEvidence = event.stateTransition && event.stateTransition.from !== event.stateTransition.to
    ? [Object.freeze({
      evidenceId: `${event.changeId}:state`,
      monitoringEventId: event.changeId,
      subjectId: event.subjectId,
      kind: "state-transition" as const,
      statement: changeStatement(event),
      previousObservationId: event.previousObservationId,
      currentObservationId: event.currentObservationId,
      sourceFields: Object.freeze(event.metricChanges.flatMap((entry) => [entry.baseSourceField, entry.comparisonSourceField]).filter(presentSourceField)),
      transformationRefs: Object.freeze([...new Set([
        ...event.provenance.previous.transformationRefs,
        ...event.provenance.current.transformationRefs,
      ])].sort()),
    })]
    : [];
  const metricEvidence = event.metricChanges.filter((entry) => entry.delta !== 0).map((entry) => Object.freeze({
    evidenceId: `${event.changeId}:metric:${entry.kpiId}`,
    monitoringEventId: event.changeId,
    subjectId: event.subjectId,
    kind: "kpi-delta" as const,
    statement: `${entry.label}: ${entry.baseValue.toFixed(1)} → ${entry.comparisonValue.toFixed(1)}${entry.unit}.`,
    previousObservationId: event.previousObservationId,
    currentObservationId: event.currentObservationId,
    sourceFields: Object.freeze([entry.baseSourceField, entry.comparisonSourceField].filter(presentSourceField)),
    transformationRefs: Object.freeze([...new Set([
      ...event.provenance.previous.transformationRefs,
      ...event.provenance.current.transformationRefs,
    ])].sort()),
  }));
  return Object.freeze([...stateEvidence, ...metricEvidence]);
}

function headlineFor(events: readonly NexoraMonitoringChange[], priority: NexoraProactiveAdvisorPriority): string {
  if (events.length > 1) return `${events.length} executive objects changed materially`;
  const event = events[0]!;
  if (event.conditionKind === "resolved-condition") return `${event.subjectLabel} recovered`;
  if (priority === "urgent") return `${event.subjectLabel} requires urgent attention`;
  return `${event.subjectLabel} requires attention`;
}

function suggestedQuestions(events: readonly NexoraMonitoringChange[]): readonly string[] {
  const primary = events[0]!;
  const questions = [
    `Why did ${primary.subjectLabel} ${primary.direction === "improved" ? "improve" : "deteriorate"}?`,
    "What changed since the previous observation?",
  ];
  if (events.length > 1) questions.push("Which affected object should be reviewed first?");
  questions.push("What decisions worked in a similar prior situation?");
  return Object.freeze(questions);
}

export function createProactiveAdvisorBrief(input: Readonly<{
  monitoring: NexoraMonitoringResult;
  historicalContext?: readonly NexoraProactiveAdvisorHistoricalContext[];
}>): NexoraProactiveAdvisorBrief | null {
  const eligibility = evaluateProactiveAdvisorEligibility(input.monitoring);
  if (!eligibility.eligible || !eligibility.priority) return null;
  const eventIds = new Set(eligibility.eventIds);
  const events = Object.freeze(input.monitoring.events.filter((event) => eventIds.has(event.changeId)));
  const subjectIds = Object.freeze([...new Set(events.map((event) => event.subjectId))].sort());
  const monitoringEventIds = Object.freeze(events.map((event) => event.changeId).sort());
  const attentionCandidateIds = Object.freeze(input.monitoring.attentionCandidates
    .filter((entry) => eventIds.has(entry.eventId))
    .map((entry) => entry.candidateId)
    .sort());
  const deliveryFingerprint = `pm4:${input.monitoring.comparison.workspaceId}:${input.monitoring.observationPair.currentObservationId}:${monitoringEventIds.join("+")}`;
  const changes = Object.freeze(events.map(changeStatement));
  const currentFacts = Object.freeze(events.flatMap((event) => {
    const state = event.stateTransition
      ? [`${event.subjectLabel} current executive state is ${event.stateTransition.to.toUpperCase()}.`]
      : [];
    const metrics = event.metricChanges.map((entry) =>
      `${entry.objectLabel} ${entry.label} is ${entry.comparisonValue.toFixed(1)}${entry.unit}.`);
    return [...state, ...metrics];
  }));
  const historicalContext = Object.freeze([...(input.historicalContext ?? [])].slice(0, 3).map((entry) => Object.freeze({
    ...entry,
    provenance: Object.freeze([...entry.provenance]),
  })));
  const evidence = Object.freeze(events.flatMap(evidenceFor));
  const priority = eligibility.priority;
  return Object.freeze({
    identity: proactiveAdvisorDeliveryIdentity,
    version: proactiveAdvisorDeliveryVersion,
    namespace: proactiveAdvisorDeliveryNamespace,
    briefId: `pm4:brief:${stableToken(deliveryFingerprint)}`,
    deliveryFingerprint,
    workspaceId: input.monitoring.comparison.workspaceId,
    monitoringEventIds,
    attentionCandidateIds,
    subjectIds,
    priority,
    status: "candidate",
    headline: headlineFor(events, priority),
    summary: changes.join(" "),
    currentFacts,
    changes,
    evidence,
    provenance: Object.freeze({
      previousObservationId: input.monitoring.observationPair.previousObservationId,
      currentObservationId: input.monitoring.observationPair.currentObservationId,
      monitoringEvaluationId: input.monitoring.evaluationId,
      monitoringAuthority: input.monitoring.identity,
      sourceIds: Object.freeze([
        input.monitoring.comparison.baseSourceId,
        input.monitoring.comparison.comparisonSourceId,
      ]),
    }),
    historicalContext,
    historyBoundary: "current-facts-override-history",
    suggestedNextQuestions: suggestedQuestions(events),
    advisorContext: createMonitoringAdvisorContext(input.monitoring),
    createdAt: events.map((event) => event.detectedAt).sort()[0] ?? input.monitoring.comparison.provenance[1]?.importedAt ?? "",
    deliveredAt: null,
    acknowledgedAt: null,
    dismissedAt: null,
    supersededBy: null,
    generation: "deterministic-canonical-fallback",
    runtimeDisposition: "read-only",
    memoryDisposition: "no-automatic-promotion",
  });
}

/** Reads bounded, relevant APP-4 history only when its existing engine is active. */
export function createProactiveAdvisorBriefWithDurableHistory(
  monitoring: NexoraMonitoringResult,
): NexoraProactiveAdvisorBrief | null {
  const current = createProactiveAdvisorBrief({ monitoring });
  if (!current || !isExecutiveMemoryStorageEngineInitialized()) return current;
  const memory = buildDurableExecutiveAdvisorMemoryContext({
    workspaceId: current.workspaceId,
    currentSubjectId: current.subjectIds[0]!,
    relatedSubjectIds: current.subjectIds.slice(1),
    currentFacts: current.currentFacts,
    limit: 3,
  });
  if (memory.historicalMemories.length === 0) return current;
  return createProactiveAdvisorBrief({
    monitoring,
    historicalContext: memory.historicalMemories,
  });
}

type Listener = () => void;
const listeners = new Set<Listener>();
let version = 0;
let briefsByWorkspace: Readonly<Record<string, readonly NexoraProactiveAdvisorBrief[]>> = Object.freeze({});

function publish(): void {
  version += 1;
  listeners.forEach((listener) => listener());
}

export function subscribeProactiveAdvisorDelivery(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getProactiveAdvisorDeliveryVersion(): number {
  return version;
}

function saveWorkspace(workspaceId: string, briefs: readonly NexoraProactiveAdvisorBrief[]): void {
  briefsByWorkspace = Object.freeze({ ...briefsByWorkspace, [workspaceId]: Object.freeze([...briefs]) });
  publish();
}

export function listProactiveAdvisorBriefs(workspaceId: string): readonly NexoraProactiveAdvisorBrief[] {
  return briefsByWorkspace[workspaceId] ?? Object.freeze([]);
}

function withStatus(
  brief: NexoraProactiveAdvisorBrief,
  status: NexoraProactiveAdvisorDeliveryState,
  timestamp: string,
  supersededBy: string | null = brief.supersededBy,
): NexoraProactiveAdvisorBrief {
  return Object.freeze({
    ...brief,
    status,
    deliveredAt: status === "delivered" ? timestamp : brief.deliveredAt,
    acknowledgedAt: status === "acknowledged" ? timestamp : brief.acknowledgedAt,
    dismissedAt: status === "dismissed" ? timestamp : brief.dismissedAt,
    supersededBy,
  });
}

export function enqueueProactiveAdvisorBrief(input: Readonly<{
  monitoring: NexoraMonitoringResult;
  historicalContext?: readonly NexoraProactiveAdvisorHistoricalContext[];
}>): Readonly<{
  enqueued: boolean;
  reason: "queued" | "suppressed" | "already-delivered";
  brief: NexoraProactiveAdvisorBrief | null;
}> {
  const candidate = input.historicalContext
    ? createProactiveAdvisorBrief(input)
    : createProactiveAdvisorBriefWithDurableHistory(input.monitoring);
  if (!candidate) return Object.freeze({ enqueued: false, reason: "suppressed", brief: null });
  const existing = listProactiveAdvisorBriefs(candidate.workspaceId);
  const duplicate = existing.find((brief) => brief.deliveryFingerprint === candidate.deliveryFingerprint);
  if (duplicate) return Object.freeze({ enqueued: false, reason: "already-delivered", brief: duplicate });
  const recovery = candidate.priority === "informational" && candidate.changes.some((change) => /recovered| to NORMAL/i.test(change));
  const superseded = existing.map((brief) => {
    const overlaps = brief.subjectIds.some((subjectId) => candidate.subjectIds.includes(subjectId));
    if (recovery && overlaps && (brief.status === "candidate" || brief.status === "queued")) {
      return withStatus(brief, "superseded", candidate.createdAt, candidate.briefId);
    }
    if (recovery && overlaps && brief.status === "delivered") {
      return withStatus(brief, "resolved", candidate.createdAt);
    }
    return brief;
  });
  const queued = Object.freeze({ ...candidate, status: "queued" as const });
  saveWorkspace(candidate.workspaceId, Object.freeze([...superseded, queued]));
  return Object.freeze({ enqueued: true, reason: "queued", brief: queued });
}

export function getNextProactiveAdvisorBrief(
  workspaceId: string,
): NexoraProactiveAdvisorBrief | null {
  const available = listProactiveAdvisorBriefs(workspaceId)
    .filter((brief) => brief.status === "delivered" || brief.status === "queued")
    .sort((left, right) => {
      if (left.status === "delivered" && right.status !== "delivered") return -1;
      if (right.status === "delivered" && left.status !== "delivered") return 1;
      return PRIORITY_RANK[left.priority] - PRIORITY_RANK[right.priority] ||
        left.createdAt.localeCompare(right.createdAt) ||
        left.briefId.localeCompare(right.briefId);
    });
  return available[0] ?? null;
}

function transitionBrief(
  workspaceId: string,
  briefId: string,
  status: NexoraProactiveAdvisorDeliveryState,
  timestamp: string,
): NexoraProactiveAdvisorBrief | null {
  let updated: NexoraProactiveAdvisorBrief | null = null;
  const next = listProactiveAdvisorBriefs(workspaceId).map((brief) => {
    if (brief.briefId !== briefId) return brief;
    updated = withStatus(brief, status, timestamp);
    return updated;
  });
  if (updated) saveWorkspace(workspaceId, Object.freeze(next));
  return updated;
}

export const deliverProactiveAdvisorBrief = (workspaceId: string, briefId: string, timestamp: string) =>
  transitionBrief(workspaceId, briefId, "delivered", timestamp);
export const acknowledgeProactiveAdvisorBrief = (workspaceId: string, briefId: string, timestamp: string) =>
  transitionBrief(workspaceId, briefId, "acknowledged", timestamp);
export const dismissProactiveAdvisorBrief = (workspaceId: string, briefId: string, timestamp: string) =>
  transitionBrief(workspaceId, briefId, "dismissed", timestamp);

export function applyGroundedProactiveAdvisorWording(input: Readonly<{
  brief: NexoraProactiveAdvisorBrief;
  headline: string;
  summary: string;
  claimedEvidenceIds: readonly string[];
}>): NexoraProactiveAdvisorBrief {
  const supported = new Set(input.brief.evidence.map((entry) => entry.evidenceId));
  if (!input.claimedEvidenceIds.every((id) => supported.has(id))) return input.brief;
  const canonicalStatements = new Set([
    input.brief.headline,
    input.brief.summary,
    ...input.brief.currentFacts,
    ...input.brief.changes,
    ...input.brief.evidence.map((entry) => entry.statement),
  ].map((statement) => statement.trim()));
  const headline = input.headline.trim();
  const summary = input.summary.trim();
  if (!canonicalStatements.has(headline) || !canonicalStatements.has(summary)) return input.brief;
  return Object.freeze({
    ...input.brief,
    headline,
    summary,
    generation: "grounded-language-enhancement",
  });
}

export function resetProactiveAdvisorDeliveryForTests(): void {
  briefsByWorkspace = Object.freeze({});
  version = 0;
  listeners.clear();
}

export type NexoraProactiveAdvisorRecoverySnapshot = Readonly<{
  briefs: readonly NexoraProactiveAdvisorBrief[];
}>;

/** PM:5 persistence seam; conversations and generated UI state are not included. */
export function exportProactiveAdvisorRecoverySnapshot(): NexoraProactiveAdvisorRecoverySnapshot {
  return Object.freeze({
    briefs: Object.freeze(Object.values(briefsByWorkspace).flatMap((briefs) => briefs).sort((a, b) => a.briefId.localeCompare(b.briefId))),
  });
}

export function hydrateProactiveAdvisorRecoverySnapshot(
  snapshot: NexoraProactiveAdvisorRecoverySnapshot,
): void {
  const next: Record<string, NexoraProactiveAdvisorBrief[]> = {};
  const seen = new Set<string>();
  for (const brief of snapshot.briefs) {
    if (!brief.workspaceId || !brief.briefId || seen.has(brief.deliveryFingerprint)) continue;
    seen.add(brief.deliveryFingerprint);
    next[brief.workspaceId] ??= [];
    next[brief.workspaceId]!.push(brief);
  }
  briefsByWorkspace = Object.freeze(Object.fromEntries(Object.entries(next).map(([workspaceId, briefs]) => [workspaceId, Object.freeze(briefs)])));
  publish();
}

export type ProactiveAdvisorCertificationGate =
  | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J"
  | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T";

export function certifyProactiveAdvisorDelivery(
  evidence: Readonly<Record<ProactiveAdvisorCertificationGate, boolean>>,
) {
  const gates = Object.freeze((Object.keys(evidence) as ProactiveAdvisorCertificationGate[])
    .sort()
    .map((gate) => Object.freeze({ gate, passed: evidence[gate] })));
  return Object.freeze({
    certified: gates.length === 20 && gates.every((entry) => entry.passed),
    passedGateCount: gates.filter((entry) => entry.passed).length,
    failedGateCount: gates.filter((entry) => !entry.passed).length,
    gates,
  });
}
