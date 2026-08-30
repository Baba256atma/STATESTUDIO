/**
 * DTH:6 — Object Investigation Experience tests.
 * Presentation only. Does not replace DTH:1–5, Stage, Director, or Advisor tests.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import {
  applyDirectorPlanToStage,
  directNexoraPresentation,
} from "@/app/lib/director/nexoraSemanticPresentationDirector.ts";
import { composeNexoraSemanticTurn } from "@/app/lib/manager-object/nexoraNcaPost3SemanticScopeMultiEntityCanonicalCollectionWorkspaceIntelligence.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  resetNexoraMVPObjectInteractionOverview,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  NEXORA_DECISION_THEATRE_DTH2_MISSING_EVIDENCE,
  NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES,
  NEXORA_DECISION_THEATRE_DTH2_UNSUPPORTED_ZERO_COST,
} from "./nexoraDecisionTheatreIconicFixtures.ts";
import {
  emptyNexoraDecisionTheatreSceneSemanticInput,
  evaluateNexoraDecisionTheatreInvariants,
  inspectNexoraDecisionTheatreProjection,
  NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY,
  NEXORA_DECISION_THEATRE_INVESTIGATION_ACTIONS,
  NEXORA_DECISION_THEATRE_INVESTIGATION_LEVELS,
  NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES,
  NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES,
  nexoraDecisionTheatreObjectInvestigationIdentity,
  projectNexoraDecisionTheatreFoundation,
  projectNexoraDecisionTheatreObjectInvestigation,
} from "./nexoraDecisionTheatrePublicIndex.ts";
import { managerRelationLanguage } from "./nexoraDecisionTheatreObjectInvestigationRegistry.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectDefaultNexoraMvpConversationalSubjects();

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function project(
  state = initial(),
  extra?: Omit<Parameters<typeof projectNexoraDecisionTheatreFoundation>[0], "stageState" | "catalog">,
) {
  return projectNexoraDecisionTheatreFoundation({ stageState: state, catalog, ...extra });
}

function runConversation(utterance: string, state = initial()) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: Object.freeze({
      currentSubjectId: state.focusedSubject?.id ?? null,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: state.workspace,
    }),
    executiveSubjects: subjects,
    runtimeState: state,
    catalog,
    messageIdSeed: `dth6-${utterance}`,
  });
}

function collectionStage(utterance: string, state = initial()) {
  const semantic = composeNexoraSemanticTurn({ utterance, catalog });
  const raw = semantic.diagnostics.collectionKind?.toLowerCase() ?? null;
  const kind =
    raw === "problem" || raw === "risk" || raw === "opportunity" ||
    raw === "scenario" || raw === "decision" || raw === "execution" || raw === "goal"
      ? raw
      : null;
  const plan = directNexoraPresentation({
    owner: semantic.owner,
    presentationRequest: "COLLECTION",
    primaryReference: semantic.references.primary,
    references: semantic.references.references,
    collectionKind: kind,
    collectionScope: semantic.diagnostics.collectionScope,
    collectionMembers: semantic.canonicalCollectionMembers,
    currentStage: state,
  });
  return applyDirectorPlanToStage({ plan, state, catalog });
}

test("DTH:6 contract, capability, immutability, and stable investigation ids", () => {
  assert.equal(nexoraDecisionTheatreObjectInvestigationIdentity, "DTH:6/ObjectInvestigation");
  assert.deepEqual([...NEXORA_DECISION_THEATRE_INVESTIGATION_LEVELS], ["glance", "understand", "investigate"]);
  assert.equal(NEXORA_DECISION_THEATRE_INVESTIGATION_ACTIONS.includes("RETURN_TO_SCENE"), true);
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("object-investigation"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("decision-comparison"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("decision-commitment"));
  assert.equal(NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES.length, 7);
  assert.equal(
    (NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES as readonly string[]).includes("object-investigation"),
    false,
  );
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.objectInvestigationImplemented, true);
  const empty = project();
  assert.equal(empty.objectInvestigation, null);
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  const first = project(focused);
  const second = project(focused);
  assert.equal(first.objectInvestigation?.investigationId, second.objectInvestigation?.investigationId);
  assert.match(first.objectInvestigation?.investigationId ?? "", /^dth6-investigation:/);
  assert.equal(Object.isFrozen(first.objectInvestigation), true);
  assert.equal(evaluateNexoraDecisionTheatreInvariants(first).ok, true);
  assert.doesNotMatch(JSON.stringify(first.advisorReadable.investigation), /NCA|DIR:1|Scene Script ID|canonical entity/);
});

test("A: opening investigation does not destroy the Scene", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  const before = JSON.stringify(focused);
  const theatre = project(focused, { investigationLevel: "investigate" });
  assert.equal(JSON.stringify(focused), before);
  assert.equal(theatre.primaryExecutiveObjectId, "ctx-problem-margin");
  assert.equal(theatre.sceneIntent.intentKind, theatre.objectInvestigation?.sceneIntentKind);
  assert.equal(theatre.sceneScript.scriptId, theatre.objectInvestigation?.sceneScriptId);
  const closed = projectNexoraDecisionTheatreObjectInvestigation({ theatre, level: "glance" });
  assert.equal(JSON.stringify(focused), before);
  assert.equal(closed?.objectId, "ctx-problem-margin");
});

test("B: objects without evidence do not receive synthetic evidence", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  const theatre = project(focused, {
    iconicAuthoritativeSources: [NEXORA_DECISION_THEATRE_DTH2_MISSING_EVIDENCE],
  });
  const investigation = theatre.objectInvestigation;
  assert.ok(investigation);
  assert.equal(investigation.actions.find((item) => item.action === "SHOW_EVIDENCE")?.available, false);
  assert.match(investigation.advisorReadable.evidence, /does not yet have enough evidence/i);
  assert.equal(investigation.evidence.some((item) => item.epistemicStatus === "known" && /invented|synthetic/i.test(item.label)), false);
});

test("C: association remains association", () => {
  assert.equal(managerRelationLanguage("causes"), "associated with");
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  const theatre = project(focused);
  for (const item of theatre.objectInvestigation?.relationships ?? []) {
    assert.equal(item.causalStatus, "unsupported");
    assert.notEqual(item.relation, "causes");
  }
});

test("D: a singleton Scenario never becomes a fake comparison", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog);
  const theatre = project(focused, {
    sceneSemanticInput: emptyNexoraDecisionTheatreSceneSemanticInput({
      canonicalSemanticResultRef: "singleton-scenario",
      canonicalOperation: "COMPARE",
      comparison: Object.freeze({
        active: true,
        memberIds: Object.freeze(["ctx-scenario-pricing"]),
        criterion: "COST",
        criterionAmbiguous: false,
        criterionResolution: null,
      }),
    }),
  });
  assert.equal(theatre.objectInvestigation?.comparisonPreserved, false);
  assert.equal(theatre.objectInvestigation?.actions.find((item) => item.action === "COMPARE_RELATED")?.available, false);
  assert.equal(theatre.objectInvestigation?.advisorReadable.comparison, null);
});

test("E: Explain this does not mutate Stage", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  const before = JSON.stringify(focused);
  const result = runConversation("Explain this.", focused);
  assert.equal(JSON.stringify(result.nextRuntimeState), before);
  assert.equal(result.decisionTheatre?.writes.decisionState, false);
  assert.equal(result.decisionTheatre?.objectInvestigation?.derivationMetadata.mutatedStage, false);
});

test("F: Advisor explain-this follows the later selected object", () => {
  const first = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  const second = selectNexoraMVPInteractionSubject(first, "ctx-scenario-pricing", catalog);
  const result = runConversation("Explain this.", second);
  assert.equal(result.decisionTheatre?.objectInvestigation?.objectId, "ctx-scenario-pricing");
  assert.equal(result.decisionTheatre?.objectInvestigation?.canonicalObjectType, "scenario");
  assert.equal(result.decisionTheatre?.primaryExecutiveObjectId, "ctx-scenario-pricing");
  assert.doesNotMatch(result.decisionTheatre?.objectInvestigation?.managerReadableName ?? "", /Margin Pressure/i);
  assert.doesNotMatch(result.response, /Margin Pressure/i);
});

test("G: investigating Scenario A preserves Scenario A/B comparison members", () => {
  const two = ["ctx-scenario-pricing", "ctx-scenario-demand"] as const;
  const stage = collectionStage("show scenarios");
  const focused = selectNexoraMVPInteractionSubject(stage, "ctx-scenario-pricing", catalog);
  const theatre = project(focused, {
    sceneSemanticInput: emptyNexoraDecisionTheatreSceneSemanticInput({
      canonicalSemanticResultRef: "compare-scenarios",
      canonicalOperation: "COMPARE",
      conversationIntentKind: "compare-scenarios",
      comparison: Object.freeze({
        active: true,
        memberIds: Object.freeze([...two]),
        criterion: "COST",
        criterionAmbiguous: false,
        criterionResolution: null,
      }),
    }),
  });
  assert.equal(theatre.sceneIntent.intentKind, "COMPARE_CANDIDATES");
  assert.equal(theatre.objectInvestigation?.objectId, "ctx-scenario-pricing");
  assert.equal(theatre.objectInvestigation?.comparisonPreserved, true);
  assert.deepEqual([...theatre.objectInvestigation!.comparisonMemberIds], [...two]);
  const compared = runConversation("Compare it with the other one.", focused);
  assert.equal(compared.nextRuntimeState.focusedSubject?.id, "ctx-scenario-pricing");
  assert.notEqual(compared.decisionTheatre?.sceneIntent.comparisonMembers.length, 1);
});

test("H: missing cost and history stay unknown rather than zero", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  const none = project(focused);
  assert.equal(none.objectInvestigation?.cost, null);
  assert.equal(none.objectInvestigation?.time, null);
  assert.equal(none.objectInvestigation?.temporal, null);
  assert.equal(none.objectInvestigation?.actions.find((item) => item.action === "SHOW_HISTORY")?.available, false);
  const scenario = selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-capacity", catalog);
  const missing = project(scenario, {
    iconicAuthoritativeSources: [NEXORA_DECISION_THEATRE_DTH2_UNSUPPORTED_ZERO_COST],
  });
  const cost = missing.objectInvestigation?.cost;
  assert.ok(cost === null || cost === "unavailable" || cost === "unknown");
  assert.notEqual(cost, "0");
  assert.notEqual(cost, "0 USD");
});

test("I: close/reopen composition stays deterministic and Scene-preserving", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  const before = JSON.stringify(focused);
  const opened = project(focused, { investigationLevel: "understand" });
  const reopened = project(focused, { investigationLevel: "understand" });
  assert.equal(opened.objectInvestigation?.investigationId, reopened.objectInvestigation?.investigationId);
  const overview = resetNexoraMVPObjectInteractionOverview(focused);
  assert.equal(project(overview).objectInvestigation, null);
  const again = selectNexoraMVPInteractionSubject(overview, "ctx-problem-margin", catalog);
  assert.equal(JSON.stringify(focused.collectionContext), JSON.stringify(again.collectionContext));
  assert.equal(JSON.stringify(focused) === before, true);
});

test("J: object-type investigation stays type-correct", () => {
  const problem = project(selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog));
  const scenario = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog));
  const decision = project(selectNexoraMVPInteractionSubject(initial(), "ctx-decision-capacity", catalog));
  const execution = project(selectNexoraMVPInteractionSubject(initial(), "ctx-execution-capacity", catalog));
  assert.equal(problem.objectInvestigation?.canonicalObjectType, "problem");
  assert.equal(scenario.objectInvestigation?.canonicalObjectType, "scenario");
  assert.equal(decision.objectInvestigation?.canonicalObjectType, "decision");
  assert.equal(execution.objectInvestigation?.canonicalObjectType, "execution");
  assert.match(problem.objectInvestigation?.suggestedQuestions.join(" ") ?? "", /evidence|Goal|related/i);
  assert.doesNotMatch(problem.objectInvestigation?.glance.identity ?? "", /scenario/i);
  assert.ok(execution.objectInvestigation?.relatedDecision != null || execution.objectInvestigation?.actions.some((item) => item.action === "SHOW_DECISION_RELEVANCE"));
});

test("progressive disclosure, diagnostics, and DTH:2 evidence honesty", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-capacity", catalog);
  const glance = project(focused, { investigationLevel: "glance" });
  const understand = project(focused, { investigationLevel: "understand" });
  assert.equal(glance.objectInvestigation?.level, "glance");
  assert.equal(understand.objectInvestigation?.level, "understand");
  assert.notEqual(glance.objectInvestigation?.investigationId, understand.objectInvestigation?.investigationId);
  const withIconics = project(focused, {
    iconicAuthoritativeSources: NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES,
    investigationLevel: "investigate",
  });
  assert.ok((withIconics.objectInvestigation?.evidence.length ?? 0) > 0);
  const diagnostics = inspectNexoraDecisionTheatreProjection({
    theatre: withIconics,
    projectionInput: { stageState: focused, catalog, investigationLevel: "investigate" },
  });
  assert.equal(diagnostics.investigationObjectId, "ctx-scenario-capacity");
  assert.equal(diagnostics.investigationOpen, true);
  assert.ok(diagnostics.investigationActions.includes("EXPLAIN_OBJECT"));
  assert.ok(diagnostics.investigationUnavailableActions.some((item) => item.startsWith("SHOW_HISTORY:")));
});
