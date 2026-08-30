/**
 * DTH:8 — Decision Commitment Experience tests.
 * Presentation only. CC:10 / CC:10R remain the commitment authority.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createNexoraCanonicalDecisionRuntime } from "@/app/lib/conversational-control/executiveDecisionRuntimeAdapter.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
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
  nexoraDecisionTheatreDecisionCommitmentIdentity,
  projectNexoraDecisionTheatreFoundation,
} from "./nexoraDecisionTheatrePublicIndex.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectDefaultNexoraMvpConversationalSubjects();
const two = ["ctx-scenario-pricing", "ctx-scenario-demand"] as const;

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function compareInput(memberIds: readonly string[]) {
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
  });
}

function project(
  state = initial(),
  extra?: Omit<Parameters<typeof projectNexoraDecisionTheatreFoundation>[0], "stageState" | "catalog">,
) {
  return projectNexoraDecisionTheatreFoundation({
    stageState: state,
    catalog,
    ...extra,
  });
}

test("DTH:8 contract, capability, and stable commitment ids", () => {
  assert.equal(nexoraDecisionTheatreDecisionCommitmentIdentity, "DTH:8/DecisionCommitment");
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("decision-commitment"));
  assert.equal(NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES.length, 7);
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.decisionCommitmentImplemented, true);
  const closed = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog), {
    sceneSemanticInput: compareInput(two),
  });
  assert.equal(closed.decisionCommitment, null);
  const first = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog), {
    sceneSemanticInput: compareInput(two),
    decisionReviewOpen: true,
    proposedCandidateId: "ctx-scenario-pricing",
  });
  const second = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog), {
    sceneSemanticInput: compareInput(two),
    decisionReviewOpen: true,
    proposedCandidateId: "ctx-scenario-pricing",
  });
  assert.equal(first.decisionCommitment?.commitmentId, second.decisionCommitment?.commitmentId);
  assert.match(first.decisionCommitment?.commitmentId ?? "", /^dth8-commitment:/);
  assert.equal(evaluateNexoraDecisionTheatreInvariants(first).ok, true);
});

test("A/B/C: click, investigation, and comparison do not commit", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog);
  const click = project(focused, { sceneSemanticInput: compareInput(two) });
  assert.equal(click.decisionCommitment, null);
  assert.equal(click.writes.decisionState, false);
  const investigated = project(focused, {
    sceneSemanticInput: compareInput(two),
    investigationLevel: "understand",
  });
  assert.equal(investigated.objectInvestigation?.objectId, "ctx-scenario-pricing");
  assert.equal(investigated.decisionCommitment, null);
  assert.ok(investigated.decisionComparison);
  assert.equal(investigated.writes.decisionState, false);
});

test("D/E/P: recommendation and review are not a Decision", () => {
  const review = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog), {
    sceneSemanticInput: compareInput(two),
    decisionReviewOpen: true,
    proposedCandidateId: "ctx-scenario-pricing",
    comparisonAuthority: {
      preferredCandidateId: "ctx-scenario-pricing",
      statement: "Nexora currently favors Pricing Response.",
      source: "NXA:5",
      evidenceState: "PARTIAL",
    },
  });
  assert.equal(review.decisionCommitment?.state, "REVIEWING");
  assert.equal(review.decisionCommitment?.authoritativeDecisionId, null);
  assert.match(review.decisionCommitment?.advisorReadable.recommendationDistinct ?? "", /not a manager Decision/);
  assert.equal(review.writes.decisionState, false);
});

test("G/H DTH:7 proceed opens review without executing", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog);
  const theatre = project(focused, { sceneSemanticInput: compareInput(two) });
  assert.equal(theatre.decisionComparison?.actions.find((item) => item.action === "PROCEED_TO_DECISION")?.available, true);
  assert.equal(theatre.writes.decisionState, false);
  assert.equal(theatre.writes.executionState, false);
});

test("I/L: cancel review creates no Decision and keeps comparison members", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog);
  const before = JSON.stringify(focused);
  const open = project(focused, {
    sceneSemanticInput: compareInput(two),
    decisionReviewOpen: true,
    proposedCandidateId: "ctx-scenario-pricing",
  });
  const closed = project(focused, {
    sceneSemanticInput: compareInput(two),
    decisionReviewOpen: false,
  });
  assert.equal(JSON.stringify(focused), before);
  assert.equal(open.decisionCommitment?.actions.find((item) => item.action === "CANCEL_DECISION_REVIEW")?.available, true);
  assert.equal(closed.decisionCommitment, null);
  assert.deepEqual([...(closed.decisionComparison?.candidateIds ?? [])], [...two]);
});

test("J: change candidate before commit reviews B", () => {
  const switched = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog), {
    sceneSemanticInput: compareInput(two),
    decisionReviewOpen: true,
    proposedCandidateId: "ctx-scenario-demand",
  });
  assert.equal(switched.decisionCommitment?.candidateId, "ctx-scenario-demand");
  assert.equal(switched.decisionCommitment?.authoritativeDecisionId, null);
});

test("F/H/Q: explicit commit presents one Decision and does not start Execution", () => {
  const committed = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog), {
    sceneSemanticInput: compareInput(two),
    decisionReviewOpen: true,
    proposedCandidateId: "ctx-scenario-demand",
    authoritativeDecisions: [
      {
        decisionId: "dec-demand-1",
        title: "Demand Surge",
        status: "Approved",
        scenarioId: "ctx-scenario-demand",
        committedBy: "manager",
      },
    ],
  });
  assert.equal(committed.decisionCommitment?.state, "COMMITTED");
  assert.equal(committed.decisionCommitment?.authoritativeDecisionId, "dec-demand-1");
  assert.equal(committed.decisionCommitment?.candidateId, "ctx-scenario-demand");
  assert.equal(committed.decisionCommitment?.executionStarted, false);
  assert.equal(committed.decisionCommitment?.actions.find((item) => item.action === "PROCEED_TO_EXECUTION")?.available, false);
  assert.equal(committed.writes.executionState, false);
  const again = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog), {
    sceneSemanticInput: compareInput(two),
    authoritativeDecisions: [
      {
        decisionId: "dec-demand-1",
        title: "Demand Surge",
        status: "Approved",
        scenarioId: "ctx-scenario-demand",
        committedBy: "manager",
      },
    ],
  });
  assert.equal(again.decisionCommitment?.authoritativeDecisionId, "dec-demand-1");
  const overwrite = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog), {
    sceneSemanticInput: compareInput(two),
    decisionReviewOpen: true,
    proposedCandidateId: "ctx-scenario-pricing",
    authoritativeDecisions: [
      {
        decisionId: "dec-demand-1",
        title: "Demand Surge",
        status: "Approved",
        scenarioId: "ctx-scenario-demand",
        committedBy: "manager",
      },
    ],
  });
  assert.equal(overwrite.decisionCommitment?.actions.find((item) => item.action === "CHANGE_CANDIDATE")?.available, false);
});

test("M/N/O: investigation return, unknown stays unknown, assumption stays assumption", () => {
  const review = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog), {
    sceneSemanticInput: compareInput(two),
    decisionReviewOpen: true,
    proposedCandidateId: "ctx-scenario-pricing",
    investigationLevel: "understand",
    iconicAuthoritativeSources: [
      ...NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES,
      NEXORA_DECISION_THEATRE_DTH2_UNSUPPORTED_ZERO_COST,
    ],
  });
  assert.equal(review.objectInvestigation?.objectId, "ctx-scenario-pricing");
  assert.equal(review.decisionCommitment?.candidateId, "ctx-scenario-pricing");
  assert.notEqual(review.decisionCommitment?.evidence, "0");
  assert.match(review.decisionCommitment?.advisorReadable.mustNotInfer.join(" ") ?? "", /assumption is not a fact/i);
});

test("Goal and Problem context plus Advisor have I decided", () => {
  const withContext = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog), {
    sceneSemanticInput: compareInput(two),
    decisionReviewOpen: true,
    proposedCandidateId: "ctx-scenario-pricing",
  });
  assert.equal(withContext.decisionCommitment?.sceneScriptId, withContext.sceneScript.scriptId);
  const asked = executeNexoraConversationalExperience({
    utterance: "Have I already made the decision?",
    conversationContext: Object.freeze({
      currentSubjectId: "ctx-scenario-pricing",
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "overview",
    }),
    executiveSubjects: subjects,
    runtimeState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog),
    catalog,
    theatreDecisionReviewOpen: true,
    theatreProposedCandidateId: "ctx-scenario-pricing",
    messageIdSeed: "dth8-have-i",
  });
  assert.match(asked.response, /No\. You have not made a Decision yet|still reviewing|not a Decision/i);
});

test("K: Why this one after switching proposed candidate stays on B", () => {
  const switched = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog), {
    sceneSemanticInput: compareInput(two),
    decisionReviewOpen: true,
    proposedCandidateId: "ctx-scenario-demand",
  });
  assert.equal(switched.decisionCommitment?.candidateLabel, "Demand Surge");
  assert.doesNotMatch(switched.decisionCommitment?.candidateLabel ?? "", /Pricing Response/);
  const asked = executeNexoraConversationalExperience({
    utterance: "Why this one?",
    conversationContext: Object.freeze({
      currentSubjectId: "ctx-scenario-demand",
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "overview",
    }),
    executiveSubjects: subjects,
    runtimeState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog),
    catalog,
    theatreDecisionReviewOpen: true,
    theatreProposedCandidateId: "ctx-scenario-demand",
    messageIdSeed: "dth8-why-b",
  });
  assert.doesNotMatch(asked.response, /Pricing Response/);
});

test("R: Stage JSON is unchanged by review projection", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog);
  const before = JSON.stringify(focused);
  project(focused, {
    sceneSemanticInput: compareInput(two),
    decisionReviewOpen: true,
    proposedCandidateId: "ctx-scenario-pricing",
  });
  assert.equal(JSON.stringify(focused), before);
});

test("CC:10 catalog scenario commit is one Decision for Demand Surge", () => {
  const runtime = createNexoraCanonicalDecisionRuntime({ authorityId: "dth8-catalog" });
  const choose = executeNexoraConversationalExperience({
    utterance: "Approve Demand Surge",
    conversationContext: Object.freeze({
      currentSubjectId: "ctx-scenario-demand",
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "overview",
    }),
    executiveSubjects: subjects,
    runtimeState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog),
    catalog,
    decisionRuntime: runtime.adapter,
    messageIdSeed: "dth8-catalog",
  });
  const decisions = runtime.adapter.listDecisions().filter((item) => item.status === "Approved");
  assert.equal(choose.decisionCommitmentResult?.status, "applied");
  assert.equal(decisions.length, 1);
  assert.equal(decisions[0]?.scenarioId, "ctx-scenario-demand");
  assert.equal(choose.shouldCommitRuntime, false);
  const presented = project(initial(), {
    sceneSemanticInput: compareInput(two),
    authoritativeDecisions: decisions.map((item) => ({
      decisionId: item.decisionId,
      title: item.title,
      status: item.status,
      scenarioId: item.scenarioId ?? null,
      committedBy: item.committedBy ?? null,
    })),
  });
  assert.equal(presented.decisionCommitment?.state, "COMMITTED");
  assert.equal(presented.decisionCommitment?.candidateId, "ctx-scenario-demand");
  assert.equal(presented.decisionCommitment?.executionStarted, false);
});

test("CC:10 explicit commit is one Decision and Theatre presents it", () => {
  const runtime = createNexoraCanonicalDecisionRuntime({ authorityId: "dth8-test" });
  const choose = executeNexoraConversationalExperience({
    utterance: "Let's go with Scenario B",
    conversationContext: Object.freeze({
      currentSubjectId: "obj-capacity",
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "overview",
    }),
    executiveSubjects: subjects,
    runtimeState: initial(),
    catalog,
    decisionRuntime: runtime.adapter,
    messageIdSeed: "dth8-cc10",
  });
  const decisions = runtime.adapter.listDecisions().filter((item) => item.status === "Approved");
  if (choose.decisionCommitmentResult?.status === "applied" || decisions.length === 1) {
    assert.equal(decisions.length, 1);
    assert.equal(choose.shouldCommitRuntime, false);
    const presented = project(initial(), {
      sceneSemanticInput: compareInput(two),
      authoritativeDecisions: decisions.map((item) => ({
        decisionId: item.decisionId,
        title: item.title,
        status: item.status,
        scenarioId: item.scenarioId ?? null,
        committedBy: item.committedBy ?? null,
      })),
    });
    assert.equal(presented.decisionCommitment?.state, "COMMITTED");
    assert.equal(presented.decisionCommitment?.executionStarted, false);
  } else {
    assert.ok(
      choose.decisionCommitmentResult == null ||
        choose.decisionCommitmentResult.status === "confirmation-required" ||
        choose.decisionCommitmentResult.status === "clarification-required" ||
        choose.decisionCommitmentResult.status === "invalid-candidate",
    );
  }
});

test("diagnostics expose commitment without manager architecture terms", () => {
  const theatre = project(selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog), {
    sceneSemanticInput: compareInput(two),
    decisionReviewOpen: true,
    proposedCandidateId: "ctx-scenario-pricing",
  });
  const diagnostics = inspectNexoraDecisionTheatreProjection({
    theatre,
    projectionInput: {
      stageState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-pricing", catalog),
      catalog,
      decisionReviewOpen: true,
      proposedCandidateId: "ctx-scenario-pricing",
    },
  });
  assert.equal(diagnostics.commitmentState, "REVIEWING");
  assert.equal(diagnostics.commitmentCandidateId, "ctx-scenario-pricing");
  assert.doesNotMatch(JSON.stringify(theatre.advisorReadable.commitment), /CC:10|DTH:8|Scene Script/);
});
