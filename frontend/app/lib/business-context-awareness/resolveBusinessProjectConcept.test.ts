import assert from "node:assert/strict";
import test from "node:test";

import {
  BUSINESS_PROJECT_CONCEPT_BOUNDARY,
  BUSINESS_PROJECT_CONCEPT_REGISTRY,
  diagnoseBusinessProjectConcept,
  resolveBusinessProjectConcept,
  resolveBusinessProjectContext,
  type BusinessProjectSourceRef,
  type EstablishedSemanticMeaning,
} from "./index.ts";

const ref = (sourceId: string, sourceContextId: string): BusinessProjectSourceRef => Object.freeze({ authorityId: "RDI:2/CSV+DATA-ADV:2", sourceId, sourceContextId });
const semantic = (semanticId: string, meaning: string | null, sourceContextId: string, state: EstablishedSemanticMeaning["state"] = "MANAGER_CONFIRMED", candidates: readonly string[] = []): EstablishedSemanticMeaning => Object.freeze({ semanticId, meaning, state, candidates: Object.freeze([...candidates]), sourceRefs: Object.freeze([ref(semanticId, sourceContextId)]) });
const contextEvidence = (id: string, kind: "ORGANIZATION" | "PROJECT", label: string) => Object.freeze({ evidenceId: id, kind, label, confirmationState: "AUTHORITATIVE" as const, sourceRef: Object.freeze({ authorityId: "BCA2FixtureAuthority", sourceId: id }) });
const business = resolveBusinessProjectContext({ workspaceId: "business", organization: { context: { label: "Manufacturing Company" }, evidence: contextEvidence("org", "ORGANIZATION", "Manufacturing Company") } });
const project = resolveBusinessProjectContext({ workspaceId: "project", project: { context: { projectId: "warehouse", label: "Warehouse Expansion" }, evidence: contextEvidence("project", "PROJECT", "Warehouse Expansion") } });
const hybrid = resolveBusinessProjectContext({ workspaceId: "hybrid", organization: { context: { label: "Manufacturing Company" }, evidence: contextEvidence("org-h", "ORGANIZATION", "Manufacturing Company") }, project: { context: { projectId: "line", label: "Production Line Expansion" }, evidence: contextEvidence("project-h", "PROJECT", "Production Line Expansion") } });
const unknownContext = resolveBusinessProjectContext({ workspaceId: "unknown" });

test("BCA:2 A/B — Backlog and Gross Margin resolve as general Business concepts without reality or causality", () => {
  const backlog = resolveBusinessProjectConcept({ semantic: semantic("bkl", "Backlog Level", "source-a"), context: business });
  assert.equal(backlog.canonicalMeaning, "Backlog");
  assert.equal(backlog.contextKind, "BUSINESS");
  assert.ok(backlog.conceptFamilies.includes("OPERATIONS"));
  assert.deepEqual(backlog.contextualAssociations.map((item) => item.targetConcept), ["Delivery", "Capacity", "Throughput"]);
  assert.ok(backlog.contextualAssociations.every((item) => item.causal === false));
  assert.equal(backlog.currentReality, "NOT_ESTABLISHED");
  assert.equal(backlog.executiveObjectId, null);
  const margin = resolveBusinessProjectConcept({ semantic: semantic("gm", "Gross Margin", "finance-source", "AUTHORITATIVE"), context: business });
  assert.deepEqual(margin.conceptFamilies, ["FINANCE"]);
  assert.doesNotMatch(margin.generalMeaning ?? "", /healthy|problem|risk/i);
});

test("BCA:2 C/D — Schedule Variance and Milestone are Project concepts without status claims", () => {
  const schedule = resolveBusinessProjectConcept({ semantic: semantic("sch-var", "Schedule Variance", "project-source"), context: project });
  assert.equal(schedule.contextKind, "PROJECT");
  assert.deepEqual(schedule.conceptFamilies, ["SCHEDULE"]);
  assert.equal(schedule.currentReality, "NOT_ESTABLISHED");
  const milestone = resolveBusinessProjectConcept({ semantic: semantic("milestone", "Milestone", "project-source"), context: project });
  assert.ok(milestone.conceptFamilies.includes("SCHEDULE"));
  assert.ok(milestone.conceptFamilies.includes("DELIVERABLE"));
  assert.equal(milestone.rejectedInferences.some((item) => /current state/i.test(item)), true);
});

test("BCA:2 E/F — Cost and Capacity preserve qualified Hybrid relevance", () => {
  const cost = resolveBusinessProjectConcept({ semantic: semantic("cost", "Cost", "hybrid-source", "AUTHORITATIVE"), context: hybrid });
  assert.equal(cost.contextKind, "HYBRID");
  assert.ok(cost.domainRelevance.some((item) => item.contextKind === "BUSINESS" && item.family === "FINANCE"));
  assert.ok(cost.domainRelevance.some((item) => item.contextKind === "PROJECT" && item.family === "COST"));
  const capacity = resolveBusinessProjectConcept({ semantic: semantic("capacity", "Capacity", "hybrid-source"), context: hybrid });
  assert.equal(capacity.contextKind, "HYBRID");
  assert.ok(capacity.domainRelevance.some((item) => item.aspect === "CURRENT_OPERATIONS"));
  assert.ok(capacity.domainRelevance.some((item) => item.aspect === "PLANNED_PROJECT"));
  assert.notEqual(capacity.domainRelevance.find((item) => item.aspect === "CURRENT_OPERATIONS")?.aspect, capacity.domainRelevance.find((item) => item.aspect === "PLANNED_PROJECT")?.aspect);
});

test("BCA:2 G/H — unknown exact meaning stays Unknown and upstream ambiguity is preserved", () => {
  const alpha = resolveBusinessProjectConcept({ semantic: semantic("abc", "Alpha Balance Coefficient", "opaque-source", "AUTHORITATIVE"), context: business });
  assert.equal(alpha.state, "UNKNOWN");
  assert.equal(alpha.canonicalMeaning, null);
  assert.equal(alpha.conceptFamilies.length, 0);
  const ambiguous = resolveBusinessProjectConcept({ semantic: semantic("cap-av", null, "source-a", "AMBIGUOUS", ["Available Capacity", "Capacity Availability"]), context: business });
  assert.equal(ambiguous.state, "AMBIGUOUS");
  assert.equal(ambiguous.canonicalMeaning, null);
  assert.equal(ambiguous.ambiguity.preserved, true);
  assert.deepEqual(ambiguous.ambiguity.candidates, ["Available Capacity", "Capacity Availability"]);
});

test("BCA:2 I/J — general knowledge never establishes current reality or causal relations", () => {
  const concepts = ["Backlog", "Capacity", "Delivery"].map((meaning) => resolveBusinessProjectConcept({ semantic: semantic(meaning.toLowerCase(), meaning, "source-general", "AUTHORITATIVE"), context: business }));
  assert.ok(concepts.every((concept) => concept.currentReality === "NOT_ESTABLISHED"));
  assert.ok(concepts.every((concept) => concept.contextualAssociations.every((item) => item.causal === false)));
  assert.ok(concepts.every((concept) => diagnoseBusinessProjectConcept(concept).causalInference === "NONE"));
});

test("BCA:2 K — source-scoped concept truth does not transfer", () => {
  const capacity = resolveBusinessProjectConcept({ semantic: semantic("capacity-a", "Capacity", "source-a"), context: business });
  const resource = resolveBusinessProjectConcept({ semantic: semantic("resource-b", "Resource Availability", "source-b"), context: project });
  assert.equal(capacity.sourceRefs.some((item) => item.sourceContextId === "source-b"), false);
  assert.equal(resource.sourceRefs.some((item) => item.sourceContextId === "source-a"), false);
  assert.notEqual(capacity.conceptId, resource.conceptId);
});

test("BCA:2 L — identical durable inputs produce identical immutable concept intelligence", () => {
  const input = Object.freeze({ semantic: semantic("otd", "On-time delivery percentage", "restored-source", "MANAGER_CONFIRMED"), context: business });
  const before = JSON.stringify(input);
  const first = resolveBusinessProjectConcept(input);
  const rebuilt = resolveBusinessProjectConcept(JSON.parse(before));
  assert.deepEqual(rebuilt, first);
  assert.equal(JSON.stringify(input), before);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(first.canonicalMeaning, "On-Time Delivery");
});

test("BCA:2 organization-specific meaning remains manager-sourced and does not create a writer", () => {
  const result = resolveBusinessProjectConcept({ semantic: semantic("backlog", "Backlog", "source-a"), context: business, organizationSpecificMeaning: { meaning: "Orders past their promised production start date", confirmationState: "MANAGER_CONFIRMED", sourceRef: Object.freeze({ authorityId: "ManagerConversation", sourceId: "turn-44", sourceContextId: "source-a" }) } });
  assert.deepEqual(result.knowledgeScopes, ["GENERAL", "ORGANIZATION_SPECIFIC"]);
  assert.match(result.organizationSpecificMeaning?.meaning ?? "", /promised production start/i);
  assert.ok(result.sourceRefs.some((item) => item.authorityId === "ManagerConversation"));
});

test("BCA:2 registry and boundary are immutable, extensible without resolver branches, and mutation-safe", () => {
  assert.equal(Object.isFrozen(BUSINESS_PROJECT_CONCEPT_REGISTRY), true);
  assert.equal(new Set(BUSINESS_PROJECT_CONCEPT_REGISTRY.map((item) => item.registryId)).size, BUSINESS_PROJECT_CONCEPT_REGISTRY.length);
  assert.equal(BUSINESS_PROJECT_CONCEPT_BOUNDARY.resolvesFieldMeaning, false);
  assert.equal(BUSINESS_PROJECT_CONCEPT_BOUNDARY.establishesCurrentReality, false);
  assert.equal(BUSINESS_PROJECT_CONCEPT_BOUNDARY.createsObjects, false);
  assert.equal(BUSINESS_PROJECT_CONCEPT_BOUNDARY.createsCausalEdges, false);
  assert.equal(BUSINESS_PROJECT_CONCEPT_BOUNDARY.mutatesStage, false);
  assert.equal(BUSINESS_PROJECT_CONCEPT_BOUNDARY.mutatesDecision, false);
  assert.equal(BUSINESS_PROJECT_CONCEPT_BOUNDARY.persistsState, false);
  void unknownContext;
});
