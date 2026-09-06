import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  BUSINESS_PROJECT_PROCESS_CONTEXT_BOUNDARY,
  BUSINESS_PROJECT_PROCESS_CONTEXT_REGISTRY,
  PROJECT_WORK_PHASES,
  diagnoseBusinessProjectProcessContext,
  resolveBusinessProjectConcept,
  resolveBusinessProjectContext,
  resolveBusinessProjectProcessContext,
  resolveBusinessProjectRelationships,
  type BusinessProjectSourceRef,
  type EstablishedSemanticMeaning,
} from "./index.ts";

const here = dirname(fileURLToPath(import.meta.url));
const resolverSource = readFileSync(join(here, "resolveBusinessProjectProcessContext.ts"), "utf8");
const contractSource = readFileSync(join(here, "businessProjectProcessContextContract.ts"), "utf8");

const ref = (sourceId: string, sourceContextId: string): BusinessProjectSourceRef => Object.freeze({ authorityId: "RDI:2/CSV+DATA-ADV:2", sourceId, sourceContextId });
const semantic = (semanticId: string, meaning: string | null, sourceContextId: string, state: EstablishedSemanticMeaning["state"] = "MANAGER_CONFIRMED"): EstablishedSemanticMeaning => Object.freeze({ semanticId, meaning, state, sourceRefs: Object.freeze([ref(semanticId, sourceContextId)]) });
const evidence = (id: string, kind: "ORGANIZATION" | "PROJECT", label: string) => Object.freeze({ evidenceId: id, kind, label, confirmationState: "AUTHORITATIVE" as const, sourceRef: Object.freeze({ authorityId: "BCA4Fixture", sourceId: id }) });
const business = resolveBusinessProjectContext({ workspaceId: "business", organization: { context: { label: "Manufacturing Company" }, evidence: evidence("org", "ORGANIZATION", "Manufacturing") } });
const project = resolveBusinessProjectContext({ workspaceId: "project", project: { context: { projectId: "warehouse", label: "Warehouse Expansion" }, evidence: evidence("project", "PROJECT", "Warehouse Expansion") } });
const hybrid = resolveBusinessProjectContext({
  workspaceId: "hybrid",
  organization: { context: { label: "Manufacturing Company" }, evidence: evidence("org-h", "ORGANIZATION", "Manufacturing") },
  project: { context: { projectId: "line", label: "Production Line Expansion" }, evidence: evidence("project-h", "PROJECT", "Line") },
});

function concept(meaning: string, sourceContextId: string, context = business) {
  return resolveBusinessProjectConcept({ semantic: semantic(meaning.toLowerCase().replace(/\s+/g, "-"), meaning, sourceContextId), context });
}

function areas(projection: ReturnType<typeof resolveBusinessProjectProcessContext>, meaning: string): string[] {
  return [...new Set(projection.placements.filter((item) => item.canonicalMeaning === meaning).flatMap((item) => item.processAreas))];
}

test("BCA:4 A — Backlog maps to order/production/fulfillment without an active process", () => {
  const projection = resolveBusinessProjectProcessContext({ context: business, concepts: [concept("Backlog", "source-a")] });
  assert.deepEqual(areas(projection, "Backlog").sort(), ["FULFILLMENT", "ORDER_MANAGEMENT", "PRODUCTION"]);
  assert.ok(projection.placements.every((item) => item.processInstanceEstablished === false && item.currentRealityEstablished === false));
});

test("BCA:4 B — On-Time Delivery is a fulfillment/delivery performance indicator without a current value", () => {
  const projection = resolveBusinessProjectProcessContext({ context: business, concepts: [concept("On-Time Delivery", "source-a")] });
  const placement = projection.placements.find((item) => item.canonicalMeaning === "On-Time Delivery");
  assert.ok(placement?.processAreas.includes("DELIVERY"));
  assert.ok(placement?.processAreas.includes("FULFILLMENT"));
  assert.ok(placement?.participationTypes.includes("PERFORMANCE_INDICATOR_FOR"));
  assert.doesNotMatch(JSON.stringify(projection), /\b96%|\bvalue\b/i);
});

test("BCA:4 C — Supplier Lead Time belongs to procurement/supply without delay claims", () => {
  const projection = resolveBusinessProjectProcessContext({ context: business, concepts: [concept("Supplier Lead Time", "source-a")] });
  const areasFound = areas(projection, "Supplier Lead Time");
  assert.ok(areasFound.includes("PROCUREMENT"));
  assert.ok(areasFound.includes("SUPPLY"));
  assert.doesNotMatch(JSON.stringify(projection), /delay/i);
});

test("BCA:4 D — Defect Rate uses the Quality concept in QUALITY without a current problem", () => {
  const projection = resolveBusinessProjectProcessContext({ context: business, concepts: [concept("Defect Rate", "source-a")] });
  assert.equal(projection.placements[0]?.canonicalMeaning, "Quality");
  assert.ok(areas(projection, "Quality").includes("QUALITY"));
});

test("BCA:4 E — Milestone is project work control, not milestone status", () => {
  const projection = resolveBusinessProjectProcessContext({ context: project, concepts: [concept("Milestone", "project-source", project)] });
  const placement = projection.placements.find((item) => item.canonicalMeaning === "Milestone");
  assert.ok(placement?.projectWorkPhases.includes("PLANNING"));
  assert.ok(placement?.projectWorkPhases.includes("PROJECT_WORK_EXECUTION"));
  assert.ok(placement?.projectWorkPhases.includes("MONITORING_CONTROL"));
  assert.ok(placement?.projectControlAreas.includes("SCHEDULE_CONTROL"));
  assert.ok(placement?.projectControlAreas.includes("DELIVERABLE_CONTROL"));
  assert.doesNotMatch(JSON.stringify(projection), /late|completed|active milestone/i);
});

test("BCA:4 F — Schedule Variance is schedule control performance without lateness", () => {
  const projection = resolveBusinessProjectProcessContext({ context: project, concepts: [concept("Schedule Variance", "project-source", project)] });
  const placement = projection.placements[0];
  assert.ok(placement?.projectWorkPhases.includes("MONITORING_CONTROL"));
  assert.ok(placement?.projectControlAreas.includes("SCHEDULE_CONTROL"));
  assert.ok(placement?.participationTypes.includes("PERFORMANCE_INDICATOR_FOR"));
});

test("BCA:4 G — Project Cost is cost control across planning/work/monitoring", () => {
  const projection = resolveBusinessProjectProcessContext({ context: project, concepts: [concept("Project Cost", "project-source", project)] });
  const placement = projection.placements.find((item) => item.canonicalMeaning === "Cost");
  assert.ok(placement?.projectWorkPhases.includes("PLANNING"));
  assert.ok(placement?.projectWorkPhases.includes("PROJECT_WORK_EXECUTION"));
  assert.ok(placement?.projectWorkPhases.includes("MONITORING_CONTROL"));
  assert.ok(placement?.projectControlAreas.includes("COST_CONTROL"));
  assert.doesNotMatch(JSON.stringify(projection), /overrun/i);
});

test("BCA:4 H — Hybrid Capacity preserves business and project placements without merging aspects", () => {
  const capacity = concept("Capacity", "hybrid-source", hybrid);
  const projection = resolveBusinessProjectProcessContext({ context: hybrid, concepts: [capacity] });
  assert.ok(projection.placements.some((item) => item.contextKind === "BUSINESS" && item.processAreas.includes("PRODUCTION")));
  assert.ok(projection.placements.some((item) => item.contextKind === "PROJECT" && item.projectControlAreas.includes("RESOURCE_MANAGEMENT")));
  assert.notEqual(projection.placements.find((item) => item.contextKind === "BUSINESS")?.processContextId, projection.placements.find((item) => item.contextKind === "PROJECT")?.processContextId);
});

test("BCA:4 I/R — general fulfillment and manager production-planning context are both preserved", () => {
  const projection = resolveBusinessProjectProcessContext({
    context: business,
    concepts: [concept("Backlog", "source-a")],
    managerConfirmedProcessContexts: [Object.freeze({
      conceptMeaning: "Backlog",
      processAreas: Object.freeze(["PLANNING", "PRODUCTION"]),
      confirmationState: "MANAGER_CONFIRMED" as const,
      sourceRef: Object.freeze({ authorityId: "ManagerConversation", sourceId: "turn-9", sourceContextId: "source-a" }),
      scope: "ORGANIZATION",
      stance: "AFFIRMS",
    })],
  });
  assert.ok(projection.placements.some((item) => item.scope === "GENERAL" && item.processAreas.includes("FULFILLMENT")));
  assert.ok(projection.placements.some((item) => item.scope === "ORGANIZATION" && item.confirmationState === "MANAGER_CONFIRMED" && item.processAreas.includes("PLANNING")));
});

test("BCA:4 J — known concept without process registry stays UNKNOWN", () => {
  const projection = resolveBusinessProjectProcessContext({ context: business, concepts: [concept("Delivery Performance", "source-a")] });
  assert.equal(projection.placements.length, 0);
  assert.ok(projection.unknownConcepts.includes("Delivery Performance"));
});

test("BCA:4 K — process context known does not establish a process instance", () => {
  const projection = resolveBusinessProjectProcessContext({ context: business, concepts: [concept("Supplier Lead Time", "source-a")] });
  assert.ok(projection.placements.length > 0);
  assert.ok(projection.placements.every((item) => item.processInstanceEstablished === false));
});

test("BCA:4 L — no process mining outputs without event logs", () => {
  const projection = resolveBusinessProjectProcessContext({ context: business, concepts: [concept("Backlog", "source-a")] });
  assert.equal(projection.processMiningPerformed, false);
  assert.equal(projection.referenceSequence.observedSequence, "UNKNOWN");
  assert.doesNotMatch(JSON.stringify(projection), /bottleneck|conformance|process variant/i);
});

test("BCA:4 M — reference sequence does not mint DEPENDS_ON", () => {
  const projection = resolveBusinessProjectProcessContext({ context: project, concepts: [concept("Procurement", "project-source", project)] });
  assert.equal(projection.referenceSequence.dependencyInferred, false);
  assert.doesNotMatch(JSON.stringify(projection.placements), /DEPENDS_ON/);
});

test("BCA:4 N — procurement/delivery process context is non-causal", () => {
  const concepts = [concept("Procurement", "source-a", project), concept("Delivery", "source-a")];
  const relationships = resolveBusinessProjectRelationships({ context: hybrid, concepts });
  const projection = resolveBusinessProjectProcessContext({ context: hybrid, concepts, relationships: relationships.relationships });
  assert.ok(projection.placements.length > 0);
  assert.equal(diagnoseBusinessProjectProcessContext(projection).causalInference, "NONE");
  assert.equal(projection.referenceSequence.causal, false);
});

test("BCA:4 O — PROJECT_WORK_EXECUTION is not CC:11 Execution", () => {
  const projection = resolveBusinessProjectProcessContext({ context: project, concepts: [concept("Milestone", "project-source", project)] });
  assert.ok(projection.placements.some((item) => item.projectWorkPhases.includes("PROJECT_WORK_EXECUTION")));
  assert.ok(projection.placements.every((item) => item.nexoraExecutionEntityId === null));
  assert.ok(projection.placements.every((item) => item.nexoraCanonicalExecutionRuntime === "CC:11/CanonicalExecution"));
  assert.equal((PROJECT_WORK_PHASES as readonly string[]).includes("EXECUTION"), false);
  assert.doesNotMatch(resolverSource, /startExecution|createDecision|onSelectSubject/);
  assert.match(contractSource, /PROJECT_WORK_EXECUTION/);
});

test("BCA:4 P — separate sources do not become one process", () => {
  const projection = resolveBusinessProjectProcessContext({
    context: business,
    concepts: [concept("Backlog", "source-a"), concept("Milestone", "source-b", project)],
  });
  assert.ok(projection.placements.every((item) => item.conceptIds.length === 1));
  assert.equal(projection.placements.some((item) => item.canonicalMeaning === "Milestone"), false);
});

test("BCA:4 Q — reference order may exist while observed order stays unknown", () => {
  const projection = resolveBusinessProjectProcessContext({ context: project, concepts: [concept("Schedule Variance", "project-source", project)] });
  assert.equal(projection.referenceSequence.kind, "REFERENCE_SEQUENCE");
  assert.equal(projection.referenceSequence.observedSequence, "UNKNOWN");
  assert.ok(projection.referenceSequence.steps.includes("PROJECT_WORK_EXECUTION"));
});

test("BCA:4 S — identical durable inputs rebuild the same frozen projection", () => {
  const input = Object.freeze({ context: business, concepts: Object.freeze([concept("Backlog", "source-a"), concept("On-Time Delivery", "source-a")]) });
  const before = JSON.stringify(input);
  const first = resolveBusinessProjectProcessContext(input);
  assert.deepEqual(resolveBusinessProjectProcessContext(JSON.parse(before)), first);
  assert.equal(JSON.stringify(input), before);
  assert.equal(Object.isFrozen(first), true);
});

test("BCA:4 substring Deliverable is not classified as DELIVERY", () => {
  const projection = resolveBusinessProjectProcessContext({ context: project, concepts: [concept("Deliverable", "project-source", project)] });
  assert.equal(projection.placements.some((item) => item.processAreas.includes("DELIVERY")), false);
  assert.ok(projection.placements.some((item) => item.projectControlAreas.includes("DELIVERABLE_CONTROL")));
});

test("BCA:4 contrary organization context suppresses general for current reasoning", () => {
  const projection = resolveBusinessProjectProcessContext({
    context: business,
    concepts: [concept("Backlog", "source-a")],
    managerConfirmedProcessContexts: [Object.freeze({
      conceptMeaning: "Backlog",
      processAreas: Object.freeze(["PRODUCTION"]),
      confirmationState: "MANAGER_CONFIRMED" as const,
      sourceRef: Object.freeze({ authorityId: "ManagerConversation", sourceId: "contrary", sourceContextId: "source-a" }),
      scope: "ORGANIZATION",
      stance: "CONTRARY",
    })],
  });
  const general = projection.placements.find((item) => item.scope === "GENERAL");
  assert.equal(general?.suppressedForCurrentContext, true);
  assert.equal(general?.ambiguity.preserved, true);
});

test("BCA:4 boundary remains read-only intelligence", () => {
  assert.equal(BUSINESS_PROJECT_PROCESS_CONTEXT_BOUNDARY.ownsProcessMining, false);
  assert.equal(BUSINESS_PROJECT_PROCESS_CONTEXT_BOUNDARY.ownsWorkflowEngine, false);
  assert.equal(BUSINESS_PROJECT_PROCESS_CONTEXT_BOUNDARY.ownsExecutionRuntime, false);
  assert.equal(BUSINESS_PROJECT_PROCESS_CONTEXT_BOUNDARY.wiresAdvisor, false);
  assert.equal(BUSINESS_PROJECT_PROCESS_CONTEXT_BOUNDARY.mutatesDecisionTheatre, false);
  assert.equal(Object.isFrozen(BUSINESS_PROJECT_PROCESS_CONTEXT_REGISTRY), true);
  assert.equal(BUSINESS_PROJECT_PROCESS_CONTEXT_BOUNDARY.writesManagerConfirmation, false);
});
