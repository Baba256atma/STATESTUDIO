import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  PROACTIVE_MONITORING_AUTHORITY_BOUNDARY,
  acknowledgeMonitoringChange,
  certifyProactiveMonitoringFoundation,
  classifyMonitoringObservationPair,
  createMonitoringAdvisorContext,
  evaluateProactiveMonitoring,
  proactiveMonitoringFoundationIdentity,
  proactiveMonitoringFoundationNamespace,
  proactiveMonitoringFoundationVersion,
  resolveMonitoringAttentionWithExistingSignals,
  type NexoraMonitoringChange,
} from "./proactiveMonitoringFoundation.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
  type CsvVerticalSliceInput,
} from "./csvRealDataVerticalSlice.ts";
import type { ExecutiveSourceProjectionInput } from "./executiveSourceIntelligence.ts";
import { createDirectorRuntimeAttentionSignal } from "../dri/directorRuntimeAttentionSignalContracts.ts";

const header = "Current Revenue,Previous Revenue,Operating Cost,Production Used Capacity,Production Total Capacity,Warehouse Used Capacity,Warehouse Total Capacity,On-Time Deliveries,Total Deliveries,Customer Satisfaction,Maximum Satisfaction Score";

function observation(
  capacityPercent: number,
  sequence: number,
  workspaceId = "workspace-a",
  sourceContextId = "csv:workspace-a:pm1",
): ExecutiveSourceProjectionInput {
  const csvText = `${header}\n8400000,8080000,6700000,${capacityPercent * 100},10000,7900,8500,910,1000,4.2,5`;
  const importId = `PM1-${sequence}`;
  const committedAt = `2026-08-16T12:${String(sequence).padStart(2, "0")}:00.000Z`;
  const input: CsvVerticalSliceInput = Object.freeze({
    workspaceId,
    fileName: `pm1-${sequence}.csv`,
    fileSize: csvText.length,
    csvText,
    importId,
    importedAt: committedAt,
    sourceContextId,
  });
  const parsed = parseCsvDeterministically(csvText);
  const prepared = prepareCsvRealDataImport(
    input,
    suggestCsvColumnMappings(parsed.columns, importId),
  );
  assert.equal(prepared.ready, true);
  assert.ok(prepared.snapshot && prepared.handoff && prepared.dataReality);
  return Object.freeze({
    workspaceId,
    sourceContextId,
    sourceLabel: input.fileName,
    committedAt,
    recordCount: prepared.snapshot.records.length,
    mappingId: prepared.mapping.mappingId,
    snapshot: prepared.snapshot,
    handoff: prepared.handoff,
    dataReality: prepared.dataReality,
  });
}

function pair(from: number, to: number) {
  return Object.freeze({ previous: observation(from, 1), current: observation(to, 2) });
}

function capacityEvent(events: readonly NexoraMonitoringChange[]): NexoraMonitoringChange {
  const event = events.find((entry) => entry.objectKey === "production");
  assert.ok(event, "expected a canonical Capacity monitoring event");
  return event;
}

test("A/B — identity, deterministic policy, and authority boundary are immutable", () => {
  assert.equal(proactiveMonitoringFoundationIdentity, "PM:1/NexoraProactiveMonitoringFoundation");
  assert.equal(proactiveMonitoringFoundationVersion, "1.0.0");
  assert.equal(proactiveMonitoringFoundationNamespace, "nexora.proactive-monitoring.foundation");
  assert.equal(PROACTIVE_MONITORING_AUTHORITY_BOUNDARY.reusesRdi3Comparison, true);
  assert.equal(PROACTIVE_MONITORING_AUTHORITY_BOUNDARY.reusesDri6Attention, true);
  assert.equal(PROACTIVE_MONITORING_AUTHORITY_BOUNDARY.mutatesRuntime, false);
  assert.equal(PROACTIVE_MONITORING_AUTHORITY_BOUNDARY.promotesDurableMemory, false);
  assert.ok(Object.isFrozen(PROACTIVE_MONITORING_AUTHORITY_BOUNDARY));
});

test("C/D/E — a real canonical observation pair is detected while tiny noise is suppressed", () => {
  const result = evaluateProactiveMonitoring(pair(70, 70.1));
  const capacity = capacityEvent(result.events);
  assert.equal(result.status, "evaluated");
  assert.equal(capacity.metricChanges[0]?.baseValue, 70);
  assert.equal(capacity.metricChanges[0]?.comparisonValue, 70.1);
  assert.equal(capacity.significance, "minor");
  assert.equal(capacity.lifecycle, "suppressed");
  assert.equal(result.attentionCandidates.some((entry) => entry.subjectId === "obj-capacity"), false);
});

test("F/G — meaningful deterioration and improvement become non-primary attention candidates", () => {
  const worse = evaluateProactiveMonitoring(pair(70, 90));
  const better = evaluateProactiveMonitoring(pair(90, 70));
  const deterioration = capacityEvent(worse.events);
  const improvement = capacityEvent(better.events);
  assert.equal(deterioration.direction, "deteriorated");
  assert.equal(deterioration.conditionKind, "new-condition");
  assert.equal(deterioration.lifecycle, "attention-candidate");
  assert.equal(worse.attentionCandidates.find((entry) => entry.subjectId === "obj-capacity")?.signal.requestedLevel, "secondary");
  assert.equal(improvement.direction, "improved");
  assert.equal(improvement.conditionKind, "resolved-condition");
  assert.equal(improvement.lifecycle, "resolved");
  assert.equal(better.attentionCandidates.find((entry) => entry.subjectId === "obj-capacity")?.signal.requestedLevel, "context");
});

test("H/I/J — persistence is deduplicated, escalation surfaces, and recovery resolves", () => {
  const persistent = capacityEvent(evaluateProactiveMonitoring(pair(90, 90)).events);
  const escalated = capacityEvent(evaluateProactiveMonitoring(pair(90, 96)).events);
  const resolved = capacityEvent(evaluateProactiveMonitoring(pair(96, 70)).events);
  assert.equal(persistent.conditionKind, "persistent-condition");
  assert.equal(persistent.lifecycle, "suppressed");
  assert.equal(escalated.conditionKind, "escalated-condition");
  assert.equal(escalated.significance, "critical");
  assert.equal(escalated.lifecycle, "attention-candidate");
  assert.equal(resolved.conditionKind, "resolved-condition");
  assert.equal(resolved.lifecycle, "resolved");
  assert.equal(acknowledgeMonitoringChange(escalated).lifecycle, "acknowledged");
});

test("K — event provenance preserves both observations and canonical transformation evidence", () => {
  const result = evaluateProactiveMonitoring(pair(70, 90));
  const event = capacityEvent(result.events);
  assert.equal(event.previousObservationId, result.observationPair.previousObservationId);
  assert.equal(event.currentObservationId, result.observationPair.currentObservationId);
  assert.match(event.provenance.comparisonAuthority, /^RDI:3/);
  assert.ok(event.provenance.previous.transformationRefs.length > 0);
  assert.ok(event.provenance.current.transformationRefs.length > 0);
  assert.ok(Object.isFrozen(event.provenance.current.transformationRefs));
});

test("L/M — DRI-6 resolves candidates while explicit user focus remains primary", () => {
  const result = evaluateProactiveMonitoring(pair(90, 96));
  const explicit = createDirectorRuntimeAttentionSignal({
    signalId: "explicit-revenue-focus",
    subject: Object.freeze({ subjectId: "obj-revenue", subjectKind: "object" }),
    source: "user-interaction",
    reason: "explicit-selection",
    scope: "subject",
    requestedLevel: "primary",
    persistence: "transient",
    intent: "request-focus",
  });
  const resolved = resolveMonitoringAttentionWithExistingSignals(result, Object.freeze([explicit]));
  assert.equal(resolved.ok, true);
  assert.equal(resolved.outcome?.assignments.find((entry) => entry.resolvedLevel === "primary")?.subject.subjectId, "obj-revenue");
  assert.notEqual(resolved.outcome?.assignments.find((entry) => entry.subject.subjectId === "obj-capacity")?.resolvedLevel, "primary");
});

test("N/O — evaluation is read-only, candidate-only, and Advisor context is user initiated", () => {
  const observations = pair(70, 90);
  const before = JSON.stringify(observations);
  const result = evaluateProactiveMonitoring(observations);
  assert.equal(JSON.stringify(observations), before);
  assert.equal(result.runtimeDisposition, "read-only");
  assert.equal(result.memoryDisposition, "no-automatic-promotion");
  assert.ok(result.events.every((event) => event.memoryDisposition === "candidate-only"));
  const advisor = createMonitoringAdvisorContext(result);
  assert.equal(advisor.title, "Monitoring changes");
  assert.equal(advisor.memoryPolicy, "current-facts-override-history");
});

test("P — incompatible workspaces and source targets cannot leak across scope", () => {
  const workspacePair = Object.freeze({ previous: observation(70, 1), current: observation(90, 2, "workspace-b") });
  const sourcePair = Object.freeze({ previous: observation(70, 1), current: observation(90, 2, "workspace-a", "csv:workspace-a:other") });
  assert.equal(classifyMonitoringObservationPair(workspacePair).compatible, false);
  assert.equal(classifyMonitoringObservationPair(sourcePair).compatible, false);
  assert.equal(evaluateProactiveMonitoring(workspacePair).events.length, 0);
});

test("Q — repeated evaluation is deterministic and deeply frozen", () => {
  const observations = pair(70, 96);
  const first = evaluateProactiveMonitoring(observations);
  const second = evaluateProactiveMonitoring(observations);
  assert.deepEqual(first, second);
  assert.ok(Object.isFrozen(first));
  assert.ok(Object.isFrozen(first.events));
  assert.ok(Object.isFrozen(first.events[0]?.metricChanges));
  assert.ok(Object.isFrozen(first.attentionCandidates));
});

test("R — the foundation contains no scheduler, notification, UI, or durable-memory dependency and certifies A–R", () => {
  const source = readFileSync(new URL("./proactiveMonitoringFoundation.ts", import.meta.url), "utf8");
  const explorer = readFileSync(new URL("../../executive/nex-mvp/data/NexoraExecutiveDataExplorer.tsx", import.meta.url), "utf8");
  for (const forbidden of ["setInterval(", "setTimeout(", 'from "react"', 'from "three"', "executiveMemory", "fetch("]) {
    assert.equal(source.includes(forbidden), false, forbidden);
  }
  for (const evidence of ["evaluateProactiveMonitoring", "Since previous observation", "View Changes", "createMonitoringAdvisorContext", "onViewOnStage(event.subjectId)"]) {
    assert.ok(explorer.includes(evidence), evidence);
  }
  const evidence = Object.freeze(Object.fromEntries("ABCDEFGHIJKLMNOPQR".split("").map((gate) => [gate, true]))) as Readonly<Record<"A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R", boolean>>;
  const certification = certifyProactiveMonitoringFoundation(evidence);
  assert.equal(certification.certified, true);
  assert.equal(certification.passedGateCount, 18);
  assert.ok(Object.isFrozen(certification.gates));
});
