import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  BUSINESS_PROJECT_CONTEXT_CLARIFICATION_BOUNDARY,
  diagnoseBusinessProjectContextClarification,
  resolveBusinessProjectConcept,
  resolveBusinessProjectContext,
  resolveBusinessProjectContextClarification,
  resolveBusinessProjectProcessContext,
  resolveBusinessProjectRelationships,
  resolveManagerDecisionContext,
  type BusinessProjectSourceRef,
  type EstablishedSemanticMeaning,
} from "./index.ts";

const here = dirname(fileURLToPath(import.meta.url));
const resolverSource = readFileSync(join(here, "resolveBusinessProjectContextClarification.ts"), "utf8");

const ref = (sourceId: string, sourceContextId: string): BusinessProjectSourceRef => Object.freeze({ authorityId: "RDI:2/CSV+DATA-ADV:2", sourceId, sourceContextId });
const semantic = (semanticId: string, meaning: string, sourceContextId: string): EstablishedSemanticMeaning => Object.freeze({ semanticId, meaning, state: "MANAGER_CONFIRMED", sourceRefs: Object.freeze([ref(semanticId, sourceContextId)]) });
const evidence = (id: string, kind: "ORGANIZATION" | "PROJECT", label: string) => Object.freeze({ evidenceId: id, kind, label, confirmationState: "AUTHORITATIVE" as const, sourceRef: Object.freeze({ authorityId: "BCA6Fixture", sourceId: id }) });
const business = resolveBusinessProjectContext({ workspaceId: "business", organization: { context: { label: "Manufacturing Company" }, evidence: evidence("org", "ORGANIZATION", "Manufacturing") } });
const hybrid = resolveBusinessProjectContext({
  workspaceId: "hybrid",
  organization: { context: { label: "Manufacturing Operations" }, evidence: evidence("org-h", "ORGANIZATION", "Manufacturing") },
  project: { context: { projectId: "line", label: "Production Line Expansion" }, evidence: evidence("project-h", "PROJECT", "Line") },
});

function concept(meaning: string, sourceContextId: string, context = business) {
  return resolveBusinessProjectConcept({ semantic: semantic(meaning.toLowerCase().replace(/\s+/g, "-"), meaning, sourceContextId), context });
}

function withRole(title: string, context = business) {
  return resolveBusinessProjectContext({
    workspaceId: context.workspaceId,
    organization: context.organizationContext ? { context: context.organizationContext, evidence: evidence("org", "ORGANIZATION", "Manufacturing") } : undefined,
    project: context.projectContext ? { context: context.projectContext, evidence: evidence("project", "PROJECT", context.projectContext.label) } : undefined,
    managerContext: { roleLabel: title, sourceRef: Object.freeze({ authorityId: "ManagerConversation", sourceId: title }), confirmationState: "MANAGER_CONFIRMED", permissions: null, decisionAuthority: null },
  });
}

function manager(title: string, context = business, extraConcepts: ReturnType<typeof concept>[] = []) {
  const ctx = withRole(title, context);
  const concepts = extraConcepts.length ? extraConcepts : [concept("Gross Margin", "source-a", ctx), concept("Backlog", "source-a", ctx), concept("Capacity", "source-a", ctx)];
  return resolveManagerDecisionContext({ context: ctx, concepts, rawTitles: [title] });
}

test("BCA:6 A — Delivery Manager responsibility task needs role clarification without choosing Operations", () => {
  const ctx = withRole("Delivery Manager");
  const decision = manager("Delivery Manager", ctx);
  const need = resolveBusinessProjectContextClarification({
    context: ctx,
    concepts: [concept("Backlog", "source-a", ctx)],
    managerDecisionContext: decision,
    currentRequest: "Which operational issue matters most for my responsibility?",
  });
  assert.equal(need.clarificationNeeded, true);
  assert.equal(need.ambiguityType, "ROLE_AMBIGUITY");
  assert.equal(need.roleClarificationNeeded, true);
  assert.equal(need.candidateInterpretations.some((item) => item.id === "OPERATIONS"), true);
  assert.equal(need.currentInterpretation, null);
  assert.equal(decision.roleFamily, "UNKNOWN");
  assert.match(need.clarificationQuestionIntent ?? "", /delivery operations|project delivery/i);
  assert.doesNotMatch(need.clarificationQuestionIntent ?? "", /BCA|NCA|sourceRef/);
});

test("BCA:6 B — same ambiguous role does not block a meaning question", () => {
  const ctx = withRole("Delivery Manager");
  const need = resolveBusinessProjectContextClarification({
    context: ctx,
    concepts: [concept("Gross Margin", "source-a", ctx)],
    managerDecisionContext: manager("Delivery Manager", ctx),
    currentRequest: "What does Gross Margin mean?",
  });
  assert.equal(need.roleClarificationNeeded, false);
  assert.equal(need.canProceedWithoutClarification, true);
  assert.equal(need.clarificationNeeded, false);
});

test("BCA:6 C — hybrid Capacity issue needs current vs project clarification", () => {
  const capacity = concept("Capacity", "hybrid-source", hybrid);
  const need = resolveBusinessProjectContextClarification({
    context: hybrid,
    concepts: [capacity],
    currentRequest: "Explain our capacity issue.",
  });
  assert.equal(need.clarificationNeeded, true);
  assert.equal(need.ambiguityType, "HYBRID_SCOPE_AMBIGUITY");
  assert.ok(need.candidateInterpretations.some((item) => item.id === "CURRENT_OPERATIONS"));
  assert.ok(need.candidateInterpretations.some((item) => item.id === "PLANNED_PROJECT"));
  assert.equal(need.canProceedWithoutClarification, false);
});

test("BCA:6 D/R — confirmed capacity scope is not asked again", () => {
  const capacity = concept("Capacity", "hybrid-source", hybrid);
  const need = resolveBusinessProjectContextClarification({
    context: hybrid,
    concepts: [capacity],
    currentRequest: "Explain our capacity issue.",
    existingConfirmations: [Object.freeze({ clarificationKey: "SCOPE:HYBRID_SCOPE_AMBIGUITY:Capacity", confirmationState: "MANAGER_CONFIRMED", interpretation: "CURRENT_OPERATIONS" })],
  });
  assert.equal(need.clarificationNeeded, false);
  assert.equal(diagnoseBusinessProjectContextClarification(need, {
    context: hybrid,
    concepts: [capacity],
    currentRequest: "Explain our capacity issue.",
    existingConfirmations: [Object.freeze({ clarificationKey: "SCOPE:HYBRID_SCOPE_AMBIGUITY:Capacity", confirmationState: "MANAGER_CONFIRMED" as const })],
  }).alreadyConfirmed, true);
});

test("BCA:6 E — unknown process placement is clarified without substring guessing", () => {
  const need = resolveBusinessProjectContextClarification({
    context: business,
    concepts: [concept("Quality", "source-a")],
    unknownProcessMeanings: ["Custom Engineering Load"],
    currentRequest: "Where is Custom Engineering Load used in the organization's work?",
  });
  assert.equal(need.clarificationNeeded, true);
  assert.equal(need.ambiguityType, "PROCESS_PLACEMENT_AMBIGUITY");
  assert.doesNotMatch(resolverSource, /engineering load.*PRODUCTION|includes\(\"Engineering\"\)/);
});

test("BCA:6 F — known meaning does not require process clarification", () => {
  const need = resolveBusinessProjectContextClarification({
    context: business,
    concepts: [concept("Quality", "source-a")],
    unknownProcessMeanings: ["Custom Engineering Load"],
    currentRequest: "What does Custom Engineering Load mean?",
  });
  assert.equal(need.clarificationNeeded, false);
});

test("BCA:6 G — correction is consumed from the existing writer, not a BCA write", () => {
  const machine = concept("Capacity", "source-a");
  const corrected = resolveBusinessProjectConcept({
    semantic: semantic("capacity", "Capacity", "source-a"),
    context: business,
    organizationSpecificMeaning: Object.freeze({ meaning: "staff capacity", confirmationState: "MANAGER_CONFIRMED", sourceRef: ref("capacity", "source-a") }),
  });
  const need = resolveBusinessProjectContextClarification({
    context: business,
    concepts: [corrected],
    currentRequest: "What does Capacity mean?",
    existingConfirmations: [Object.freeze({ clarificationKey: "CONCEPT_MEANING:Capacity", confirmationState: "MANAGER_CONFIRMED", interpretation: "staff capacity", sourceContextId: "source-a" })],
  });
  assert.equal(need.writesConfirmation, false);
  assert.equal(need.clarificationNeeded, false);
  assert.equal(corrected.organizationSpecificMeaning?.meaning, "staff capacity");
  assert.ok(machine.generalMeaning);
  assert.doesNotMatch(resolverSource, /function confirmBca|saveManagerRoleConfirmation|applyBusinessContextClarification|applyCsvSemanticClarification\(/);
});

test("BCA:6 H — I don't know is not fabricated and is not immediately re-asked", () => {
  const ctx = withRole("Delivery Manager");
  const need = resolveBusinessProjectContextClarification({
    context: ctx,
    concepts: [concept("Backlog", "source-a", ctx)],
    managerDecisionContext: manager("Delivery Manager", ctx),
    currentRequest: "Which operational issue matters most for my responsibility?",
    existingConfirmations: [Object.freeze({ clarificationKey: "MANAGER_ROLE:ROLE_AMBIGUITY", confirmationState: "DECLINED" })],
  });
  assert.equal(need.clarificationNeeded, false);
  assert.equal(need.declinedOrUnknown, true);
  assert.equal(need.canProceedWithoutClarification, true);
  assert.equal(need.confirmationState, "DECLINED");
});

test("BCA:6 I — organization-specific backlog placement confirmation is used without deleting general knowledge", () => {
  const backlog = concept("Backlog", "source-a");
  const process = resolveBusinessProjectProcessContext({
    context: business,
    concepts: [backlog],
    managerConfirmedProcessContexts: [Object.freeze({ conceptMeaning: "Backlog", processAreas: ["PLANNING", "PRODUCTION"], confirmationState: "MANAGER_CONFIRMED" as const, sourceRef: ref("backlog-org", "source-a"), scope: "ORGANIZATION" as const, stance: "AFFIRMS" as const })],
  });
  const need = resolveBusinessProjectContextClarification({
    context: business,
    concepts: [backlog],
    processPlacements: process.placements,
    currentRequest: "Where does backlog belong in the organization's work?",
    existingConfirmations: [Object.freeze({ clarificationKey: "ORGANIZATION_SPECIFIC_MEANING:Backlog", confirmationState: "MANAGER_CONFIRMED", interpretation: "PRODUCTION_PLANNING" })],
  });
  assert.equal(need.clarificationNeeded, false);
  assert.ok(process.placements.some((item) => item.scope === "ORGANIZATION" || item.processAreas.includes("PRODUCTION")));
});

test("BCA:6 J — confirming CFO does not set permission or Decision authority", () => {
  const ctx = withRole("CFO");
  const decision = resolveManagerDecisionContext({ context: ctx, concepts: [concept("Gross Margin", "source-a", ctx)] });
  const need = resolveBusinessProjectContextClarification({
    context: ctx,
    concepts: [concept("Gross Margin", "source-a", ctx)],
    managerDecisionContext: decision,
    currentRequest: "What does Gross Margin mean?",
  });
  assert.equal(decision.permissionsKnown, false);
  assert.equal(decision.decisionAuthorityKnown, false);
  assert.equal(need.permissionsInferred, false);
});

test("BCA:6 K — meaning confirmation does not establish current backlog reality", () => {
  const backlog = concept("Backlog", "source-a");
  const need = resolveBusinessProjectContextClarification({
    context: business,
    concepts: [backlog],
    currentRequest: "What does Backlog mean?",
    existingConfirmations: [Object.freeze({ clarificationKey: "CONCEPT_MEANING:Backlog", confirmationState: "MANAGER_CONFIRMED", interpretation: "Backlog Level", sourceContextId: "source-a" })],
  });
  assert.equal(backlog.currentReality, "NOT_ESTABLISHED");
  assert.equal(need.currentRealityInferred, false);
});

test("BCA:6 L — relationship clarification does not presuppose causality", () => {
  const concepts = [concept("Backlog", "source-a"), concept("Capacity", "source-a")];
  const relationships = resolveBusinessProjectRelationships({ context: business, concepts });
  const need = resolveBusinessProjectContextClarification({
    context: business,
    concepts,
    relationships: relationships.relationships,
    currentRequest: "Are backlog and capacity connected?",
  });
  assert.equal(need.clarificationNeeded, false);
  assert.doesNotMatch(JSON.stringify(need), /CAUSES|causing/);
  assert.ok(need.rejectedInferences.some((item) => /causality/i.test(item)));
  assert.ok(relationships.relationships.some((item) => item.kind === "POTENTIALLY_RELATED_TO"));
});

test("BCA:6 M — a capacity figure without time scope needs temporal clarification", () => {
  const need = resolveBusinessProjectContextClarification({
    context: business,
    concepts: [concept("Capacity", "source-a")],
    currentRequest: "What is the current capacity state?",
    statedMeasurements: [Object.freeze({ conceptMeaning: "Capacity", value: "80%", temporalStatus: null })],
  });
  assert.equal(need.clarificationNeeded, true);
  assert.equal(need.ambiguityType, "TEMPORAL_AMBIGUITY");
  assert.doesNotMatch(need.clarificationQuestionIntent ?? "", /assume it is current/i);
});

test("BCA:6 N — source A confirmation does not transfer to source B", () => {
  const a = concept("Backlog", "source-a");
  const b = concept("Backlog", "source-b");
  const needB = resolveBusinessProjectContextClarification({
    context: business,
    concepts: [b],
    currentRequest: "What does Backlog mean?",
    existingConfirmations: [Object.freeze({ clarificationKey: "CONCEPT_MEANING:Backlog", confirmationState: "MANAGER_CONFIRMED", interpretation: "Backlog Level", sourceContextId: "source-a" })],
  });
  assert.equal(needB.sourceRefs.some((item) => item.sourceContextId === "source-a"), false);
  assert.equal(a.sourceRefs[0]?.sourceContextId, "source-a");
  assert.equal(needB.rejectedInferences.some((item) => /transfer across sources/i.test(item)), true);
});

test("BCA:6 O — project A capacity meaning does not leak to project B", () => {
  const projectB = resolveBusinessProjectContext({ workspaceId: "p-b", project: { context: { projectId: "project-b", label: "Other Expansion" }, evidence: evidence("project-b", "PROJECT", "B") } });
  const need = resolveBusinessProjectContextClarification({
    context: projectB,
    concepts: [concept("Capacity", "project-b", projectB)],
    currentRequest: "What does Capacity mean?",
    existingConfirmations: [Object.freeze({ clarificationKey: "CONCEPT_MEANING:Capacity", confirmationState: "MANAGER_CONFIRMED", interpretation: "engineering-hours", projectId: "line" })],
  });
  assert.equal(need.sourceRefs.some((item) => item.sourceId === "project-h"), false);
  assert.ok(need.rejectedInferences.some((item) => /transfer across projects/i.test(item)));
});

test("BCA:6 P — current sponsor perspective does not delete stable roles", () => {
  const decision = resolveManagerDecisionContext({
    context: business,
    concepts: [concept("Milestone", "p")],
    managerConfirmedRoles: [
      Object.freeze({ family: "GENERAL_MANAGEMENT", rawTitle: "General Manager", sourceRef: Object.freeze({ authorityId: "Profile", sourceId: "gm" }) }),
      Object.freeze({ family: "PROJECT", rawTitle: "Project Sponsor", sourceRef: Object.freeze({ authorityId: "Profile", sourceId: "sponsor" }) }),
    ],
  });
  const need = resolveBusinessProjectContextClarification({
    context: business,
    concepts: [concept("Milestone", "p")],
    managerDecisionContext: decision,
    currentRequest: "For this issue, I'm acting as Project Sponsor.",
    currentRolePerspective: "PROJECT",
  });
  assert.equal(decision.roles.length, 2);
  assert.equal(need.stableRolesPreserved, true);
  assert.equal(need.currentRolePerspective, "PROJECT");
});

test("BCA:6 Q — one primary clarification when several ambiguities exist", () => {
  const ctx = withRole("Delivery Manager", hybrid);
  const capacity = concept("Capacity", "hybrid-source", hybrid);
  const need = resolveBusinessProjectContextClarification({
    context: ctx,
    concepts: [capacity],
    managerDecisionContext: manager("Delivery Manager", ctx, [capacity]),
    unknownProcessMeanings: ["Custom Engineering Load"],
    currentRequest: "Explain our capacity issue.",
  });
  assert.equal(need.clarificationNeeded, true);
  assert.equal(need.ambiguityType, "HYBRID_SCOPE_AMBIGUITY");
  assert.equal(need.subjectKind, "SCOPE");
});

test("BCA:6 S/T/U — confirmation never commits Decision, Execution, Stage, or Theatre", () => {
  const need = resolveBusinessProjectContextClarification({
    context: business,
    concepts: [concept("Capacity", "source-a")],
    currentRequest: "What does Capacity mean?",
  });
  assert.equal(need.decisionCommitted, false);
  assert.equal(need.executionMutated, false);
  assert.equal(need.stageMutated, false);
  assert.equal(need.theatreMutated, false);
  assert.equal(need.decisionImpact, null);
  assert.equal(BUSINESS_PROJECT_CONTEXT_CLARIFICATION_BOUNDARY.commitsDecision, false);
  assert.equal(BUSINESS_PROJECT_CONTEXT_CLARIFICATION_BOUNDARY.ownsNca, false);
});

test("BCA:6 V — identical durable inputs rebuild the same frozen projection", () => {
  const ctx = withRole("Delivery Manager");
  const concepts = Object.freeze([concept("Backlog", "source-a", ctx)]);
  const input = Object.freeze({
    context: ctx,
    concepts,
    managerDecisionContext: manager("Delivery Manager", ctx),
    currentRequest: "Which operational issue matters most for my responsibility?",
  });
  const before = JSON.stringify(input);
  const first = resolveBusinessProjectContextClarification(input);
  assert.deepEqual(resolveBusinessProjectContextClarification(JSON.parse(before)), first);
  assert.equal(JSON.stringify(input), before);
  assert.equal(Object.isFrozen(first), true);
  assert.equal(diagnoseBusinessProjectContextClarification(first, input).bcaWriteAttempted, false);
  assert.equal(diagnoseBusinessProjectContextClarification(first, input).mutatesAuthorities, false);
});

test("BCA:6 writer boundary names the existing confirmation authorities only", () => {
  assert.equal(BUSINESS_PROJECT_CONTEXT_CLARIFICATION_BOUNDARY.confirmationWriterSemantic, "applyCsvSemanticClarification");
  assert.equal(BUSINESS_PROJECT_CONTEXT_CLARIFICATION_BOUNDARY.confirmationWriterContextual, "ManagerConversation");
  assert.equal(BUSINESS_PROJECT_CONTEXT_CLARIFICATION_BOUNDARY.writesManagerConfirmation, false);
  assert.doesNotMatch(resolverSource, /createDecision|startExecution|onSelectSubject|commitPreparedCsvRealDataImport/);
});
