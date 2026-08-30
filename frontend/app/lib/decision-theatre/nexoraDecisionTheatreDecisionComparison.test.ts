/**
 * DTH:7 — Decision Comparison Experience tests.
 * Presentation only. Does not replace NCA-POST:4, DTH:5–6, or Decision tests.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  NEXORA_DECISION_THEATRE_DTH2_GOAL_OBJECT_FIXTURE,
  NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES,
  NEXORA_DECISION_THEATRE_DTH2_UNSUPPORTED_ZERO_COST,
} from "./nexoraDecisionTheatreIconicFixtures.ts";
import {
  emptyNexoraDecisionTheatreSceneSemanticInput,
  evaluateNexoraDecisionTheatreInvariants,
  inspectNexoraDecisionTheatreProjection,
  NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY,
  NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES,
  NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES,
  nexoraDecisionTheatreDecisionComparisonIdentity,
  projectNexoraDecisionTheatreFoundation,
} from "./nexoraDecisionTheatrePublicIndex.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectDefaultNexoraMvpConversationalSubjects();
const two = ["ctx-scenario-pricing", "ctx-scenario-demand"] as const;
const three = ["ctx-scenario-pricing", "ctx-scenario-demand", "ctx-scenario-capacity"] as const;

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function compareInput(memberIds: readonly string[], extra?: Record<string, unknown>) {
  return emptyNexoraDecisionTheatreSceneSemanticInput({
    canonicalSemanticResultRef: `compare:${memberIds.join(",")}`,
    canonicalOperation: "COMPARE",
    conversationIntentKind: "compare-scenarios",
    comparison: Object.freeze({
      active: true,
      memberIds: Object.freeze([...memberIds]),
      criterion: "COST",
      criterionAmbiguous: false,
      criterionResolution: null,
    }),
    ...extra,
  });
}

function project(
  state = initial(),
  extra?: Omit<Parameters<typeof projectNexoraDecisionTheatreFoundation>[0], "stageState" | "catalog"> & {
    catalog?: typeof catalog;
  },
) {
  return projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog: extra?.catalog ?? catalog,
    ...extra,
  });
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
    messageIdSeed: `dth7-${utterance}`,
  });
}

test("DTH:7 contract, capability, and stable comparison ids", () => {
  assert.equal(nexoraDecisionTheatreDecisionComparisonIdentity, "DTH:7/DecisionComparison");
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("decision-comparison"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("decision-commitment"));
  assert.equal(NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES.length, 7);
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.decisionComparisonImplemented, true);
  const none = project();
  assert.equal(none.decisionComparison, null);
  const first = project(initial(), { sceneSemanticInput: compareInput(two) });
  const second = project(initial(), { sceneSemanticInput: compareInput(two) });
  assert.equal(first.decisionComparison?.comparisonId, second.decisionComparison?.comparisonId);
  assert.match(first.decisionComparison?.comparisonId ?? "", /^dth7-comparison:/);
  assert.equal(evaluateNexoraDecisionTheatreInvariants(first).ok, true);
  assert.doesNotMatch(JSON.stringify(first.advisorReadable.comparison), /NCA-POST|COMPARE_CANDIDATES|Scene Script|canonical members/);
});

test("A: one Scenario cannot become a comparison", () => {
  const theatre = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog), {
    sceneSemanticInput: compareInput(["ctx-scenario-pricing"]),
  });
  assert.equal(theatre.decisionComparison, null);
});

test("B: nearby objects are not comparison candidates", () => {
  const mixed = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  const theatre = project(mixed);
  assert.equal(theatre.decisionComparison, null);
  assert.ok(theatre.visibleExecutiveObjects.length >= 1);
});

test("2 and 3 candidates, order stability", () => {
  const twoCmp = project(initial(), { sceneSemanticInput: compareInput(two) });
  const threeCmp = project(initial(), { sceneSemanticInput: compareInput(three) });
  assert.deepEqual([...(twoCmp.decisionComparison?.candidateIds ?? [])], [...two]);
  assert.equal(twoCmp.decisionComparison?.candidates.length, 2);
  assert.deepEqual([...(threeCmp.decisionComparison?.candidateIds ?? [])], [...three]);
  assert.equal(threeCmp.decisionComparison?.candidates.length, 3);
  const again = project(initial(), { sceneSemanticInput: compareInput(three) });
  assert.deepEqual(threeCmp.decisionComparison?.candidateIds, again.decisionComparison?.candidateIds);
});

test("C: no fake 0-100 scoring", () => {
  const theatre = project(initial(), {
    sceneSemanticInput: compareInput(two),
    iconicAuthoritativeSources: NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES,
  });
  const text = JSON.stringify(theatre.decisionComparison);
  assert.doesNotMatch(text, /"score"\s*:/);
  assert.doesNotMatch(text, /= 87|= 74|\/100/);
  assert.equal(theatre.decisionComparison?.derivationMetadata.inventedScores, false);
});

test("D: missing cost and time stay unavailable, not zero", () => {
  const missing = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-capacity", catalog), {
    sceneSemanticInput: compareInput(two),
    iconicAuthoritativeSources: [NEXORA_DECISION_THEATRE_DTH2_UNSUPPORTED_ZERO_COST],
  });
  for (const candidate of missing.decisionComparison?.candidates ?? []) {
    assert.notEqual(candidate.cost, "0");
    assert.notEqual(candidate.time, "0");
    assert.notEqual(candidate.cost, "0 USD");
  }
});

test("E/F: no invented winner; recommendation is not a Decision", () => {
  const none = project(initial(), { sceneSemanticInput: compareInput(two) });
  assert.equal(none.decisionComparison?.recommendation, null);
  assert.equal(none.writes.decisionState, false);
  const withRec = project(initial(), {
    sceneSemanticInput: compareInput(two),
    comparisonAuthority: {
      preferredCandidateId: "ctx-scenario-pricing",
      statement: "Temporary Capacity currently has stronger evidence for near-term improvement.",
      source: "NXA:5",
      evidenceState: "PARTIAL",
    },
  });
  assert.equal(withRec.decisionComparison?.recommendation?.isDecision, false);
  assert.match(withRec.decisionComparison?.advisorReadable.recommendation ?? "", /not an approved Decision/i);
  assert.equal(withRec.writes.decisionState, false);
});

test("G/H: click investigates; proceed-to-decision does not execute", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog);
  const theatre = project(focused, { sceneSemanticInput: compareInput(two) });
  assert.equal(theatre.primaryExecutiveObjectId, "ctx-scenario-pricing");
  assert.equal(theatre.decisionComparison?.activeCandidateId, "ctx-scenario-pricing");
  assert.equal(theatre.writes.executionState, false);
  assert.equal(theatre.decisionComparison?.actions.find((item) => item.action === "PROCEED_TO_DECISION")?.available, true);
  assert.equal(theatre.writes.decisionState, false);
});

test("I/J/R: scene preserved and DTH:6 does not drop candidates", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog);
  const before = JSON.stringify(focused);
  const theatre = project(focused, {
    sceneSemanticInput: compareInput(two),
    investigationLevel: "understand",
    ncaActiveComparison: { candidateIds: two, candidateKind: "scenario", criterion: "COST" },
  });
  assert.equal(JSON.stringify(focused), before);
  assert.equal(theatre.objectInvestigation?.objectId, "ctx-scenario-pricing");
  assert.deepEqual([...(theatre.decisionComparison?.candidateIds ?? [])], [...two]);
  assert.equal(theatre.sceneScript.scriptId, theatre.decisionComparison?.sceneScriptId);
});

test("K: later selected candidate is the Advisor investigation anchor", () => {
  const first = selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog);
  const second = selectNexoraMVPInteractionSubject(first, "ctx-scenario-demand", catalog);
  const scenarios = runConversation("show scenarios", second);
  const compared = executeNexoraConversationalExperience({
    utterance: "Compare them",
    conversationContext: Object.freeze({
      currentSubjectId: second.focusedSubject?.id ?? null,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: second.workspace,
    }),
    executiveSubjects: subjects,
    runtimeState: scenarios.nextRuntimeState,
    catalog,
    messageIdSeed: "dth7-k-compare",
    previousManagerObjectSession: scenarios.managerObjectTurn.session,
  });
  const focusedDemand = selectNexoraMVPInteractionSubject(
    compared.nextRuntimeState,
    "ctx-scenario-demand",
    catalog,
  );
  const result = executeNexoraConversationalExperience({
    utterance: "Why this one?",
    conversationContext: Object.freeze({
      currentSubjectId: "ctx-scenario-demand",
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: focusedDemand.workspace,
    }),
    executiveSubjects: subjects,
    runtimeState: focusedDemand,
    catalog,
    messageIdSeed: "dth7-k-why",
    previousManagerObjectSession: compared.managerObjectTurn.session,
  });
  assert.equal(result.decisionTheatre?.objectInvestigation?.objectId ?? result.nextRuntimeState.focusedSubject?.id, "ctx-scenario-demand");
  assert.match(result.response, /Demand Surge/i);
  assert.doesNotMatch(result.decisionTheatre?.objectInvestigation?.managerReadableName ?? "", /Pricing Response/i);
});

test("L/M/N/O: association, assumption, evidence, and importance stay distinct", () => {
  const theatre = project(initial(), {
    sceneSemanticInput: compareInput(two),
    iconicAuthoritativeSources: NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES,
  });
  const copy = JSON.stringify(theatre.advisorReadable.comparison);
  assert.match(copy, /not a confirmed cause|not a guaranteed outcome|not guaranteed success/i);
  assert.match(copy, /Importance, urgency, risk, and recommendation remain different/);
  assert.match(copy, /assumption is not a fact/i);
  assert.doesNotMatch(copy, /approved Decision because of evidence/i);
});

test("P: Do Nothing remains a candidate when authoritative", () => {
  const withBaseline = {
    ...catalog,
    contextSubjects: Object.freeze([
      ...catalog.contextSubjects,
      Object.freeze({
        id: "ctx-scenario-donothing",
        label: "Do Nothing",
        kind: "scenario" as const,
        status: "stable" as const,
        attention: "normal" as const,
      }),
    ]),
  };
  const members = ["ctx-scenario-pricing", "ctx-scenario-donothing"] as const;
  const theatre = project(initial(), {
    catalog: withBaseline,
    sceneSemanticInput: compareInput(members),
  });
  assert.equal(theatre.decisionComparison?.candidates.some((item) => item.isDoNothing), true);
  assert.ok(theatre.decisionComparison?.candidateIds.includes("ctx-scenario-donothing"));
});

test("Q: unsupported criteria are omitted unless explicitly requested", () => {
  const unspecified = emptyNexoraDecisionTheatreSceneSemanticInput({
    canonicalSemanticResultRef: "compare-unspecified",
    canonicalOperation: "COMPARE",
    comparison: Object.freeze({
      active: true,
      memberIds: Object.freeze([...two]),
      criterion: "UNSPECIFIED",
      criterionAmbiguous: true,
      criterionResolution: null,
    }),
  });
  const theatre = project(initial(), { sceneSemanticInput: unspecified });
  assert.equal(theatre.decisionComparison, null);
  const withCost = project(initial(), { sceneSemanticInput: compareInput(two) });
  const keys = withCost.decisionComparison?.criteria.map((item) => item.key) ?? [];
  assert.equal(keys.includes("reversibility"), false);
});

test("Goal and Problem context, evidence/cost/time, trade-offs, readiness, Advisor better", () => {
  const withGoal = {
    ...catalog,
    objects: Object.freeze([...catalog.objects, NEXORA_DECISION_THEATRE_DTH2_GOAL_OBJECT_FIXTURE]),
  };
  const goalStage = selectNexoraMVPInteractionSubject(initial(), "obj-goal", withGoal);
  const goalCmp = project(goalStage, {
    catalog: withGoal,
    ncaActiveComparison: { candidateIds: two, candidateKind: "scenario", criterion: "GOAL_IMPACT" },
  });
  assert.equal(goalCmp.decisionComparison?.focalGoal?.id, "obj-goal");
  const problemStage = selectNexoraMVPInteractionSubject(initial(), "ctx-problem-margin", catalog);
  const problemCmp = project(problemStage, {
    ncaActiveComparison: { candidateIds: two, candidateKind: "scenario", criterion: "COST" },
  });
  assert.equal(problemCmp.decisionComparison?.focalProblem?.id, "ctx-problem-margin");
  const withIconics = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-capacity", catalog), {
    sceneSemanticInput: compareInput(["ctx-scenario-capacity", "ctx-scenario-pricing"]),
    iconicAuthoritativeSources: NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES,
    comparisonLevel: "compare",
  });
  assert.ok((withIconics.decisionComparison?.tradeOffs.length ?? 0) > 0);
  assert.ok(withIconics.decisionComparison?.criteria.some((item) => item.key === "cost" && item.available));
  const better = runConversation("Which one is better?");
  assert.match(better.response, /urgency|financial|evidence|risk|Goal|important in which sense/i);
  const diagnostics = inspectNexoraDecisionTheatreProjection({
    theatre: withIconics,
    projectionInput: {
      stageState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-capacity", catalog),
      catalog,
      comparisonLevel: "compare",
    },
  });
  assert.ok((diagnostics.comparisonCandidateCount ?? 0) >= 2);
  assert.equal(diagnostics.unauthorizedMutation, false);
});

test("conversation Compare them does not approve a Decision", () => {
  const scenarios = runConversation("show scenarios");
  const compared = executeNexoraConversationalExperience({
    utterance: "Compare them",
    conversationContext: Object.freeze({
      currentSubjectId: scenarios.nextRuntimeState.focusedSubject?.id ?? null,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: scenarios.nextRuntimeState.workspace,
    }),
    executiveSubjects: subjects,
    runtimeState: scenarios.nextRuntimeState,
    catalog,
    messageIdSeed: "dth7-compare-them",
    previousManagerObjectSession: scenarios.managerObjectTurn.session,
  });
  assert.equal(compared.decisionTheatre?.writes.decisionState, false);
  assert.ok((compared.ncaPost4Comparison?.candidateSet.candidateIds.length ?? 0) >= 2);
  assert.equal(compared.ncaPost4Comparison?.preferredCandidateId, null);
  assert.equal(compared.decisionTheatre?.decisionComparison?.recommendation, null);
});
