import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  MANAGER_DECISION_CONTEXT_BOUNDARY,
  MANAGER_ROLE_RELEVANCE_REGISTRY,
  diagnoseManagerDecisionContext,
  resolveBusinessProjectConcept,
  resolveBusinessProjectContext,
  resolveBusinessProjectProcessContext,
  resolveBusinessProjectRelationships,
  resolveManagerDecisionContext,
  type BusinessProjectSourceRef,
  type EstablishedSemanticMeaning,
} from "./index.ts";

const here = dirname(fileURLToPath(import.meta.url));
const resolverSource = readFileSync(join(here, "resolveManagerDecisionContext.ts"), "utf8");
const registrySource = readFileSync(join(here, "managerRoleRelevanceRegistry.ts"), "utf8");

const ref = (sourceId: string, sourceContextId: string): BusinessProjectSourceRef => Object.freeze({ authorityId: "RDI:2/CSV+DATA-ADV:2", sourceId, sourceContextId });
const semantic = (semanticId: string, meaning: string, sourceContextId: string): EstablishedSemanticMeaning => Object.freeze({ semanticId, meaning, state: "MANAGER_CONFIRMED", sourceRefs: Object.freeze([ref(semanticId, sourceContextId)]) });
const evidence = (id: string, kind: "ORGANIZATION" | "PROJECT", label: string) => Object.freeze({ evidenceId: id, kind, label, confirmationState: "AUTHORITATIVE" as const, sourceRef: Object.freeze({ authorityId: "BCA5Fixture", sourceId: id }) });
const business = resolveBusinessProjectContext({ workspaceId: "business", organization: { context: { label: "Manufacturing Company" }, evidence: evidence("org", "ORGANIZATION", "Manufacturing") } });
const project = resolveBusinessProjectContext({ workspaceId: "project", project: { context: { projectId: "warehouse", label: "Warehouse Expansion" }, evidence: evidence("project", "PROJECT", "Warehouse") } });
const hybrid = resolveBusinessProjectContext({
  workspaceId: "hybrid",
  organization: { context: { label: "Manufacturing Company" }, evidence: evidence("org-h", "ORGANIZATION", "Manufacturing") },
  project: { context: { projectId: "line", label: "Production Line Expansion" }, evidence: evidence("project-h", "PROJECT", "Line") },
});

function concept(meaning: string, sourceContextId: string, context = business) {
  return resolveBusinessProjectConcept({ semantic: semantic(meaning.toLowerCase().replace(/\s+/g, "-"), meaning, sourceContextId), context });
}

const situation = [
  concept("Backlog", "source-a"),
  concept("Capacity", "source-a"),
  concept("On-Time Delivery", "source-a"),
  concept("Gross Margin", "source-a"),
  concept("Cost", "source-a"),
];

function meanings(ids: readonly string[], concepts = situation): string[] {
  return ids.map((id) => concepts.find((item) => item.conceptId === id)?.canonicalMeaning).filter((item): item is string => Boolean(item));
}

function withRole(title: string) {
  return resolveBusinessProjectContext({
    workspaceId: "business",
    organization: { context: { label: "Manufacturing Company" }, evidence: evidence("org", "ORGANIZATION", "Manufacturing") },
    managerContext: { roleLabel: title, sourceRef: Object.freeze({ authorityId: "ManagerConversation", sourceId: title }), confirmationState: "MANAGER_CONFIRMED", permissions: null, decisionAuthority: null },
  });
}

test("BCA:5 A — Operations Manager emphasizes backlog/capacity/OTD without authority", () => {
  const result = resolveManagerDecisionContext({
    context: withRole("Operations Manager"),
    concepts: situation,
    goalLabels: ["Improve Delivery"],
  });
  const named = meanings(result.relevantConceptIds);
  assert.ok(named.includes("Backlog"));
  assert.ok(named.includes("Capacity"));
  assert.ok(named.includes("On-Time Delivery"));
  assert.equal(named.includes("Gross Margin"), false);
  assert.equal(result.permissionsKnown, false);
  assert.equal(result.decisionAuthorityKnown, false);
  assert.equal(result.roleFamily, "OPERATIONS");
});

test("BCA:5 B — CFO emphasizes cost/margin without Decision authority", () => {
  const result = resolveManagerDecisionContext({ context: withRole("CFO"), concepts: situation });
  const named = meanings(result.relevantConceptIds);
  assert.ok(named.includes("Gross Margin"));
  assert.ok(named.includes("Cost"));
  assert.equal(named.includes("Backlog"), false);
  assert.equal(result.decisionAuthorityKnown, false);
  assert.equal(result.permissions, null);
});

test("BCA:5 C — CEO emphasizes goal/risk/trade-off context without a Decision", () => {
  const result = resolveManagerDecisionContext({
    context: withRole("CEO"),
    concepts: situation,
    goalLabels: ["Improve Delivery"],
  });
  assert.equal(result.roleFamily, "EXECUTIVE");
  assert.ok(result.decisionContextAreas.includes("GOAL"));
  assert.ok(result.decisionContextAreas.includes("TRADE_OFF"));
  assert.equal(result.recommendationGenerated, false);
});

test("BCA:5 D — Project Manager emphasizes schedule/milestone/cost without status or authority", () => {
  const concepts = [concept("Schedule Variance", "p", project), concept("Milestone", "p", project), concept("Project Cost", "project-source", project), concept("Resource Availability", "p", project)];
  const result = resolveManagerDecisionContext({ context: withRole("Project Manager"), concepts });
  const named = meanings(result.relevantConceptIds, concepts);
  assert.ok(named.includes("Schedule Variance"));
  assert.ok(named.includes("Milestone"));
  assert.ok(named.includes("Cost"));
  assert.doesNotMatch(JSON.stringify(result), /late|overrun|approve/i);
});

test("BCA:5 E — same evidence, different role emphasis", () => {
  const ops = resolveManagerDecisionContext({ context: withRole("Operations Manager"), concepts: situation });
  const cfo = resolveManagerDecisionContext({ context: withRole("CFO"), concepts: situation });
  const ceo = resolveManagerDecisionContext({ context: withRole("CEO"), concepts: situation, goalLabels: ["Improve Delivery"] });
  const pm = resolveManagerDecisionContext({ context: withRole("Project Manager"), concepts: situation });
  assert.notDeepEqual(ops.relevantConceptIds, cfo.relevantConceptIds);
  assert.notEqual(ops.roleFamily, ceo.roleFamily);
  assert.equal(ops.roleBasedAuthorityInferenceRejected, true);
  assert.equal(pm.mostImportantClaimed, false);
  assert.deepEqual(situation.map((item) => item.sourceRefs), situation.map((item) => item.sourceRefs));
});

test("BCA:5 F — unknown role stays usable without a fabricated title", () => {
  const result = resolveManagerDecisionContext({ context: business, concepts: situation, goalLabels: ["Improve Delivery"] });
  assert.equal(result.roleFamily, "UNKNOWN");
  assert.equal(result.rawTitle, null);
  assert.ok(result.relevantConceptIds.length > 0);
});

test("BCA:5 G — Delivery Manager remains ambiguous", () => {
  const result = resolveManagerDecisionContext({ context: withRole("Delivery Manager"), concepts: situation });
  assert.equal(result.roles[0]?.state, "AMBIGUOUS");
  assert.equal(result.roleFamily, "UNKNOWN");
  assert.ok(result.ambiguity.candidates.length > 1);
});

test("BCA:5 H — manager-confirmed operations role is consumed without a writer", () => {
  const result = resolveManagerDecisionContext({
    context: business,
    concepts: situation,
    managerConfirmedRoles: [Object.freeze({ family: "OPERATIONS", rawTitle: "I manage operations.", sourceRef: Object.freeze({ authorityId: "ManagerConversation", sourceId: "turn-1" }) })],
  });
  assert.equal(result.roleFamily, "OPERATIONS");
  assert.equal(result.confirmationState, "MANAGER_CONFIRMED");
  assert.equal(MANAGER_DECISION_CONTEXT_BOUNDARY.writesManagerConfirmation, false);
});

test("BCA:5 I — asking about gross margin does not infer CFO", () => {
  const result = resolveManagerDecisionContext({ context: business, concepts: situation, conversationInterest: "Show me gross margin." });
  assert.equal(result.roleFamily, "UNKNOWN");
  assert.ok(result.rejectedInferences.some((item) => /interest does not establish a finance role/i.test(item)));
});

test("BCA:5 J — multiple roles are preserved without permission merging", () => {
  const result = resolveManagerDecisionContext({
    context: business,
    concepts: situation,
    managerConfirmedRoles: [
      Object.freeze({ family: "GENERAL_MANAGEMENT", rawTitle: "General Manager", sourceRef: Object.freeze({ authorityId: "Profile", sourceId: "gm" }) }),
      Object.freeze({ family: "PROJECT", rawTitle: "Project Sponsor", sourceRef: Object.freeze({ authorityId: "Profile", sourceId: "sponsor" }) }),
    ],
  });
  assert.equal(result.roles.length, 2);
  assert.equal(result.permissionsKnown, false);
});

test("BCA:5 K — hybrid operations keeps business and project decision areas", () => {
  const result = resolveManagerDecisionContext({
    context: hybrid,
    concepts: [concept("Capacity", "hybrid-source", hybrid), concept("Milestone", "hybrid-source", hybrid)],
    managerConfirmedRoles: [Object.freeze({ family: "OPERATIONS", rawTitle: "Operations Manager", sourceRef: Object.freeze({ authorityId: "ManagerConversation", sourceId: "ops" }) })],
  });
  assert.ok(result.decisionContextAreas.includes("BUSINESS"));
  assert.ok(result.decisionContextAreas.includes("PROJECT"));
});

test("BCA:5 L/M — role does not infer permission or Decision authority", () => {
  const cfo = resolveManagerDecisionContext({ context: withRole("CFO"), concepts: situation });
  const ceo = resolveManagerDecisionContext({ context: withRole("CEO"), concepts: situation });
  assert.equal(cfo.permissionsKnown, false);
  assert.equal(ceo.decisionAuthorityKnown, false);
  assert.equal(cfo.roleBasedAuthorityInferenceRejected, true);
});

test("BCA:5 N/O — relevance is not importance or recommendation", () => {
  const result = resolveManagerDecisionContext({ context: withRole("Operations Manager"), concepts: situation });
  assert.equal(result.mostImportantClaimed, false);
  assert.equal(result.recommendationGenerated, false);
  assert.equal(result.attentionPriorities.length, 0);
});

test("BCA:5 P — CEO stable role is not overwritten by schedule conversation", () => {
  const result = resolveManagerDecisionContext({
    context: withRole("CEO"),
    concepts: situation.concat([concept("Schedule Variance", "p", project)]),
    currentConversationConcern: "Project schedule delay",
  });
  assert.equal(result.roleFamily, "EXECUTIVE");
  assert.ok(result.decisionContextAreas.includes("PROJECT"));
  assert.ok(result.decisionContextAreas.includes("SCHEDULE"));
  assert.equal(result.durableRoleUnchangedBySession, true);
});

test("BCA:5 Q — session finance interest does not mutate durable role", () => {
  const result = resolveManagerDecisionContext({
    context: withRole("Operations Manager"),
    concepts: situation,
    conversationInterest: "temporary finance discussion",
  });
  assert.equal(result.roleFamily, "OPERATIONS");
  assert.equal(result.durableRoleUnchangedBySession, true);
});

test("BCA:5 R — manager source refs stay isolated", () => {
  const a = resolveManagerDecisionContext({
    context: business,
    concepts: [concept("Backlog", "source-a")],
    managerConfirmedRoles: [Object.freeze({ family: "OPERATIONS", rawTitle: "Operations Manager", sourceRef: Object.freeze({ authorityId: "CompanyA", sourceId: "mgr-a", sourceContextId: "source-a" }) })],
  });
  const b = resolveManagerDecisionContext({
    context: business,
    concepts: [concept("Milestone", "source-b", project)],
    managerConfirmedRoles: [Object.freeze({ family: "PROJECT", rawTitle: "Project Manager", sourceRef: Object.freeze({ authorityId: "CompanyB", sourceId: "mgr-b", sourceContextId: "source-b" }) })],
  });
  assert.equal(a.sourceRefs.some((item) => item.sourceContextId === "source-b"), false);
  assert.equal(b.sourceRefs.some((item) => item.sourceContextId === "source-a"), false);
});

test("BCA:5 S — identical durable inputs rebuild the same frozen projection", () => {
  const relationships = resolveBusinessProjectRelationships({ context: business, concepts: situation });
  const process = resolveBusinessProjectProcessContext({ context: business, concepts: situation, relationships: relationships.relationships });
  const input = Object.freeze({
    context: withRole("Operations Manager"),
    concepts: Object.freeze(situation),
    relationships: relationships.relationships,
    processPlacements: process.placements,
    goalLabels: Object.freeze(["Improve Delivery"]),
  });
  const before = JSON.stringify(input);
  const first = resolveManagerDecisionContext(input);
  assert.deepEqual(resolveManagerDecisionContext(JSON.parse(before)), first);
  assert.equal(JSON.stringify(input), before);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(diagnoseManagerDecisionContext(first).mutatesAuthorities, false);
});

test("BCA:5 identity is separate from role and substring finance titles are not CFOs", () => {
  const result = resolveManagerDecisionContext({
    context: business,
    managerId: "mgr-alex",
    managerName: "Alex",
    rawTitles: ["Finance Transformation Project Manager"],
    concepts: situation,
  });
  assert.equal(result.managerName, "Alex");
  assert.equal(result.roleFamily, "UNKNOWN");
  assert.doesNotMatch(registrySource, /permission|approve/);
  assert.equal(MANAGER_DECISION_CONTEXT_BOUNDARY.ownsAdvisor, false);
  assert.equal(MANAGER_DECISION_CONTEXT_BOUNDARY.mutatesStage, false);
  assert.doesNotMatch(resolverSource, /createDecision|startExecution|onSelectSubject/);
  assert.equal(Object.isFrozen(MANAGER_ROLE_RELEVANCE_REGISTRY), true);
});
