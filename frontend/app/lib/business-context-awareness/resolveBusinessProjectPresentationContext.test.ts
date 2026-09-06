import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  BUSINESS_PROJECT_PRESENTATION_BOUNDARY,
  diagnoseBusinessProjectPresentationContext,
  resolveBusinessProjectConcept,
  resolveBusinessProjectContext,
  resolveBusinessProjectContextClarification,
  resolveBusinessProjectPresentationContext,
  resolveBusinessProjectProcessContext,
  resolveBusinessProjectRelationships,
  resolveManagerDecisionContext,
  type BusinessProjectSourceRef,
  type EstablishedSemanticMeaning,
} from "./index.ts";

const here = dirname(fileURLToPath(import.meta.url));
const resolverSource = readFileSync(join(here, "resolveBusinessProjectPresentationContext.ts"), "utf8");

const ref = (sourceId: string, sourceContextId: string): BusinessProjectSourceRef => Object.freeze({ authorityId: "RDI:2/CSV+DATA-ADV:2", sourceId, sourceContextId });
const semantic = (semanticId: string, meaning: string, sourceContextId: string): EstablishedSemanticMeaning => Object.freeze({ semanticId, meaning, state: "MANAGER_CONFIRMED", sourceRefs: Object.freeze([ref(semanticId, sourceContextId)]) });
const evidence = (id: string, kind: "ORGANIZATION" | "PROJECT", label: string) => Object.freeze({ evidenceId: id, kind, label, confirmationState: "AUTHORITATIVE" as const, sourceRef: Object.freeze({ authorityId: "BCA7Fixture", sourceId: id }) });
const business = resolveBusinessProjectContext({ workspaceId: "business", organization: { context: { label: "Manufacturing Company" }, evidence: evidence("org", "ORGANIZATION", "Manufacturing") } });
const project = resolveBusinessProjectContext({ workspaceId: "project", project: { context: { projectId: "warehouse", label: "Warehouse Expansion" }, evidence: evidence("project", "PROJECT", "Warehouse") } });
const hybrid = resolveBusinessProjectContext({
  workspaceId: "hybrid",
  organization: { context: { label: "Manufacturing Operations" }, evidence: evidence("org-h", "ORGANIZATION", "Manufacturing") },
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

function withRole(title: string, context = business) {
  return resolveBusinessProjectContext({
    workspaceId: context.workspaceId,
    organization: context.organizationContext ? { context: context.organizationContext, evidence: evidence("org", "ORGANIZATION", "Manufacturing") } : undefined,
    project: context.projectContext ? { context: context.projectContext, evidence: evidence("project", "PROJECT", context.projectContext.label) } : undefined,
    managerContext: { roleLabel: title, sourceRef: Object.freeze({ authorityId: "ManagerConversation", sourceId: title }), confirmationState: "MANAGER_CONFIRMED", permissions: null, decisionAuthority: null },
  });
}

function present(title: string, request: string, extra: Partial<Parameters<typeof resolveBusinessProjectPresentationContext>[0]> = {}) {
  const ctx = withRole(title, extra.context ?? business);
  const concepts = extra.concepts ?? situation;
  const manager = resolveManagerDecisionContext({ context: ctx, concepts, goalLabels: ["Improve Delivery"] });
  const relationships = resolveBusinessProjectRelationships({ context: ctx, concepts });
  const process = resolveBusinessProjectProcessContext({ context: ctx, concepts, relationships: relationships.relationships });
  const clarification = extra.clarificationNeed === undefined
    ? resolveBusinessProjectContextClarification({ context: ctx, concepts, managerDecisionContext: manager, currentRequest: request })
    : extra.clarificationNeed;
  return resolveBusinessProjectPresentationContext({
    context: ctx,
    concepts,
    relationships: relationships.relationships,
    processPlacements: process.placements,
    managerDecisionContext: manager,
    clarificationNeed: clarification,
    currentRequest: request,
    ...extra,
  });
}

test("BCA:7 A — Operations Advisor emphasizes delivery/backlog/capacity without cause or recommendation", () => {
  const presentation = present("Operations Manager", "What is happening in delivery?");
  assert.ok(presentation.advisorContext.emphasisMeanings.includes("Backlog"));
  assert.ok(presentation.advisorContext.emphasisMeanings.includes("Capacity"));
  assert.ok(presentation.advisorContext.emphasisMeanings.includes("On-Time Delivery"));
  assert.match(presentation.advisorContext.managerFacingExplanation, /fulfillment|delivery/i);
  assert.doesNotMatch(presentation.advisorContext.managerFacingExplanation, /recommend adding|BCA:|root cause/);
  assert.equal(presentation.advisorContext.processAreas.includes("FULFILLMENT") || presentation.advisorContext.processAreas.includes("DELIVERY") || presentation.advisorContext.processAreas.includes("PRODUCTION"), true);
});

test("BCA:7 B — CFO Advisor emphasizes cost/margin on the same evidence without authority", () => {
  const presentation = present("CFO", "What is happening in delivery?");
  assert.ok(presentation.advisorContext.emphasisMeanings.includes("Gross Margin") || presentation.advisorContext.emphasisMeanings.includes("Cost"));
  assert.match(presentation.advisorContext.managerFacingExplanation, /cost|margin/i);
  assert.match(presentation.advisorContext.managerFacingExplanation, /unchanged/);
  assert.equal(presentation.managerRoleContext?.permissionsKnown, false);
});

test("BCA:7 C — CEO Advisor emphasizes goal impact without new priority truth", () => {
  const presentation = present("CEO", "What is happening in delivery?");
  assert.match(presentation.advisorContext.managerFacingExplanation, /goal impact|trade-off/i);
  assert.match(presentation.advisorContext.managerFacingExplanation, /does not make any one issue the most important/i);
});

test("BCA:7 D — Project Manager Advisor uses schedule-control framing without delay claims", () => {
  const concepts = [concept("Schedule Variance", "p", project), concept("Milestone", "p", project), concept("Project Cost", "p", project), concept("Resource Availability", "p", project)];
  const presentation = present("Project Manager", "What is happening on the project?", { context: project, concepts });
  assert.match(presentation.advisorContext.managerFacingExplanation, /schedule control|milestone/i);
  assert.match(presentation.advisorContext.managerFacingExplanation, /does not by itself establish why the project is delayed/i);
});

test("BCA:7 E — same evidence, different role explanations, identical fingerprint", () => {
  const ops = present("Operations Manager", "What is happening in delivery?");
  const cfo = present("CFO", "What is happening in delivery?");
  const ceo = present("CEO", "What is happening in delivery?");
  const pm = present("Project Manager", "What is happening in delivery?");
  assert.equal(ops.underlyingEvidenceFingerprint, cfo.underlyingEvidenceFingerprint);
  assert.equal(ops.underlyingEvidenceFingerprint, ceo.underlyingEvidenceFingerprint);
  assert.notEqual(ops.advisorContext.managerFacingExplanation, cfo.advisorContext.managerFacingExplanation);
  assert.notEqual(ops.advisorContext.roleFamily, pm.advisorContext.roleFamily);
});

test("BCA:7 F — unknown role still explains Business context without forcing clarification", () => {
  const manager = resolveManagerDecisionContext({ context: business, concepts: situation });
  const clarification = resolveBusinessProjectContextClarification({ context: business, concepts: situation, managerDecisionContext: manager, currentRequest: "What does Backlog mean?" });
  const presentation = resolveBusinessProjectPresentationContext({ context: business, concepts: situation, managerDecisionContext: manager, clarificationNeed: clarification, currentRequest: "What does Backlog mean?" });
  assert.equal(presentation.advisorContext.roleFamily, "UNKNOWN");
  assert.equal(presentation.advisorContext.clarificationQuestionIntent, null);
  assert.match(presentation.advisorContext.managerFacingExplanation, /business and project context/i);
});

test("BCA:7 G — ambiguous role hands one clarification to NCA without a BCA writer", () => {
  const presentation = present("Delivery Manager", "Which operational issue matters most for my responsibility?");
  assert.equal(presentation.clarificationNeed?.clarificationNeeded, true);
  assert.equal(presentation.advisorContext.ncaOwnsWording, true);
  assert.match(presentation.advisorContext.managerFacingExplanation, /delivery operations|project delivery/i);
  assert.equal(BUSINESS_PROJECT_PRESENTATION_BOUNDARY.writesConfirmation, false);
  assert.doesNotMatch(resolverSource, /applyCsvSemanticClarification\(|saveManagerRoleConfirmation/);
});

test("BCA:7 H — hybrid capacity issue asks current vs project without merging", () => {
  const capacity = concept("Capacity", "hybrid-source", hybrid);
  const ctx = withRole("Operations Manager", hybrid);
  const manager = resolveManagerDecisionContext({ context: ctx, concepts: [capacity], managerConfirmedRoles: [Object.freeze({ family: "OPERATIONS", rawTitle: "Operations Manager", sourceRef: Object.freeze({ authorityId: "ManagerConversation", sourceId: "ops" }) })] });
  const clarification = resolveBusinessProjectContextClarification({ context: ctx, concepts: [capacity], managerDecisionContext: manager, currentRequest: "Explain our capacity issue." });
  const presentation = resolveBusinessProjectPresentationContext({ context: ctx, concepts: [capacity], managerDecisionContext: manager, clarificationNeed: clarification, currentRequest: "Explain our capacity issue." });
  assert.equal(presentation.clarificationNeed?.clarificationNeeded, true);
  assert.match(presentation.advisorContext.managerFacingExplanation, /current operating capacity|expansion project|planned through the project/i);
  assert.equal(presentation.contextKind, "HYBRID");
});

test("BCA:7 I — Backlog object explanation uses process, relevance, and qualified relationship", () => {
  const presentation = present("Operations Manager", "Explain this Backlog object.", { selectedConceptMeaning: "Backlog" });
  assert.match(presentation.advisorContext.managerFacingExplanation, /fulfillment|production/i);
  assert.match(presentation.advisorContext.managerFacingExplanation, /potentially related|cause has not been established/i);
});

test("BCA:7 J — why are you showing Capacity has role context and no root cause", () => {
  const presentation = present("Operations Manager", "Why are you showing me Capacity?");
  assert.match(presentation.advisorContext.managerFacingExplanation, /delivery context|operations role/i);
  assert.match(presentation.advisorContext.managerFacingExplanation, /does not mean it is the root cause/i);
});

test("BCA:7 K/L — CFO relevance does not add Stage objects or change focus", () => {
  const presentation = present("CFO", "What is happening in delivery?", { focusedStageObjectLabel: "Backlog", authoritativeStageObjectLabels: ["Backlog"] });
  assert.deepEqual(presentation.stageContext.objectsAdded, []);
  assert.equal(presentation.stageContext.focusMutatedTo, null);
  assert.equal(presentation.directorContext.mutatesStageMembership, false);
  assert.equal(presentation.directorContext.mutatesStageFocus, false);
});

test("BCA:7 M/N/O — Theatre hints never change size, color, or causal visuals", () => {
  const presentation = present("Operations Manager", "What is happening in delivery?");
  assert.equal(presentation.theatreContext.sizeUnchanged, true);
  assert.equal(presentation.theatreContext.colorUnchanged, true);
  assert.equal(presentation.theatreContext.causalVisualRejected, true);
  assert.ok(presentation.advisorContext.relationshipQualifiers.some((item) => /potentially related/i.test(item)));
});

test("BCA:7 P/Q/R — comparison, commitment, and Execution stay untouched", () => {
  const presentation = present("CEO", "What is happening in delivery?");
  assert.equal(presentation.theatreContext.scoresScenarios, false);
  assert.equal(presentation.theatreContext.commitsDecision, false);
  assert.equal(presentation.theatreContext.startsExecution, false);
  assert.equal(presentation.managerRoleContext?.decisionAuthorityKnown, false);
});

test("BCA:7 S — outcome explanation is role-aware without causal attribution", () => {
  const ops = present("Operations Manager", "Delivery improved relative to baseline.");
  const cfo = present("CFO", "Delivery improved relative to baseline.");
  assert.match(ops.advisorContext.managerFacingExplanation, /cannot yet attribute/i);
  assert.match(cfo.advisorContext.managerFacingExplanation, /margin effect is not established/i);
});

test("BCA:7 T/U — source and project isolation stay on sourceRefs", () => {
  const a = resolveBusinessProjectPresentationContext({ context: business, concepts: [concept("Backlog", "source-a")], currentRequest: "What is happening in delivery?" });
  const b = resolveBusinessProjectPresentationContext({ context: project, concepts: [concept("Milestone", "source-b", project)], currentRequest: "What is happening on the project?" });
  assert.equal(a.sourceRefs.some((item) => item.sourceContextId === "source-b"), false);
  assert.equal(b.sourceRefs.some((item) => item.sourceContextId === "source-a"), false);
});

test("BCA:7 V — forecast capacity is not presented as current", () => {
  const presentation = present("Operations Manager", "What is happening with capacity?", { temporalStatus: "FORECAST" });
  assert.match(presentation.advisorContext.managerFacingExplanation, /forecast/i);
  assert.doesNotMatch(presentation.advisorContext.managerFacingExplanation, /current operating capacity is/);
});

test("BCA:7 W — general process relevance is not current failure", () => {
  const presentation = present("Operations Manager", "What is happening in delivery?");
  assert.doesNotMatch(presentation.advisorContext.managerFacingExplanation, /fulfillment process is failing/);
  assert.ok(situation.every((item) => item.currentReality === "NOT_ESTABLISHED"));
});

test("BCA:7 X — confirmed clarification is not asked again", () => {
  const capacity = concept("Capacity", "hybrid-source", hybrid);
  const ctx = withRole("Operations Manager", hybrid);
  const manager = resolveManagerDecisionContext({ context: ctx, concepts: [capacity], managerConfirmedRoles: [Object.freeze({ family: "OPERATIONS", rawTitle: "Operations Manager", sourceRef: Object.freeze({ authorityId: "ManagerConversation", sourceId: "ops" }) })] });
  const clarification = resolveBusinessProjectContextClarification({
    context: ctx,
    concepts: [capacity],
    managerDecisionContext: manager,
    currentRequest: "Explain our capacity issue.",
    existingConfirmations: [Object.freeze({ clarificationKey: "SCOPE:HYBRID_SCOPE_AMBIGUITY:Capacity", confirmationState: "MANAGER_CONFIRMED", interpretation: "CURRENT_OPERATIONS" })],
  });
  const presentation = resolveBusinessProjectPresentationContext({ context: ctx, concepts: [capacity], managerDecisionContext: manager, clarificationNeed: clarification, currentRequest: "Explain our capacity issue." });
  assert.equal(presentation.advisorContext.clarificationQuestionIntent, null);
});

test("BCA:7 Y — identical durable inputs rebuild the same frozen projection", () => {
  const ctx = withRole("Operations Manager");
  const relationships = resolveBusinessProjectRelationships({ context: ctx, concepts: situation });
  const process = resolveBusinessProjectProcessContext({ context: ctx, concepts: situation, relationships: relationships.relationships });
  const manager = resolveManagerDecisionContext({ context: ctx, concepts: situation, goalLabels: ["Improve Delivery"] });
  const clarification = resolveBusinessProjectContextClarification({ context: ctx, concepts: situation, managerDecisionContext: manager, currentRequest: "What is happening in delivery?" });
  const input = Object.freeze({
    context: ctx,
    concepts: Object.freeze(situation),
    relationships: relationships.relationships,
    processPlacements: process.placements,
    managerDecisionContext: manager,
    clarificationNeed: clarification,
    currentRequest: "What is happening in delivery?",
  });
  const before = JSON.stringify(input);
  const first = resolveBusinessProjectPresentationContext(input);
  assert.deepEqual(resolveBusinessProjectPresentationContext(JSON.parse(before)), first);
  assert.equal(JSON.stringify(input), before);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(diagnoseBusinessProjectPresentationContext(first).mutatesAuthorities, false);
  assert.equal(BUSINESS_PROJECT_PRESENTATION_BOUNDARY.ownsAdvisor, false);
  assert.doesNotMatch(resolverSource, /createDecision|startExecution|onSelectSubject|commitPreparedCsvRealDataImport/);
});
