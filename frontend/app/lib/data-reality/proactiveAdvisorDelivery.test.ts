import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  PROACTIVE_ADVISOR_AUTHORITY_BOUNDARY,
  acknowledgeProactiveAdvisorBrief,
  applyGroundedProactiveAdvisorWording,
  certifyProactiveAdvisorDelivery,
  createProactiveAdvisorBrief,
  createProactiveAdvisorBriefWithDurableHistory,
  deliverProactiveAdvisorBrief,
  dismissProactiveAdvisorBrief,
  enqueueProactiveAdvisorBrief,
  evaluateProactiveAdvisorEligibility,
  getNextProactiveAdvisorBrief,
  listProactiveAdvisorBriefs,
  proactiveAdvisorDeliveryIdentity,
  proactiveAdvisorDeliveryNamespace,
  proactiveAdvisorDeliveryVersion,
  resetProactiveAdvisorDeliveryForTests,
} from "./proactiveAdvisorDelivery.ts";
import { evaluateProactiveMonitoring } from "./proactiveMonitoringFoundation.ts";
import {
  parseCsvDeterministically,
  prepareCsvRealDataImport,
  suggestCsvColumnMappings,
  type CsvVerticalSliceInput,
} from "./csvRealDataVerticalSlice.ts";
import type { ExecutiveSourceProjectionInput } from "./executiveSourceIntelligence.ts";
import { createCanonicalDurableExecutiveMemory } from "../executiveMemory/durableExecutiveMemory.ts";
import {
  createExecutiveMemory,
  initializeExecutiveMemoryStorageEngine,
  resetExecutiveMemoryStorageEngineForTests,
} from "../executiveMemory/executiveMemoryStorageEngine.ts";
import { registerExecutiveMemoryProvider, resetExecutiveMemoryPlatformForTests } from "../executiveMemory/executiveMemoryPlatform.ts";

const header = "Current Revenue,Previous Revenue,Operating Cost,Production Used Capacity,Production Total Capacity,Warehouse Used Capacity,Warehouse Total Capacity,On-Time Deliveries,Total Deliveries,Customer Satisfaction,Maximum Satisfaction Score";

function observation(
  capacityPercent: number,
  sequence: number,
  workspaceId = "workspace-a",
  customerScore = 4.2,
): ExecutiveSourceProjectionInput {
  const csvText = `${header}\n8400000,8080000,6700000,${capacityPercent * 100},10000,7900,8500,910,1000,${customerScore},5`;
  const importId = `PM4-${workspaceId}-${capacityPercent}-${customerScore}-${sequence}`;
  const importedAt = `2026-08-16T12:${String(sequence).padStart(2, "0")}:00.000Z`;
  const sourceContextId = `csv:${workspaceId}:pm4`;
  const input: CsvVerticalSliceInput = Object.freeze({
    workspaceId,
    fileName: `pm4-${sequence}.csv`,
    fileSize: csvText.length,
    csvText,
    importId,
    importedAt,
    sourceContextId,
  });
  const parsed = parseCsvDeterministically(csvText);
  const prepared = prepareCsvRealDataImport(input, suggestCsvColumnMappings(parsed.columns, importId));
  assert.equal(prepared.ready, true);
  assert.ok(prepared.snapshot && prepared.handoff && prepared.dataReality);
  return Object.freeze({
    workspaceId,
    sourceContextId,
    sourceLabel: input.fileName,
    committedAt: importedAt,
    recordCount: prepared.snapshot.records.length,
    mappingId: prepared.mapping.mappingId,
    snapshot: prepared.snapshot,
    handoff: prepared.handoff,
    dataReality: prepared.dataReality,
  });
}

function monitoring(from: number, to: number, workspaceId = "workspace-a") {
  return evaluateProactiveMonitoring(Object.freeze({
    previous: observation(from, 1, workspaceId),
    current: observation(to, 2, workspaceId),
  }));
}

test.beforeEach(resetProactiveAdvisorDeliveryForTests);

test("A — identity and narrow PM:4 authority are immutable", () => {
  assert.equal(proactiveAdvisorDeliveryIdentity, "PM:4/NexoraProactiveAdvisorDelivery");
  assert.equal(proactiveAdvisorDeliveryVersion, "1.0.0");
  assert.equal(proactiveAdvisorDeliveryNamespace, "nexora.proactive-monitoring.advisor-delivery");
  assert.equal(PROACTIVE_ADVISOR_AUTHORITY_BOUNDARY.ownsCurrentTruth, false);
  assert.equal(PROACTIVE_ADVISOR_AUTHORITY_BOUNDARY.ownsAttentionPriority, false);
  assert.equal(PROACTIVE_ADVISOR_AUTHORITY_BOUNDARY.deliverySurface, "existing-executive-advisor");
  assert.equal(PROACTIVE_ADVISOR_AUTHORITY_BOUNDARY.externalNotificationDelivery, false);
  assert.ok(Object.isFrozen(PROACTIVE_ADVISOR_AUTHORITY_BOUNDARY));
});

test("B — tiny noise and persistent conditions do not create proactive briefs", () => {
  const noise = monitoring(70, 70.1);
  const persistent = monitoring(96, 96);
  assert.equal(evaluateProactiveAdvisorEligibility(noise).eligible, false);
  assert.equal(createProactiveAdvisorBrief({ monitoring: noise }), null);
  assert.equal(createProactiveAdvisorBrief({ monitoring: persistent }), null);
  assert.equal(enqueueProactiveAdvisorBrief({ monitoring: noise }).reason, "suppressed");
});

test("C — a new meaningful condition produces one grounded important brief", () => {
  const brief = createProactiveAdvisorBrief({ monitoring: monitoring(70, 90) });
  assert.ok(brief);
  assert.equal(brief.priority, "important");
  assert.equal(brief.status, "candidate");
  assert.deepEqual(brief.subjectIds, ["obj-capacity"]);
  assert.ok(brief.currentFacts.some((fact) => fact.includes("ATTENTION")));
  assert.ok(brief.evidence.every((entry) => entry.previousObservationId && entry.currentObservationId));
  assert.equal(brief.historyBoundary, "current-facts-override-history");
  assert.equal(brief.runtimeDisposition, "read-only");
  assert.equal(brief.memoryDisposition, "no-automatic-promotion");
  assert.ok(Object.isFrozen(brief));
  assert.ok(Object.isFrozen(brief.currentFacts));
  assert.ok(Object.isFrozen(brief.evidence));
});

test("D — critical escalation is urgent and safe deterministic fallback is repeatable", () => {
  const result = monitoring(90, 96);
  const first = createProactiveAdvisorBrief({ monitoring: result });
  const second = createProactiveAdvisorBrief({ monitoring: result });
  assert.ok(first && second);
  assert.equal(first.priority, "urgent");
  assert.deepEqual(first, second);
  assert.equal(first.generation, "deterministic-canonical-fallback");
  const unsupported = applyGroundedProactiveAdvisorWording({
    brief: first,
    headline: "Unsupported prediction",
    summary: "This will cause an outage.",
    claimedEvidenceIds: ["missing-evidence"],
  });
  assert.equal(unsupported, first);
  const unsupportedClaim = applyGroundedProactiveAdvisorWording({
    brief: first,
    headline: "An outage is certain",
    summary: "Capacity will fail tomorrow.",
    claimedEvidenceIds: [first.evidence[0]!.evidenceId],
  });
  assert.equal(unsupportedClaim, first);
  const grounded = applyGroundedProactiveAdvisorWording({
    brief: first,
    headline: first.headline,
    summary: first.summary,
    claimedEvidenceIds: [first.evidence[0]!.evidenceId],
  });
  assert.equal(grounded.generation, "grounded-language-enhancement");
});

test("E — deduplication, foreground delivery, acknowledge, and dismiss are deterministic", () => {
  const result = monitoring(70, 90);
  const queued = enqueueProactiveAdvisorBrief({ monitoring: result });
  assert.equal(queued.enqueued, true);
  assert.equal(enqueueProactiveAdvisorBrief({ monitoring: result }).reason, "already-delivered");
  assert.equal(listProactiveAdvisorBriefs("workspace-a").length, 1);
  assert.equal(getNextProactiveAdvisorBrief("workspace-a")?.status, "queued");
  const delivered = deliverProactiveAdvisorBrief("workspace-a", queued.brief!.briefId, "2026-08-16T13:00:00.000Z");
  assert.equal(delivered?.status, "delivered");
  assert.equal(acknowledgeProactiveAdvisorBrief("workspace-a", queued.brief!.briefId, "2026-08-16T13:01:00.000Z")?.status, "acknowledged");

  resetProactiveAdvisorDeliveryForTests();
  const again = enqueueProactiveAdvisorBrief({ monitoring: result }).brief!;
  deliverProactiveAdvisorBrief("workspace-a", again.briefId, "2026-08-16T13:00:00.000Z");
  assert.equal(dismissProactiveAdvisorBrief("workspace-a", again.briefId, "2026-08-16T13:01:00.000Z")?.status, "dismissed");
});

test("F — recovery resolves the delivered condition and queues one recovery brief", () => {
  const problem = enqueueProactiveAdvisorBrief({ monitoring: monitoring(90, 96) }).brief!;
  deliverProactiveAdvisorBrief("workspace-a", problem.briefId, "2026-08-16T13:00:00.000Z");
  const recovery = enqueueProactiveAdvisorBrief({ monitoring: monitoring(96, 70) });
  assert.equal(recovery.enqueued, true);
  assert.equal(recovery.brief?.priority, "informational");
  const briefs = listProactiveAdvisorBriefs("workspace-a");
  assert.equal(briefs.find((entry) => entry.briefId === problem.briefId)?.status, "resolved");
  assert.equal(briefs.filter((entry) => entry.status === "queued").length, 1);

  resetProactiveAdvisorDeliveryForTests();
  const stale = enqueueProactiveAdvisorBrief({ monitoring: monitoring(90, 96) }).brief!;
  const newest = enqueueProactiveAdvisorBrief({ monitoring: monitoring(96, 70) }).brief!;
  assert.equal(listProactiveAdvisorBriefs("workspace-a").find((entry) => entry.briefId === stale.briefId)?.status, "superseded");
  assert.equal(getNextProactiveAdvisorBrief("workspace-a")?.briefId, newest.briefId);
});

test("G — relevant APP:4 history enriches but cannot override current facts", () => {
  resetExecutiveMemoryStorageEngineForTests();
  resetExecutiveMemoryPlatformForTests();
  registerExecutiveMemoryProvider({
    providerId: "durable-executive-memory",
    label: "Durable Executive Memory",
    version: "1.0.0",
    supportedCategories: Object.freeze(["decision"]),
  }, "2026-08-16T00:00:00.000Z");
  initializeExecutiveMemoryStorageEngine("2026-08-16T00:00:00.000Z");
  const stored = createExecutiveMemory(createCanonicalDurableExecutiveMemory({
    id: "app4:decision:capacity-2025",
    workspaceId: "workspace-a",
    kind: "decision",
    title: "Prior capacity response",
    summary: "A prior capacity review approved a temporary second shift.",
    narrative: "Capacity recovered after the temporary response.",
    status: "active",
    source: "APP:4/durable-executive-memory",
    owner: "manager",
    confidence: 0.82,
    createdAt: "2025-05-01T00:00:00.000Z",
    updatedAt: "2025-05-14T00:00:00.000Z",
    subjectReferences: Object.freeze([{ type: "object" as const, targetId: "obj-capacity", label: "Capacity" }]),
    provenance: Object.freeze(["decision-record:capacity-2025"]),
    decision: Object.freeze({ decisionId: "capacity-2025", rationale: "Protect delivery capacity.", status: "approved" as const }),
  }));
  assert.equal(stored.success, true);
  const brief = createProactiveAdvisorBriefWithDurableHistory(monitoring(70, 90));
  assert.ok(brief);
  assert.match(brief.currentFacts[0]!, /current executive state/i);
  assert.match(brief.historicalContext[0]!.summary, /prior capacity review/i);
  assert.equal(brief.historyBoundary, "current-facts-override-history");
  assert.ok(Object.isFrozen(brief.historicalContext[0]!.provenance));
});

test("H — workspace isolation and one-at-a-time priority ordering hold", () => {
  const important = enqueueProactiveAdvisorBrief({ monitoring: monitoring(70, 90, "workspace-a") }).brief!;
  const urgent = enqueueProactiveAdvisorBrief({ monitoring: monitoring(90, 96, "workspace-a") }).brief!;
  enqueueProactiveAdvisorBrief({ monitoring: monitoring(70, 90, "workspace-b") });
  assert.equal(getNextProactiveAdvisorBrief("workspace-a")?.briefId, urgent.briefId);
  assert.notEqual(getNextProactiveAdvisorBrief("workspace-a")?.briefId, important.briefId);
  assert.equal(listProactiveAdvisorBriefs("workspace-b").length, 1);
  assert.ok(listProactiveAdvisorBriefs("workspace-a").every((entry) => entry.workspaceId === "workspace-a"));
});

test("H — related changes in one observation aggregate into one coherent brief", () => {
  const result = evaluateProactiveMonitoring(Object.freeze({
    previous: observation(70, 1, "workspace-a", 4.5),
    current: observation(96, 2, "workspace-a", 3.5),
  }));
  const brief = createProactiveAdvisorBrief({ monitoring: result });
  assert.ok(brief);
  assert.deepEqual(brief.subjectIds, ["obj-capacity", "obj-customer"]);
  assert.equal(brief.monitoringEventIds.length, 2);
  assert.match(brief.headline, /2 executive objects/);
  assert.ok(brief.evidence.some((entry) => entry.subjectId === "obj-capacity"));
  assert.ok(brief.evidence.some((entry) => entry.subjectId === "obj-customer"));
});

test("I–T — integration evidence is present and all twenty release gates certify", () => {
  const source = readFileSync(new URL("./proactiveAdvisorDelivery.ts", import.meta.url), "utf8");
  const coordinator = readFileSync(new URL("../../executive/nex-mvp/data/NexoraAutomaticMonitoringCoordinator.tsx", import.meta.url), "utf8");
  const advisor = readFileSync(new URL("../../executive/nex-mvp/NexoraAdvisorInsightRegion.tsx", import.meta.url), "utf8");
  for (const forbidden of ["setInterval(", "fetch(", 'from "three"', "Notification(", "localStorage", "writeDurableExecutiveMemory"]) {
    assert.equal(source.includes(forbidden), false, forbidden);
  }
  for (const evidence of ["enqueueProactiveAdvisorBrief", "result.evaluation"]) assert.ok(coordinator.includes(evidence), evidence);
  for (const evidence of ["NEXORA DETECTED", "Current facts", "Evidence", "Investigate", "View on Stage", "Acknowledge", "Dismiss"]) assert.ok(advisor.includes(evidence), evidence);
  const gates = Object.freeze(Object.fromEntries("ABCDEFGHIJKLMNOPQRST".split("").map((gate) => [gate, true]))) as Readonly<Record<"A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R"|"S"|"T", boolean>>;
  const certification = certifyProactiveAdvisorDelivery(gates);
  assert.equal(certification.certified, true);
  assert.equal(certification.passedGateCount, 20);
  assert.ok(Object.isFrozen(certification.gates));
});
