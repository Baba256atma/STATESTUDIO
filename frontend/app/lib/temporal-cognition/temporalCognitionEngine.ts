import { stableSignature } from "../intelligence/shared/dedupe";
import { getAdaptationRecoveryStore } from "../institutional-memory/adaptationRecoveryStore";
import { getInstitutionalCorrelationStore } from "../institutional-memory/institutionalCorrelationStore";
import { getInstitutionalMemoryStore } from "../institutional-memory/institutionalMemoryStore";
import { getInstitutionalRecallStore } from "../institutional-memory/institutionalRecallStore";
import type { MemoryCategory } from "../institutional-memory/institutionalMemoryTypes";
import type { RecallCategory } from "../institutional-memory/institutionalRecallTypes";
import type { LearningPatternCategory } from "../institutional-memory/institutionalCorrelationTypes";
import {
  beginTemporalCognitionEvaluation,
  endTemporalCognitionEvaluation,
  shouldEvaluateTemporalCognition,
  shouldRetainTimelineSequence,
  validateTimelineSequence,
} from "./temporalCognitionGuards";
import { getTemporalCognitionStore } from "./temporalCognitionStore";
import type {
  EnterpriseTemporalCognitionInput,
  EnterpriseTemporalCognitionResult,
  EnterpriseTemporalSnapshot,
  OperationalChronologyFrame,
  OrganizationalEvolutionEvent,
  OrganizationalTimelineEvent,
  StrategicTimelineSequence,
  TemporalCognitionSignal,
  TemporalSequenceType,
  TimelineCategory,
  TimelineState,
} from "./temporalCognitionTypes";

const DEV_LOG_PREFIX = "[Nexora][TemporalCognition]";

function devLog(message: string): void {
  if (process.env.NODE_ENV === "production") return;
  console.info(`${DEV_LOG_PREFIX} ${message}`);
}

function mapMemoryCategory(category: MemoryCategory): TimelineCategory {
  if (category === "unknown") return "unknown";
  return category;
}

function mapRecallCategory(category: RecallCategory): TimelineCategory {
  if (category === "unknown") return "unknown";
  return category;
}

function mapPatternCategory(category: LearningPatternCategory): TimelineCategory {
  if (category === "escalation_chain") return "escalation";
  if (category === "fragility_cycle") return "fragility";
  if (category === "governance_pressure") return "governance";
  if (category === "resilience_growth") return "resilience";
  if (category === "coordination_breakdown") return "coordination";
  if (category === "operational_recovery") return "recovery";
  if (category === "systemic_instability") return "operational";
  return "unknown";
}

function buildTimelineId(category: TimelineCategory, events: string[]): string {
  return stableSignature(["temporal-timeline", category, ...events.slice(0, 4)]).slice(0, 56);
}

function buildEventId(source: string, label: string, at: number): string {
  return stableSignature(["temporal-event", source, label, at]).slice(0, 48);
}

function inferTimelineState(
  category: TimelineCategory,
  sequenceType: TemporalSequenceType,
  fragilityElevated: boolean,
  runtimeStatus: string | undefined
): TimelineState {
  if (runtimeStatus === "recovering") return "recovering";
  if (category === "escalation" || sequenceType === "cascading") return "escalating";
  if (category === "recovery" || category === "resilience") return "recovering";
  if (category === "governance" && sequenceType === "sequential") return "stabilizing";
  if (fragilityElevated && category === "fragility") return "developing";
  if (sequenceType === "cyclical" || sequenceType === "recurring") return "developing";
  if (sequenceType === "isolated") return "emerging";
  return "developing";
}

function inferSequenceType(
  labels: readonly string[],
  categories: readonly TimelineCategory[],
  spanMs: number
): TemporalSequenceType {
  const uniqueLabels = new Set(labels);
  if (labels.length <= 1) return "isolated";

  const hasFragility = categories.includes("fragility");
  const hasEscalation = categories.includes("escalation");
  const hasGovernance = categories.includes("governance");
  const hasRecovery = categories.includes("recovery") || categories.includes("resilience");

  if (hasFragility && hasEscalation && labels.length >= 3) return "cascading";
  if (hasGovernance && hasRecovery) return "sequential";

  const repeatedCategory = categories.filter(
    (c, i, arr) => arr.indexOf(c) !== i && c !== "unknown"
  ).length;
  if (repeatedCategory >= 2 && spanMs < 7 * 24 * 60 * 60 * 1000) return "cyclical";
  if (uniqueLabels.size < labels.length) return "recurring";
  if (labels.length >= 4 && spanMs > 60_000) return "cascading";
  return "sequential";
}

function buildEscalationChronology(
  events: OrganizationalTimelineEvent[],
  now: number,
  fragilityElevated: boolean
): StrategicTimelineSequence | null {
  const ordered = events
    .filter((e) => e.category === "fragility" || e.category === "escalation" || e.category === "coordination")
    .sort((a, b) => a.observedAt - b.observedAt);
  if (ordered.length < 2) return null;

  const labels = ordered.map((e) => e.label);
  const categories = ordered.map((e) => e.category);
  const sequenceType = inferSequenceType(labels, categories, ordered.at(-1)!.observedAt - ordered[0]!.observedAt);
  const timelineState = inferTimelineState("escalation", sequenceType, fragilityElevated, undefined);

  const eventLabels =
    sequenceType === "cascading"
      ? Object.freeze([
          "fragility_accumulation",
          "coordination_instability",
          "pressure_spread",
          "escalation_growth",
        ])
      : Object.freeze(labels.slice(0, 4));

  const summary =
    sequenceType === "cascading"
      ? "Operational fragility evolved into cross-system escalation following sustained coordination degradation and delayed governance stabilization."
      : `Organizational ${categories[0]} events progressed ${sequenceType}ly into elevated operational pressure.`;

  const timelineId = buildTimelineId("escalation", [...eventLabels]);
  const confidence = Number(Math.min(0.94, 0.72 + ordered.length * 0.04).toFixed(2));

  return {
    timelineId,
    sequenceType,
    timelineState,
    category: "escalation",
    summary,
    events: eventLabels,
    eventIds: Object.freeze(ordered.map((e) => e.eventId)),
    confidence,
    generatedAt: now,
    lastObservedAt: ordered.at(-1)!.observedAt,
    occurrenceCount: 1,
  };
}

function buildResilienceProgression(
  events: OrganizationalTimelineEvent[],
  adaptations: { label: string; at: number }[],
  now: number
): StrategicTimelineSequence | null {
  const govEvents = events.filter((e) => e.category === "governance");
  const recoveryEvents = events.filter(
    (e) => e.category === "recovery" || e.category === "resilience"
  );
  const adaptationRecovery = adaptations.filter((a) =>
    /recovery|resilience|governance_stabilization/i.test(a.label)
  );

  if (govEvents.length === 0 && recoveryEvents.length === 0 && adaptationRecovery.length === 0) {
    return null;
  }

  const labels = [
    ...govEvents.map((e) => e.label),
    ...recoveryEvents.map((e) => e.label),
    ...adaptationRecovery.map((a) => a.label),
  ].slice(0, 4);
  if (labels.length < 2) return null;

  const eventLabels = Object.freeze([
    "governance_stabilization",
    "resilience_strengthening",
    "recovery_acceleration",
  ].slice(0, labels.length));

  const timelineId = buildTimelineId("resilience", [...eventLabels]);
  return {
    timelineId,
    sequenceType: "sequential",
    timelineState: "recovering",
    category: "resilience",
    summary:
      "Governance stabilization preceded recovery acceleration as organizational resilience strengthened across the operational timeline.",
    events: eventLabels,
    eventIds: Object.freeze(
      [...govEvents, ...recoveryEvents].map((e) => e.eventId).slice(0, 6)
    ),
    confidence: 0.86,
    generatedAt: now,
    lastObservedAt: Math.max(
      govEvents.at(-1)?.observedAt ?? 0,
      recoveryEvents.at(-1)?.observedAt ?? 0,
      adaptationRecovery.at(-1)?.at ?? 0
    ),
    occurrenceCount: 1,
  };
}

function buildCyclicalInstability(
  events: OrganizationalTimelineEvent[],
  now: number
): StrategicTimelineSequence | null {
  const operational = events.filter(
    (e) => e.category === "operational" || e.category === "fragility"
  );
  if (operational.length < 3) return null;

  const byLabel = new Map<string, number>();
  for (const e of operational) {
    byLabel.set(e.label, (byLabel.get(e.label) ?? 0) + 1);
  }
  const repeated = [...byLabel.entries()].filter(([, count]) => count >= 2);
  if (repeated.length === 0) return null;

  const eventLabels = Object.freeze(repeated.map(([label]) => label).slice(0, 4));
  const timelineId = buildTimelineId("operational", [...eventLabels]);

  return {
    timelineId,
    sequenceType: "cyclical",
    timelineState: "developing",
    category: "operational",
    summary:
      "Repeated operational degradation cycles indicate cyclical organizational instability across the enterprise chronology.",
    events: eventLabels,
    eventIds: Object.freeze(operational.map((e) => e.eventId).slice(0, 6)),
    confidence: 0.82,
    generatedAt: now,
    lastObservedAt: operational.at(-1)!.observedAt,
    occurrenceCount: repeated.length,
  };
}

function buildPressureProgression(
  events: OrganizationalTimelineEvent[],
  pressureElevated: boolean,
  now: number
): StrategicTimelineSequence | null {
  const pressureEvents = events.filter(
    (e) =>
      e.category === "coordination" ||
      e.category === "strategic" ||
      e.label.includes("pressure")
  );
  if (pressureEvents.length < 2 && !pressureElevated) return null;

  const labels = pressureEvents.map((e) => e.label);
  const categories = pressureEvents.map((e) => e.category);
  const sequenceType = inferSequenceType(
    labels.length ? labels : ["pressure_accumulation"],
    categories.length ? categories : ["coordination"],
    pressureEvents.length >= 2
      ? pressureEvents.at(-1)!.observedAt - pressureEvents[0]!.observedAt
      : 0
  );

  const eventLabels = Object.freeze(
    (labels.length ? labels : ["pressure_accumulation", "stress_progression"]).slice(0, 4)
  );

  return {
    timelineId: buildTimelineId("coordination", [...eventLabels]),
    sequenceType: sequenceType === "isolated" ? "sequential" : sequenceType,
    timelineState: pressureElevated ? "escalating" : "developing",
    category: "coordination",
    summary:
      "Pressure accumulated across time as coordination and strategic stress signals formed a temporal stress progression.",
    events: eventLabels,
    eventIds: Object.freeze(pressureEvents.map((e) => e.eventId)),
    confidence: pressureElevated ? 0.84 : 0.76,
    generatedAt: now,
    lastObservedAt: pressureEvents.at(-1)?.observedAt ?? now,
    occurrenceCount: 1,
  };
}

function collectTimelineEvents(
  organizationId: string,
  now: number
): OrganizationalTimelineEvent[] {
  const memoryState = getInstitutionalMemoryStore(organizationId).getState();
  const recallState = getInstitutionalRecallStore(organizationId).getState();
  const correlationState = getInstitutionalCorrelationStore(organizationId).getState();
  const adaptationState = getAdaptationRecoveryStore(organizationId).getState();

  const events: OrganizationalTimelineEvent[] = [];
  let order = 0;

  for (const record of memoryState.records) {
    events.push({
      eventId: buildEventId("memory", record.memoryId, record.recordedAt),
      category: mapMemoryCategory(record.category),
      label: record.title.replace(/\s+/g, "_").toLowerCase().slice(0, 40),
      summary: record.summary,
      observedAt: record.recordedAt,
      sequenceOrder: order++,
    });
  }

  for (const recall of recallState.recalls) {
    events.push({
      eventId: buildEventId("recall", recall.recallId, recall.generatedAt),
      category: mapRecallCategory(recall.category),
      label: recall.title.replace(/\s+/g, "_").toLowerCase().slice(0, 40),
      summary: recall.summary,
      observedAt: recall.generatedAt,
      sequenceOrder: order++,
    });
  }

  for (const pattern of correlationState.patterns) {
    events.push({
      eventId: buildEventId("pattern", pattern.patternId, pattern.lastObservedAt),
      category: mapPatternCategory(pattern.category),
      label: pattern.category,
      summary: pattern.lesson,
      observedAt: pattern.lastObservedAt,
      sequenceOrder: order++,
    });
  }

  for (const adaptation of adaptationState.adaptations) {
    events.push({
      eventId: buildEventId("adaptation", adaptation.adaptationId, adaptation.generatedAt),
      category: adaptation.adaptationType.includes("recovery")
        ? "recovery"
        : adaptation.adaptationType.includes("governance")
          ? "governance"
          : adaptation.adaptationType.includes("fragility")
            ? "fragility"
            : "resilience",
      label: adaptation.adaptationType,
      summary: adaptation.summary,
      observedAt: adaptation.generatedAt,
      sequenceOrder: order++,
    });
  }

  return events.sort((a, b) => a.observedAt - b.observedAt);
}

function buildTemporalSnapshot(
  organizationId: string,
  sequences: StrategicTimelineSequence[],
  events: OrganizationalTimelineEvent[],
  frames: OperationalChronologyFrame[],
  signals: TemporalCognitionSignal[],
  evolution: OrganizationalEvolutionEvent[],
  now: number
): EnterpriseTemporalSnapshot {
  const dominantCategories = Object.freeze(
    [...new Set(sequences.map((s) => s.category))].slice(0, 4) as TimelineCategory[]
  );
  const dominantSequenceType =
    sequences.find((s) => s.sequenceType === "cascading")?.sequenceType ??
    sequences[0]?.sequenceType ??
    "isolated";
  const dominantTimelineState = sequences[0]?.timelineState ?? "emerging";

  const temporalSummary =
    sequences[0]?.summary ??
    (events.length > 0
      ? "Enterprise temporal awareness initialized from institutional memory chronology."
      : "Awaiting sufficient organizational chronology depth.");

  const signature = stableSignature([
    "d9-3-1-temporal-snapshot",
    organizationId,
    sequences.length,
    events.length,
    sequences[0]?.timelineId ?? "none",
    dominantTimelineState,
  ]);

  return {
    signature,
    organizationId,
    generatedAt: now,
    sequenceCount: sequences.length,
    eventCount: events.length,
    temporalSummary,
    dominantCategories,
    dominantSequenceType,
    dominantTimelineState,
    recentSequences: Object.freeze(sequences.slice(0, 6)),
    chronologyFrames: Object.freeze(frames),
    temporalSignals: Object.freeze(signals),
    evolutionEvents: Object.freeze(evolution),
    recentEvents: Object.freeze(events.slice(-12)),
  };
}

export function evaluateEnterpriseTemporalCognition(
  input: EnterpriseTemporalCognitionInput
): EnterpriseTemporalCognitionResult {
  const organizationId = input.organizationId.trim() || "nexora-default";
  const now = input.now ?? Date.now();

  if (!beginTemporalCognitionEvaluation()) {
    return {
      evaluated: false,
      skipped: true,
      reason: "recursive_temporal_guard",
      snapshot: null,
      newSequences: 0,
      storeSignature: "",
    };
  }

  try {
    const store = getTemporalCognitionStore(organizationId);
    const prior = store.getState();

    const cognitionSignature = input.cognitionSnapshot?.signature ?? "no-cognition";
    const memorySignature = input.memorySnapshot?.signature ?? prior.signature;
    const recallSignature = input.recallSnapshot?.signature ?? "no-recall";
    const unifiedSignature = input.unifiedMemorySnapshot?.signature ?? "no-unified";

    const evaluationSignature = stableSignature([
      "d9-3-1-temporal-eval",
      organizationId,
      cognitionSignature,
      memorySignature,
      recallSignature,
      unifiedSignature,
      input.fragilityElevated ? "fragile" : "stable",
    ]);

    if (
      !shouldEvaluateTemporalCognition(
        organizationId,
        evaluationSignature,
        prior.lastEvaluationSignature,
        now
      )
    ) {
      const latest = prior.snapshots[0] ?? null;
      return {
        evaluated: false,
        skipped: true,
        reason: "paced_or_unchanged",
        snapshot: latest,
        newSequences: 0,
        storeSignature: prior.signature,
      };
    }

    const events = collectTimelineEvents(organizationId, now);
    const adaptationState = getAdaptationRecoveryStore(organizationId).getState();
    const adaptationLabels = adaptationState.adaptations.map((a) => ({
      label: a.adaptationType,
      at: a.generatedAt,
    }));

    const runtimeStatus = input.unifiedMemorySnapshot?.runtimeStatus;
    const pressureElevated =
      input.cognitionSnapshot?.pressurePosture === "attention" ||
      (input.fragilityElevated ?? false);

    const candidates: StrategicTimelineSequence[] = [];

    const escalation = buildEscalationChronology(
      events,
      now,
      input.fragilityElevated ?? false
    );
    if (escalation) candidates.push(escalation);

    const resilience = buildResilienceProgression(events, adaptationLabels, now);
    if (resilience) candidates.push(resilience);

    const cyclical = buildCyclicalInstability(events, now);
    if (cyclical) candidates.push(cyclical);

    const pressure = buildPressureProgression(events, pressureElevated, now);
    if (pressure) candidates.push(pressure);

    if (events.length >= 1 && candidates.length === 0) {
      const isolated = events[events.length - 1]!;
      candidates.push({
        timelineId: buildTimelineId(isolated.category, [isolated.label]),
        sequenceType: "isolated",
        timelineState: inferTimelineState(
          isolated.category,
          "isolated",
          input.fragilityElevated ?? false,
          runtimeStatus
        ),
        category: isolated.category,
        summary: isolated.summary,
        events: Object.freeze([isolated.label]),
        eventIds: Object.freeze([isolated.eventId]),
        confidence: 0.68,
        generatedAt: now,
        lastObservedAt: isolated.observedAt,
        occurrenceCount: 1,
      });
    }

    const retained = candidates.filter(shouldRetainTimelineSequence);
    if (events.length < 2 && retained.length === 0) {
      return {
        evaluated: false,
        skipped: true,
        reason: "insufficient_chronology_depth",
        snapshot: prior.snapshots[0] ?? null,
        newSequences: 0,
        storeSignature: prior.signature,
      };
    }

    const priorIds = new Set(prior.sequences.map((s) => s.timelineId));
    const newCount = retained.filter((s) => !priorIds.has(s.timelineId)).length;

    store.upsertEvents(events, now);
    store.upsertSequences(retained, now);

    const signals: TemporalCognitionSignal[] = retained
      .filter(validateTimelineSequence)
      .slice(0, 4)
      .map((s) => ({
        signalId: stableSignature(["temporal-signal", s.timelineId]).slice(0, 48),
        category: s.category,
        sequenceType: s.sequenceType,
        timelineState: s.timelineState,
        summary: s.summary.slice(0, 160),
        confidence: s.confidence,
        generatedAt: now,
      }));

    store.upsertSignals(signals, now);

    const frames: OperationalChronologyFrame[] = retained.slice(0, 3).map((s) => ({
      frameId: stableSignature(["chronology-frame", s.timelineId]).slice(0, 48),
      category: s.category,
      chronologyLabel: `${s.category}_${s.sequenceType}_chronology`,
      narrative: s.summary,
      timelineIds: Object.freeze([s.timelineId]),
      firstObservedAt: events[0]?.observedAt ?? now,
      lastObservedAt: s.lastObservedAt,
    }));

    store.upsertChronologyFrames(frames, now);

    const evolutionEvents: OrganizationalEvolutionEvent[] = retained
      .filter((s) => s.sequenceType === "cascading" || s.sequenceType === "cyclical")
      .map((s) => ({
        evolutionId: stableSignature(["evolution", s.timelineId]).slice(0, 48),
        category: s.category,
        evolutionLabel: `${s.sequenceType}_evolution`,
        progressionSummary: s.summary,
        linkedTimelineIds: Object.freeze([s.timelineId]),
        generatedAt: now,
      }));

    store.upsertEvolutionEvents(evolutionEvents, now);

    const snapshot = buildTemporalSnapshot(
      organizationId,
      retained,
      events,
      frames,
      signals,
      evolutionEvents,
      now
    );

    store.upsertSnapshots([snapshot], now);
    store.setLastEvaluationSignature(evaluationSignature);

    const finalState = store.getState();

    if (escalation?.sequenceType === "cascading") {
      devLog(`escalation chronology — ${escalation.timelineState}: ${escalation.summary.slice(0, 72)}`);
    }
    if (resilience?.timelineState === "recovering") {
      devLog(`resilience evolution — ${resilience.summary.slice(0, 72)}`);
    }
    if (retained.some((s) => s.sequenceType === "cyclical")) {
      devLog("cyclical instability timeline formed");
    }

    return {
      evaluated: true,
      skipped: false,
      snapshot,
      newSequences: newCount,
      storeSignature: finalState.signature,
    };
  } finally {
    endTemporalCognitionEvaluation();
  }
}
