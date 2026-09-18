/**
 * NPA-T RMS:5 — pure Observer measurement. Consumes VAI causal-safety labels; does not own VAI.
 */

import { VAI_CAUSAL_SAFETY_BOUNDARY } from "@/app/lib/vai/vaiCausalContract.ts";
import { RMS_DEFAULT_OBSERVATION_POLICY } from "./rmsObservationPolicy.ts";
import {
  RMS_5_BOUNDARY,
  type RmsExpectationKind,
  type RmsLayerSnapshot,
  type RmsObserverFinding,
  type RmsObserverMeasurement,
  type RmsObserverTaxonomy,
  type RmsObserverTraceLink,
} from "./rmsObserverContract.ts";
import type { RmsStructuredGroundTruth } from "./rmsWorldContract.ts";
import type { RmsObservableRecord, RmsOperatorPublicationAttempt } from "./rmsOperatorContract.ts";
import type { RmsManagerRecordedTurn } from "./rmsManagerRuntime.ts";
import type { RmsManagerKnowledge } from "./rmsManagerContract.ts";
import type { RmsNexoraKnowledgeView } from "./rmsGroundTruth.ts";
import type { RmsEventTrace } from "./rmsEventContract.ts";

export type RmsObserverInput = {
  readonly simulationId: string;
  readonly runId: string;
  readonly world: RmsStructuredGroundTruth;
  readonly observations: readonly RmsObservableRecord[];
  readonly publications: readonly RmsOperatorPublicationAttempt[];
  readonly publishedMetricKeys: readonly string[];
  readonly managerTurns: readonly RmsManagerRecordedTurn[];
  readonly managerKnowledge: RmsManagerKnowledge | null;
  readonly nexoraKnowledge: RmsNexoraKnowledgeView;
  readonly unauthorizedMutation: boolean;
  readonly runtimeException: string | null;
  readonly fixtureReferent?: { readonly active: string; readonly nexoraSubject: string };
  readonly fixtureLeak?: { readonly path: string; readonly fact: string };
  readonly eventTraces?: readonly RmsEventTrace[];
};

export type RmsObserverReport = {
  readonly identity: typeof RMS_5_BOUNDARY.identity;
  readonly layers: readonly RmsLayerSnapshot[];
  readonly measurements: readonly RmsObserverMeasurement[];
  readonly findings: readonly RmsObserverFinding[];
  readonly traces: readonly RmsObserverTraceLink[];
  readonly writeAttempted: false;
  readonly repaired: false;
};

export function measureRmsPerspectives(input: RmsObserverInput): RmsObserverReport {
  if (RMS_5_BOUNDARY.silentlyRepairs) throw new Error("RMS:5 must not repair");
  if (RMS_5_BOUNDARY.parallelVai || RMS_5_BOUNDARY.parallelEvidence) throw new Error("RMS:5 must not duplicate VAI/Evidence");
  if (VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore) throw new Error("RMS:5 must not use a parallel causal store");
  const tick = input.world.clock.tick;
  const simulatedAt = input.world.clock.simulatedAt;
  const measurements: RmsObserverMeasurement[] = [];
  const push = (partial: Omit<RmsObserverMeasurement, "simulationId" | "runId" | "tick" | "simulatedAt" | "repaired">) => {
    measurements.push(
      Object.freeze({
        ...partial,
        simulationId: input.simulationId,
        runId: input.runId,
        tick,
        simulatedAt,
        repaired: false,
      }),
    );
  };

  const layers: readonly RmsLayerSnapshot[] = Object.freeze([
    Object.freeze({ layer: "GROUND_TRUTH" as const, refs: Object.freeze(input.world.variables.map((item) => item.variableId)) }),
    Object.freeze({ layer: "OBSERVABLE" as const, refs: Object.freeze(input.observations.map((item) => item.recordId)) }),
    Object.freeze({ layer: "NEXORA" as const, refs: Object.freeze([...input.publishedMetricKeys, ...input.managerTurns.map((item) => `nexora:${item.turnIndex}`)]) }),
    Object.freeze({ layer: "MANAGER" as const, refs: Object.freeze(input.managerTurns.map((item) => `mgr:${item.turnIndex}`)) }),
  ]);

  for (const variable of input.world.variables) {
    push({
      measurementId: `m:gt:${variable.key}`,
      actorOrSubsystem: "GROUND_TRUTH",
      category: "GROUND_TRUTH",
      expectationKind: "GROUND_TRUTH_EXPECTED",
      expected: String(variable.value),
      observed: String(variable.value),
      status: "MATCH",
      taxonomy: "NO_ERROR",
      subtype: "NONE",
      traceRefs: Object.freeze([variable.variableId]),
      confidence: "high",
      classification: "A_GROUND_TRUTH",
      notes: `${variable.key}=${String(variable.value)}`,
    });
  }

  const latestByField = latestObservations(input.observations);
  for (const rule of RMS_DEFAULT_OBSERVATION_POLICY) {
    const variable = input.world.variables.find((item) => item.key === rule.worldKey);
    if (!variable) continue;
    const delayOk = tick - variable.tick >= rule.delayTicks;
    const record = latestByField.get(rule.field);
    if (delayOk && (!record || record.status !== "AVAILABLE")) {
      push({
        measurementId: `m:ab:${rule.field}`,
        actorOrSubsystem: "OPERATOR_AGENT",
        category: "OBSERVABLE",
        expectationKind: "GROUND_TRUTH_EXPECTED",
        expected: rule.field,
        observed: record?.status ?? "absent",
        status: "GAP",
        taxonomy: "OPERATOR_ERROR",
        subtype: "OBSERVATION_GAP",
        traceRefs: Object.freeze([variable.variableId]),
        confidence: "high",
        classification: "A_TO_B_OPERATOR_OBSERVATION_GAP",
        notes: `Ground Truth ${rule.worldKey} had no AVAILABLE ${rule.field}`,
      });
    } else if (record) {
      push({
        measurementId: `m:b:${rule.field}`,
        actorOrSubsystem: "OPERATOR_AGENT",
        category: "OBSERVABLE",
        expectationKind: "GROUND_TRUTH_EXPECTED",
        expected: rule.field,
        observed: `${record.status}:${String(record.value)}`,
        status: record.status === "AVAILABLE" ? "MATCH" : "GAP",
        taxonomy: "NO_ERROR",
        subtype: "NONE",
        traceRefs: Object.freeze([record.recordId]),
        confidence: "high",
        classification: "B_OBSERVABLE",
        notes: record.field,
      });
    }
  }

  for (const record of latestByField.values()) {
    if (record.status !== "AVAILABLE" || typeof record.value !== "number") continue;
    if (!input.publishedMetricKeys.includes(record.field)) {
      push({
        measurementId: `m:bc:${record.field}`,
        actorOrSubsystem: "RDI",
        category: "NEXORA",
        expectationKind: "INFORMATION_BOUNDED",
        expected: record.field,
        observed: "not-in-data-reality",
        status: "GAP",
        taxonomy: "DATA_ERROR",
        subtype: "PUBLICATION_GAP",
        traceRefs: Object.freeze([record.recordId, ...input.publications.map((item) => item.attemptId)]),
        confidence: "high",
        classification: "B_TO_C_DATA_PUBLICATION_GAP",
        notes: `${record.field} was observable but did not reach Data Reality`,
      });
    }
  }

  const hiddenKeys = hiddenGroundTruthKeys(input.world, latestByField);
  const hiddenCausal = input.world.relationships.some((item) => item.confirmedCausalForNexora === false);
  if (hiddenCausal) {
    push({
      measurementId: "m:bounded:hidden-cause",
      actorOrSubsystem: "OBSERVER",
      category: "NEXORA",
      expectationKind: "INFORMATION_BOUNDED",
      expected: "nexora-must-not-know-hidden-cause",
      observed: "hidden-from-nexora",
      status: "MATCH",
      taxonomy: "NO_ERROR",
      subtype: "NONE",
      traceRefs: Object.freeze(input.world.relationships.map((item) => item.relationshipId)),
      confidence: "high",
      classification: "INFORMATION_BOUNDED_HIDDEN_TRUTH",
      notes: "Hidden Ground Truth cause is not information-bounded Nexora knowledge",
    });
  }
  for (const turn of input.managerTurns) {
    const causal = classifyCausalLanguage(turn.nexoraResponse);
    if (causal === "OVERCLAIM") {
      push({
        measurementId: `m:causal:${turn.turnIndex}`,
        actorOrSubsystem: "NEXORA",
        category: "NEXORA",
        expectationKind: "INFORMATION_BOUNDED",
        expected: "INSUFFICIENT",
        observed: causal,
        status: "VIOLATION",
        taxonomy: "NEXORA_ERROR",
        subtype: "CAUSAL_OVERCLAIM",
        traceRefs: Object.freeze([`nexora:${turn.turnIndex}`]),
        confidence: "medium",
        classification: "C_CAUSAL_OVERCLAIM",
        notes: "Confirmed causal language without information-bounded evidence",
      });
    } else if (causal === "UNCERTAIN") {
      push({
        measurementId: `m:uncert:${turn.turnIndex}`,
        actorOrSubsystem: "NEXORA",
        category: "NEXORA",
        expectationKind: "INFORMATION_BOUNDED",
        expected: "incomplete-evidence-ok",
        observed: "uncertainty-preserved",
        status: "MATCH",
        taxonomy: "NO_ERROR",
        subtype: "NONE",
        traceRefs: Object.freeze([`nexora:${turn.turnIndex}`]),
        confidence: "high",
        classification: "INFORMATION_BOUNDED_UNCERTAINTY",
        notes: "Nexora did not invent hidden Ground Truth",
      });
    }
    if (hiddenKeys.some((key) => turn.nexoraResponse.includes(key))) {
      push({
        measurementId: `m:nexora-leak:${turn.turnIndex}`,
        actorOrSubsystem: "NEXORA",
        category: "NEXORA",
        expectationKind: "INFORMATION_BOUNDED",
        expected: "no-hidden-keys",
        observed: turn.nexoraResponse,
        status: "VIOLATION",
        taxonomy: "SIMULATION_ERROR",
        subtype: "FIREWALL_VIOLATION",
        traceRefs: Object.freeze([`nexora:${turn.turnIndex}`]),
        confidence: "high",
        classification: "HIDDEN_TRUTH_IN_NEXORA",
        notes: "Sealed Ground Truth key appeared in Nexora speech",
      });
    }
    const leak = managerAskedHiddenTruth(turn.utterance, input.managerKnowledge, hiddenKeys);
    if (leak) {
      push({
        measurementId: `m:mgr-leak:${turn.turnIndex}`,
        actorOrSubsystem: "MANAGER_AGENT",
        category: "MANAGER",
        expectationKind: "INFORMATION_BOUNDED",
        expected: "manager-visible-only",
        observed: turn.utterance,
        status: "VIOLATION",
        taxonomy: "MANAGER_ERROR",
        subtype: "KNOWLEDGE_LEAK",
        traceRefs: Object.freeze([`mgr:${turn.turnIndex}`]),
        confidence: "high",
        classification: "MANAGER_KNOWLEDGE_LEAK",
        notes: "Manager asked about hidden Ground Truth it was never told",
      });
    }
  }

  if (input.fixtureReferent && input.fixtureReferent.active !== input.fixtureReferent.nexoraSubject) {
    push({
      measurementId: "m:referent:fixture",
      actorOrSubsystem: "CONVERSATION",
      category: "NEXORA",
      expectationKind: "INFORMATION_BOUNDED",
      expected: input.fixtureReferent.active,
      observed: input.fixtureReferent.nexoraSubject,
      status: "DIVERGENT",
      taxonomy: "CONVERSATION_ERROR",
      subtype: "REFERENT_ERROR",
      traceRefs: Object.freeze(["fixture:referent"]),
      confidence: "high",
      classification: "CONVERSATION_REFERENT_ERROR",
      notes: `Manager active referent ${input.fixtureReferent.active}; Nexora subject ${input.fixtureReferent.nexoraSubject}`,
    });
  }

  for (let index = 1; index < input.managerTurns.length; index += 1) {
    const previous = input.managerTurns[index - 1]!;
    const current = input.managerTurns[index]!;
    if (/\b(it|that|this)\b/i.test(current.utterance) && previous.focusedSubjectLabel && current.focusedSubjectLabel && previous.focusedSubjectLabel !== current.focusedSubjectLabel) {
      push({
        measurementId: `m:referent:${current.turnIndex}`,
        actorOrSubsystem: "CONVERSATION",
        category: "NEXORA",
        expectationKind: "INFORMATION_BOUNDED",
        expected: previous.focusedSubjectLabel,
        observed: current.focusedSubjectLabel,
        status: "DIVERGENT",
        taxonomy: "CONVERSATION_ERROR",
        subtype: "REFERENT_ERROR",
        traceRefs: Object.freeze([`mgr:${current.turnIndex}`, `nexora:${current.turnIndex}`]),
        confidence: "medium",
        classification: "CONVERSATION_REFERENT_ERROR",
        notes: "Deictic follow-up changed Nexora subject",
      });
    }
  }

  if (input.fixtureLeak) {
    push({
      measurementId: "m:leak:fixture",
      actorOrSubsystem: "FIREWALL",
      category: "SIMULATION",
      expectationKind: "GROUND_TRUTH_EXPECTED",
      expected: "sealed",
      observed: `${input.fixtureLeak.path}:${input.fixtureLeak.fact}`,
      status: "VIOLATION",
      taxonomy: "SIMULATION_ERROR",
      subtype: "FIREWALL_VIOLATION",
      traceRefs: Object.freeze(["fixture:leak"]),
      confidence: "high",
      classification: "GROUND_TRUTH_LEAKAGE",
      notes: "Unauthorized path attempted to expose sealed Ground Truth",
    });
  }

  if (input.nexoraKnowledge.worldId !== null || input.nexoraKnowledge.facts.length > 0) {
    push({
      measurementId: "m:sim:nexora-gt",
      actorOrSubsystem: "FIREWALL",
      category: "SIMULATION",
      expectationKind: "GROUND_TRUTH_EXPECTED",
      expected: "nexora-knowledge-empty-world",
      observed: String(input.nexoraKnowledge.worldId),
      status: "VIOLATION",
      taxonomy: "SIMULATION_ERROR",
      subtype: "FIREWALL_VIOLATION",
      traceRefs: Object.freeze(["nexoraKnowledge"]),
      confidence: "high",
      classification: "GROUND_TRUTH_LEAKAGE",
      notes: "Nexora knowledge view received Ground Truth",
    });
  }

  if (input.unauthorizedMutation) {
    push({
      measurementId: "m:sim:mutation",
      actorOrSubsystem: "SIMULATION",
      category: "SIMULATION",
      expectationKind: "GROUND_TRUTH_EXPECTED",
      expected: "operator-only-events",
      observed: "unauthorized-actor",
      status: "VIOLATION",
      taxonomy: "SIMULATION_ERROR",
      subtype: "UNAUTHORIZED_MUTATION",
      traceRefs: Object.freeze(["world"]),
      confidence: "high",
      classification: "SIMULATION_CONTRACT_FAILURE",
      notes: "Ground Truth mutation by unauthorized actor",
    });
  }

  if (input.runtimeException) {
    push({
      measurementId: "m:runtime",
      actorOrSubsystem: "RUNTIME",
      category: "RUNTIME",
      expectationKind: "INFORMATION_BOUNDED",
      expected: "ok",
      observed: input.runtimeException,
      status: "VIOLATION",
      taxonomy: "RUNTIME_ERROR",
      subtype: "EXCEPTION",
      traceRefs: Object.freeze(["runtime"]),
      confidence: "high",
      classification: "RUNTIME_EXCEPTION",
      notes: input.runtimeException,
    });
  }

  for (const eventTrace of input.eventTraces ?? []) {
    const machineStatus = latestByField.get("machine_status");
    const shouldObserveAsset = eventTrace.family === "ASSET";
    const visible = shouldObserveAsset && machineStatus?.status === "AVAILABLE";
    push({
      measurementId: `m:event:${eventTrace.eventId}`,
      actorOrSubsystem: "EVENT",
      category: "SIMULATION",
      expectationKind: "INFORMATION_BOUNDED",
      expected: eventTrace.hiddenFromNexora ? "hidden-event-ok" : "visible",
      observed: visible ? "operational-signal" : "event-not-nexora-object",
      status: "MATCH",
      taxonomy: "NO_ERROR",
      subtype: "NONE",
      traceRefs: eventTrace.historyIds,
      confidence: "high",
      classification: "EVENT_JOURNEY",
      notes: `Event ${eventTrace.eventId} remains hidden from Nexora/Manager; Observer holds the trace`,
    });
  }

  const traces = Object.freeze(buildTraces(input));
  const findings = Object.freeze(buildFindings(measurements, tick));
  return Object.freeze({
    identity: RMS_5_BOUNDARY.identity,
    layers,
    measurements: Object.freeze(measurements),
    findings,
    traces,
    writeAttempted: false,
    repaired: false,
  });
}

export function verifyRmsObserverIntelligence(): { readonly ok: true } {
  if (RMS_5_BOUNDARY.startsRms6) throw new Error("RMS:5 must not start RMS:6");
  if (RMS_5_BOUNDARY.ownsRepair) throw new Error("RMS:5 must not own repair");
  if (RMS_5_BOUNDARY.hiddenTruthIsNexoraDuty) throw new Error("RMS:5 must not treat hidden truth as Nexora duty");
  if (RMS_5_BOUNDARY.parallelEvidence || RMS_5_BOUNDARY.parallelDataReality || RMS_5_BOUNDARY.parallelVai) {
    throw new Error("RMS:5 must not create parallel authorities");
  }
  return Object.freeze({ ok: true as const });
}

export function normalizeRmsObserverReport(report: RmsObserverReport): readonly string[] {
  return Object.freeze([
    ...report.measurements.map((item) => `${item.classification}|${item.taxonomy}|${item.subtype}|${item.status}|${item.expected}|${item.observed}`),
    ...report.findings.map((item) => `${item.taxonomy}|${item.subtype}|${item.severity}|${item.primaryOwnership}|${item.explanation}`),
  ]);
}

function latestObservations(records: readonly RmsObservableRecord[]): Map<string, RmsObservableRecord> {
  const map = new Map<string, RmsObservableRecord>();
  for (const record of records) map.set(record.field, record);
  return map;
}

function hiddenGroundTruthKeys(world: RmsStructuredGroundTruth, observed: Map<string, RmsObservableRecord>): readonly string[] {
  const publishedFields = new Set(observed.keys());
  const mapped = new Set<string>(RMS_DEFAULT_OBSERVATION_POLICY.filter((rule) => publishedFields.has(rule.field)).map((rule) => rule.worldKey));
  return world.variables.map((item) => item.key).filter((key) => !mapped.has(key) || key === "machineAvailability");
}

function managerAskedHiddenTruth(utterance: string, knowledge: RmsManagerKnowledge | null, hiddenKeys: readonly string[]): boolean {
  const told = `${knowledge?.background.join(" ") ?? ""} ${knowledge?.visibleFacts.map((item) => item.text).join(" ") ?? ""}`.toLowerCase();
  if (/machine a .{0,24}(fail|cause)/i.test(utterance) && !/machine a/.test(told)) return true;
  return hiddenKeys.some((key) => utterance.includes(key) && !told.includes(key.toLowerCase()));
}

function classifyCausalLanguage(response: string): "OVERCLAIM" | "UNCERTAIN" | "OTHER" {
  if (/(not yet confirmed|insufficient evidence|cause is not yet|possible contributor|evidence is incomplete)/i.test(response)) {
    return "UNCERTAIN";
  }
  if (/(definitely caused|caused the delivery problem|confirmed cause)/i.test(response)) return "OVERCLAIM";
  return "OTHER";
}

function buildTraces(input: RmsObserverInput): readonly RmsObserverTraceLink[] {
  const lastObservation = input.observations.at(-1)?.recordId ?? null;
  const lastPublication = input.publications.at(-1)?.attemptId ?? null;
  const lastTurn = input.managerTurns.at(-1);
  return Object.freeze([
    Object.freeze({
      traceId: `trace:${input.runId}`,
      groundTruthRef: input.world.worldId,
      observationRef: lastObservation,
      publicationRef: lastPublication,
      nexoraDataRef: input.publishedMetricKeys[0] ?? null,
      managerTurnRef: lastTurn ? `mgr:${lastTurn.turnIndex}` : null,
      nexoraResponseRef: lastTurn ? `nexora:${lastTurn.turnIndex}` : null,
    }),
  ]);
}

function buildFindings(measurements: readonly RmsObserverMeasurement[], tick: number): readonly RmsObserverFinding[] {
  const findings: RmsObserverFinding[] = [];
  const errors = measurements.filter((item) => item.taxonomy !== "NO_ERROR");
  const primary = earliestOwnership(errors);
  const grouped = new Map<string, RmsObserverMeasurement[]>();
  for (const item of errors) {
    const key = `${item.taxonomy}:${item.subtype}`;
    const list = grouped.get(key) ?? [];
    list.push(item);
    grouped.set(key, list);
  }
  for (const [key, group] of grouped) {
    const first = group[0]!;
    const severity = first.subtype === "FIREWALL_VIOLATION" || first.subtype === "UNAUTHORIZED_MUTATION"
      ? "CRITICAL_CONTRACT_FAILURE"
      : first.status === "GAP" || first.status === "VIOLATION" || first.status === "DIVERGENT"
        ? "FAILURE"
        : "WARNING";
    if ((severity === "FAILURE" || severity === "CRITICAL_CONTRACT_FAILURE") && group.every((item) => item.measurementId.length === 0)) {
      continue;
    }
    const downstream = primary && first.taxonomy !== primary
      ? Object.freeze([`${first.taxonomy} is downstream of ${primary}`])
      : Object.freeze([]);
    findings.push(
      Object.freeze({
        findingId: `f:${key}`,
        taxonomy: first.taxonomy,
        subtype: first.subtype,
        severity,
        tick,
        measurementIds: Object.freeze(group.map((item) => item.measurementId)),
        primaryOwnership: primary ?? first.taxonomy,
        downstreamEffects: downstream,
        explanation: first.notes,
        repaired: false,
      }),
    );
  }
  return findings;
}

function earliestOwnership(errors: readonly RmsObserverMeasurement[]): RmsObserverTaxonomy | null {
  const order: readonly RmsObserverTaxonomy[] = ["SIMULATION_ERROR", "OPERATOR_ERROR", "DATA_ERROR", "MANAGER_ERROR", "CONVERSATION_ERROR", "NEXORA_ERROR", "RUNTIME_ERROR"];
  for (const taxonomy of order) {
    if (errors.some((item) => item.taxonomy === taxonomy)) return taxonomy;
  }
  return null;
}

export type { RmsExpectationKind };
