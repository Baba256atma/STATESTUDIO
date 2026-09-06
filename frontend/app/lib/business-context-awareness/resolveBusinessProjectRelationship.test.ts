import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  BUSINESS_PROJECT_RELATIONSHIP_BOUNDARY,
  BUSINESS_PROJECT_RELATIONSHIP_REGISTRY,
  BUSINESS_PROJECT_RELATIONSHIP_TYPES,
  diagnoseBusinessProjectRelationships,
  resolveBusinessProjectConcept,
  resolveBusinessProjectContext,
  resolveBusinessProjectRelationships,
  type BusinessProjectSourceRef,
  type EstablishedSemanticMeaning,
} from "./index.ts";

const here = dirname(fileURLToPath(import.meta.url));
const resolverSource = readFileSync(join(here, "resolveBusinessProjectRelationship.ts"), "utf8");

const ref = (sourceId: string, sourceContextId: string): BusinessProjectSourceRef => Object.freeze({ authorityId: "RDI:2/CSV+DATA-ADV:2", sourceId, sourceContextId });
const semantic = (semanticId: string, meaning: string | null, sourceContextId: string, state: EstablishedSemanticMeaning["state"] = "MANAGER_CONFIRMED", candidates: readonly string[] = []): EstablishedSemanticMeaning => Object.freeze({ semanticId, meaning, state, candidates: Object.freeze([...candidates]), sourceRefs: Object.freeze([ref(semanticId, sourceContextId)]) });
const contextEvidence = (id: string, kind: "ORGANIZATION" | "PROJECT", label: string) => Object.freeze({ evidenceId: id, kind, label, confirmationState: "AUTHORITATIVE" as const, sourceRef: Object.freeze({ authorityId: "BCA3FixtureAuthority", sourceId: id }) });
const business = resolveBusinessProjectContext({ workspaceId: "business", organization: { context: { label: "Manufacturing Company" }, evidence: contextEvidence("org", "ORGANIZATION", "Manufacturing Company") } });
const project = resolveBusinessProjectContext({ workspaceId: "project", project: { context: { projectId: "warehouse", label: "Warehouse Expansion" }, evidence: contextEvidence("project", "PROJECT", "Warehouse Expansion") } });
const hybrid = resolveBusinessProjectContext({
  workspaceId: "hybrid",
  organization: { context: { label: "Manufacturing Company" }, evidence: contextEvidence("org-h", "ORGANIZATION", "Manufacturing Company") },
  project: { context: { projectId: "line", label: "Production Line Expansion" }, evidence: contextEvidence("project-h", "PROJECT", "Production Line Expansion") },
});

function concept(meaning: string, sourceContextId: string, context = business, state: EstablishedSemanticMeaning["state"] = "MANAGER_CONFIRMED") {
  return resolveBusinessProjectConcept({ semantic: semantic(meaning.toLowerCase().replace(/\s+/g, "-"), meaning, sourceContextId, state), context });
}

test("BCA:3 A — On-Time Delivery MEASURE_OF Delivery Performance is directed, general, non-causal", () => {
  const projection = resolveBusinessProjectRelationships({ context: business, concepts: [concept("On-Time Delivery", "source-a"), concept("Delivery Performance", "source-a")] });
  const edge = projection.relationships.find((item) => item.relationshipType === "MEASURE_OF");
  assert.equal(edge?.fromCanonicalMeaning, "On-Time Delivery");
  assert.equal(edge?.toCanonicalMeaning, "Delivery Performance");
  assert.equal(edge?.directionality, "DIRECTED");
  assert.equal(edge?.scope, "GENERAL");
  assert.equal(edge?.causal, false);
  assert.equal(edge?.causalityEstablished, false);
  assert.equal(projection.relationships.some((item) => item.fromCanonicalMeaning === "Delivery Performance" && item.toCanonicalMeaning === "On-Time Delivery" && item.relationshipType === "MEASURE_OF"), false);
});

test("BCA:3 B — Backlog is RELEVANT_TO Delivery in BUSINESS without causality", () => {
  const projection = resolveBusinessProjectRelationships({ context: business, concepts: [concept("Backlog", "source-a"), concept("Delivery", "source-a")] });
  assert.ok(projection.relationships.some((item) => item.fromCanonicalMeaning === "Backlog" && item.toCanonicalMeaning === "Delivery" && item.relationshipType === "RELEVANT_TO"));
  assert.ok(projection.relationships.every((item) => item.causal === false && item.contextKinds.includes("BUSINESS")));
});

test("BCA:3 C — Backlog POTENTIALLY_RELATED_TO Capacity never becomes CAUSES", () => {
  const projection = resolveBusinessProjectRelationships({ context: business, concepts: [concept("Backlog", "source-a"), concept("Capacity", "source-a")] });
  assert.ok(projection.relationships.some((item) => item.relationshipType === "POTENTIALLY_RELATED_TO"));
  assert.ok(projection.relationships.every((item) => item.causal === false));
  assert.equal((BUSINESS_PROJECT_RELATIONSHIP_TYPES as readonly string[]).includes("CAUSES"), false);
});

test("BCA:3 D — Cost is RELEVANT_TO Margin in FINANCE without a causal decline claim", () => {
  const projection = resolveBusinessProjectRelationships({ context: business, concepts: [concept("Cost", "finance-source"), concept("Margin", "finance-source")] });
  const edge = projection.relationships.find((item) => item.fromCanonicalMeaning === "Cost" && item.toCanonicalMeaning === "Gross Margin");
  assert.equal(edge?.relationshipType, "RELEVANT_TO");
  assert.ok(edge?.conceptFamilies.includes("FINANCE"));
  assert.doesNotMatch(edge?.rejectedInferences.join(" ") ?? "", /caused margin decline/i);
});

test("BCA:3 E — Milestone PART_OF Project Schedule without milestone status", () => {
  const projection = resolveBusinessProjectRelationships({ context: project, concepts: [concept("Milestone", "project-source", project), concept("Project Schedule", "project-source", project)] });
  const edge = projection.relationships.find((item) => item.fromCanonicalMeaning === "Milestone" && item.toCanonicalMeaning === "Project Schedule");
  assert.equal(edge?.relationshipType, "PART_OF");
  assert.ok(edge?.contextKinds.includes("PROJECT"));
  assert.equal(edge?.currentRealityEstablished, false);
});

test("BCA:3 F — Schedule Variance MEASURE_OF Schedule Performance without lateness", () => {
  const projection = resolveBusinessProjectRelationships({ context: project, concepts: [concept("Schedule Variance", "project-source", project), concept("Schedule Performance", "project-source", project)] });
  const edge = projection.relationships.find((item) => item.relationshipType === "MEASURE_OF");
  assert.equal(edge?.fromCanonicalMeaning, "Schedule Variance");
  assert.equal(edge?.toCanonicalMeaning, "Schedule Performance");
  assert.doesNotMatch(JSON.stringify(projection), /late/i);
});

test("BCA:3 G — Hybrid Capacity and Resource Availability stay unmerged", () => {
  const capacity = concept("Capacity", "hybrid-source", hybrid);
  const resource = concept("Resource Availability", "hybrid-source", hybrid);
  const projection = resolveBusinessProjectRelationships({ context: hybrid, concepts: [capacity, resource] });
  const edge = projection.relationships.find((item) => item.fromCanonicalMeaning === "Capacity" && item.toCanonicalMeaning === "Resource Availability");
  assert.ok(edge);
  assert.equal(edge?.relationshipType, "POTENTIALLY_RELATED_TO");
  assert.ok(edge?.rejectedInferences.some((item) => /aspects are not merged/i.test(item)));
});

test("BCA:3 H — Gross Margin and Milestone remain UNKNOWN without contextual support", () => {
  const projection = resolveBusinessProjectRelationships({ context: business, concepts: [concept("Gross Margin", "finance-source"), concept("Milestone", "project-source", project)] });
  assert.equal(projection.relationships.length, 0);
  assert.ok(projection.unknownPairs.some((item) => item.fromCanonicalMeaning === "Gross Margin" && item.toCanonicalMeaning === "Milestone" && item.state === "UNKNOWN"));
});

test("BCA:3 I — Capacity, Backlog, and Delivery stay non-causal", () => {
  const projection = resolveBusinessProjectRelationships({ context: business, concepts: [concept("Capacity", "source-a"), concept("Backlog", "source-a"), concept("Delivery", "source-a")] });
  assert.ok(projection.relationships.length > 0);
  assert.ok(projection.relationships.every((item) => item.causal === false && item.causalityEstablished === false));
  assert.equal(diagnoseBusinessProjectRelationships(projection).causalInference, "NONE");
});

test("BCA:3 J — Procurement and Budget stay RELEVANT_TO and never auto DEPENDS_ON", () => {
  const projection = resolveBusinessProjectRelationships({ context: project, concepts: [concept("Procurement", "project-source", project), concept("Budget", "project-source", project)] });
  assert.ok(projection.relationships.some((item) => item.fromCanonicalMeaning === "Procurement" && item.toCanonicalMeaning === "Budget" && item.relationshipType === "RELEVANT_TO"));
  assert.equal(projection.relationships.some((item) => item.relationshipType === "DEPENDS_ON"), false);
});

test("BCA:3 K — manager-confirmed organization relationship is consumed without a writer", () => {
  const backlog = concept("Backlog", "source-a");
  const projection = resolveBusinessProjectRelationships({
    context: business,
    concepts: [backlog],
    managerConfirmedRelationships: [Object.freeze({
      fromMeaning: "Backlog",
      toMeaning: "Unfulfilled Orders",
      relationshipType: "RELEVANT_TO",
      confirmationState: "MANAGER_CONFIRMED",
      sourceRef: Object.freeze({ authorityId: "ManagerConversation", sourceId: "turn-12", sourceContextId: "source-a" }),
      scope: "ORGANIZATION",
      stance: "AFFIRMS",
    })],
  });
  const edge = projection.relationships.find((item) => item.toCanonicalMeaning === "Unfulfilled Orders");
  assert.equal(edge?.scope, "ORGANIZATION");
  assert.equal(edge?.confirmationState, "MANAGER_CONFIRMED");
  assert.equal(BUSINESS_PROJECT_RELATIONSHIP_BOUNDARY.writesManagerConfirmation, false);
});

test("BCA:3 L — unrelated sources do not mint cross-source relationships", () => {
  const projection = resolveBusinessProjectRelationships({
    context: business,
    concepts: [concept("Capacity", "source-a"), concept("Backlog", "source-a"), concept("Project Schedule", "source-b", project), concept("Resource Availability", "source-b", project)],
  });
  assert.equal(projection.relationships.some((item) => item.fromCanonicalMeaning === "Capacity" && item.toCanonicalMeaning === "Resource Availability"), false);
  assert.equal(projection.relationships.some((item) => item.fromCanonicalMeaning === "Capacity" && item.toCanonicalMeaning === "Project Schedule"), false);
  assert.ok(projection.omitted.some((item) => item.includes("cross-source-blocked")) || projection.relationships.every((item) => samePairSource(item) || item.relationshipType !== "POTENTIALLY_RELATED_TO"));
});

function samePairSource(item: { sourceRefs: readonly { sourceContextId?: string | null }[] }): boolean {
  const ids = [...new Set(item.sourceRefs.map((entry) => entry.sourceContextId).filter(Boolean))];
  return ids.length <= 1;
}

test("BCA:3 M — MEASURE_OF is not reversed", () => {
  const projection = resolveBusinessProjectRelationships({ context: business, concepts: [concept("On-Time Delivery", "source-a"), concept("Delivery Performance", "source-a")] });
  assert.ok(projection.relationships.some((item) => item.fromCanonicalMeaning === "On-Time Delivery" && item.relationshipType === "MEASURE_OF"));
  assert.equal(projection.relationships.some((item) => item.fromCanonicalMeaning === "Delivery Performance" && item.toCanonicalMeaning === "On-Time Delivery"), false);
});

test("BCA:3 N — general and contrary organization evidence are both preserved", () => {
  const projection = resolveBusinessProjectRelationships({
    context: business,
    concepts: [concept("Backlog", "source-a"), concept("Delivery", "source-a")],
    managerConfirmedRelationships: [Object.freeze({
      fromMeaning: "Backlog",
      toMeaning: "Delivery",
      relationshipType: "RELEVANT_TO",
      confirmationState: "MANAGER_CONFIRMED",
      sourceRef: Object.freeze({ authorityId: "ManagerConversation", sourceId: "contrary", sourceContextId: "source-a" }),
      scope: "ORGANIZATION",
      stance: "CONTRARY",
    })],
  });
  const general = projection.relationships.find((item) => item.fromCanonicalMeaning === "Backlog" && item.toCanonicalMeaning === "Delivery" && item.knowledgeScopes.includes("GENERAL"));
  assert.equal(general?.suppressedForCurrentContext, true);
  assert.equal(general?.ambiguity.preserved, true);
  assert.match(general?.ambiguity.note ?? "", /organization-specific contrary/i);
});

test("BCA:3 O — identical durable inputs rebuild the same frozen projection", () => {
  const input = Object.freeze({ context: business, concepts: Object.freeze([concept("Backlog", "source-a"), concept("Delivery", "source-a"), concept("Capacity", "source-a")]) });
  const before = JSON.stringify(input);
  const first = resolveBusinessProjectRelationships(input);
  const rebuilt = resolveBusinessProjectRelationships(JSON.parse(before));
  assert.deepEqual(rebuilt, first);
  assert.equal(JSON.stringify(input), before);
  assert.equal(Object.isFrozen(first), true);
});

test("BCA:3 token overlap does not relate Project Cost to Customer Acquisition Cost", () => {
  const cac = resolveBusinessProjectConcept({ semantic: semantic("cac", "Customer Acquisition Cost", "source-a", "AUTHORITATIVE"), context: business });
  const cost = concept("Project Cost", "source-a");
  const projection = resolveBusinessProjectRelationships({ context: business, concepts: [cac, cost] });
  assert.equal(projection.relationships.length, 0);
});

test("BCA:3 MEASURE_OF outranks duplicate RELEVANT_TO for the same pair", () => {
  const projection = resolveBusinessProjectRelationships({ context: business, concepts: [concept("On-Time Delivery", "source-a"), concept("Delivery Performance", "source-a")] });
  assert.equal(projection.relationships.some((item) => item.toCanonicalMeaning === "Delivery Performance" && item.relationshipType === "RELEVANT_TO"), false);
});

test("BCA:3 boundary, registry, and causal authorities stay separate", () => {
  assert.equal(Object.isFrozen(BUSINESS_PROJECT_RELATIONSHIP_REGISTRY), true);
  assert.equal(BUSINESS_PROJECT_RELATIONSHIP_BOUNDARY.ownsCausalAuthority, false);
  assert.equal(BUSINESS_PROJECT_RELATIONSHIP_BOUNDARY.wiresAdvisor, false);
  assert.equal(BUSINESS_PROJECT_RELATIONSHIP_BOUNDARY.mutatesDecisionTheatre, false);
  assert.equal((BUSINESS_PROJECT_RELATIONSHIP_TYPES as readonly string[]).includes("CAUSES"), false);
  assert.equal(BUSINESS_PROJECT_RELATIONSHIP_REGISTRY.some((item) => item.relationshipType === "DEPENDS_ON"), false);
  assert.doesNotMatch(resolverSource, /commitPreparedCsvRealDataImport|onSelectSubject|createDecision|applyCsvSemanticClarification/);
  assert.match(resolverSource, /BUSINESS_PROJECT_RELATIONSHIP_REGISTRY/);
});
