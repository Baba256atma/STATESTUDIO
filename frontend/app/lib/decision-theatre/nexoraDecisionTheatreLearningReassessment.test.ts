/**
 * DTH:12 — Learning & Reassessment Theatre tests.
 * Presentation only. Does not write Learning, APP-4, Decisions, or Goals.
 */

import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createNexoraCanonicalDecisionRuntime } from "@/app/lib/conversational-control/executiveDecisionRuntimeAdapter.ts";
import { createNexoraCanonicalExecutionRuntime } from "@/app/lib/conversational-control/executiveExecutionRuntimeAdapter.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import { resetOutcomeObservationCaptureForTests } from "@/app/lib/executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import {
  evaluateNexoraDecisionTheatreInvariants,
  inspectNexoraDecisionTheatreProjection,
  NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY,
  NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES,
  NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES,
  nexoraDecisionTheatreLearningReassessmentIdentity,
  projectNexoraDecisionTheatreFoundation,
} from "./nexoraDecisionTheatrePublicIndex.ts";
import type { NexoraDecisionTheatreAuthoritativeExecution } from "./nexoraDecisionTheatreExecutionReadinessComposer.ts";
import type { NexoraDecisionTheatreAuthoritativeOutcomeObservation } from "./nexoraDecisionTheatreOutcomeObservationComposer.ts";

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

function committedDecision() {
  return Object.freeze({
    decisionId: "cc10:decision:ctx-scenario-demand",
    title: "Demand Surge",
    status: "Approved",
    scenarioId: "ctx-scenario-demand",
    committedBy: "manager" as const,
  });
}

function startedExecution(
  extra?: Partial<NexoraDecisionTheatreAuthoritativeExecution>,
): NexoraDecisionTheatreAuthoritativeExecution {
  return Object.freeze({
    executionId: "execution-cc10:decision:ctx-scenario-demand",
    decisionId: "cc10:decision:ctx-scenario-demand",
    title: "Implement Demand Surge",
    status: "in-progress",
    ownerIds: Object.freeze([]),
    blockers: Object.freeze([]),
    risks: Object.freeze([]),
    milestones: Object.freeze([]),
    ...extra,
  });
}

function deliveryObservation(
  extra?: Partial<NexoraDecisionTheatreAuthoritativeOutcomeObservation>,
): NexoraDecisionTheatreAuthoritativeOutcomeObservation {
  return Object.freeze({
    observationId: "outcome:delivery:94",
    executionId: "execution-cc10:decision:ctx-scenario-demand",
    decisionId: "cc10:decision:ctx-scenario-demand",
    goalId: "goal:delivery",
    measure: "Delivery",
    observedNumeric: 94,
    observedLabel: "94%",
    unit: "%",
    baselineNumeric: 91,
    baselineLabel: "91%",
    targetNumeric: 96,
    targetLabel: "96%",
    source: "kpi-observation",
    phase: "unknown",
    causalSupport: false,
    financialKnown: false,
    ...extra,
  });
}

function project(
  extra?: Omit<Parameters<typeof projectNexoraDecisionTheatreFoundation>[0], "stageState" | "catalog">,
) {
  return projectNexoraDecisionTheatreFoundation({
    stageState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog),
    catalog,
    ncaActiveComparison: Object.freeze({
      candidateIds: Object.freeze([...two]),
      candidateKind: "scenario",
      criterion: "COST",
    }),
    authoritativeDecisions: [committedDecision()],
    executionStarted: true,
    executionRuntimeAvailable: true,
    ...extra,
  });
}

function observedTheatre(
  extra?: Partial<NexoraDecisionTheatreAuthoritativeOutcomeObservation>,
  more?: Omit<Parameters<typeof project>[0], "authoritativeExecutions" | "authoritativeOutcomeObservations">,
) {
  return project({
    authoritativeExecutions: [startedExecution({ status: "completed" })],
    authoritativeOutcomeObservations: [deliveryObservation(extra)],
    ...more,
  });
}

function startDemandSurge() {
  resetOutcomeObservationCaptureForTests();
  const decisionRuntime = createNexoraCanonicalDecisionRuntime({ authorityId: "dth12-dec" });
  executeNexoraConversationalExperience({
    utterance: "Approve Demand Surge",
    conversationContext: Object.freeze({
      currentSubjectId: "ctx-scenario-demand",
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "overview",
    }),
    executiveSubjects: subjects,
    runtimeState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog),
    catalog,
    decisionRuntime: decisionRuntime.adapter,
    messageIdSeed: "dth12-approve",
  });
  const executionRuntime = createNexoraCanonicalExecutionRuntime({
    decisionRuntime: decisionRuntime.adapter,
    authorityId: "dth12-exec",
  });
  executeNexoraConversationalExperience({
    utterance: "Start it.",
    conversationContext: Object.freeze({
      currentSubjectId: "ctx-scenario-demand",
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "overview",
    }),
    executiveSubjects: subjects,
    runtimeState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog),
    catalog,
    decisionRuntime: decisionRuntime.adapter,
    executionRuntime,
    messageIdSeed: "dth12-start",
  });
  return { decisionRuntime, executionRuntime };
}

function ask(utterance: string, run: ReturnType<typeof startDemandSurge>, seed: string) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: Object.freeze({
      currentSubjectId: "ctx-scenario-demand",
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: "overview",
    }),
    executiveSubjects: subjects,
    runtimeState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog),
    catalog,
    decisionRuntime: run.decisionRuntime.adapter,
    executionRuntime: run.executionRuntime,
    messageIdSeed: seed,
  });
}

test("DTH:12 contract, capability, and reserved length", () => {
  assert.equal(nexoraDecisionTheatreLearningReassessmentIdentity, "DTH:12/LearningReassessment");
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("learning-reassessment"));
  assert.equal(NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES.length, 7);
  assert.equal(NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.learningReassessmentImplemented, true);
});

test("A: Outcome is not automatic Learning that the Decision worked", () => {
  const theatre = observedTheatre();
  assert.notEqual(theatre.learningReassessment, null);
  assert.equal(theatre.learningReassessment?.derivationMetadata.outcomeBecameLearning, false);
  assert.doesNotMatch(theatre.learningReassessment?.advisorReadable.learned ?? "", /Decision worked|learned that Demand Surge works/i);
  assert.match(theatre.learningReassessment?.advisorReadable.learned ?? "", /does not establish that the intervention alone caused/);
});

test("B: partial Outcome bounds Learning", () => {
  const theatre = project({
    authoritativeExecutions: [startedExecution()],
    authoritativeOutcomeObservations: [deliveryObservation({ phase: "early", source: "manager-reported" })],
  });
  assert.equal(theatre.outcomeObservation?.state, "OUTCOME_PARTIAL");
  assert.equal(theatre.learningReassessment?.state, "LEARNING_UNCERTAIN");
  assert.notEqual(theatre.learningReassessment?.state, "LEARNING_CONFIRMED");
  assert.equal(theatre.learningReassessment?.durable, false);
});

test("C: session evidence does not become durable Learning", () => {
  const theatre = observedTheatre();
  assert.equal(theatre.learningReassessment?.durable, false);
  assert.equal(theatre.learningReassessment?.outcomeDurability, "session");
  assert.equal(theatre.writes.learning, false);
  assert.equal(theatre.learningReassessment?.derivationMetadata.persistedApp4, false);
  assert.equal(theatre.learningReassessment?.derivationMetadata.learningBecameDurable, false);
});

test("D: supported assumption can weaken without rewrite", () => {
  const theatre = observedTheatre(undefined, {
    authoritativeAssumptions: [
      Object.freeze({
        assumptionId: "assumption:capacity-target",
        decisionId: "cc10:decision:ctx-scenario-demand",
        statement: "Temporary external capacity is likely to raise delivery close to 96%.",
      }),
    ],
  });
  assert.equal(theatre.learningReassessment?.affectedAssumptions[0]?.effect, "weakened");
  assert.equal(theatre.learningReassessment?.affectedAssumptions[0]?.rewritten, false);
  assert.equal(theatre.learningReassessment?.affectedAssumptions[0]?.judgedTrueFalse, false);
  assert.match(theatre.learningReassessment?.advisorReadable.assumption ?? "", /not rewritten as false/);
});

test("E: no invented assumption", () => {
  const theatre = observedTheatre();
  assert.equal(theatre.learningReassessment?.affectedAssumptions.length, 0);
  assert.equal(theatre.learningReassessment?.derivationMetadata.inventedAssumption, false);
  assert.match(theatre.learningReassessment?.advisorReadable.assumption ?? "", /No original assumption record/);
});

test("F: weakened is not false and strengthened is not true", () => {
  const theatre = observedTheatre();
  assert.equal(theatre.learningReassessment?.weakenedHypotheses[0]?.effect, "weakened");
  assert.equal(theatre.learningReassessment?.derivationMetadata.weakenedBecameFalse, false);
  assert.equal(theatre.learningReassessment?.derivationMetadata.strengthenedBecameTrue, false);
});

test("G: no causal Learning invention", () => {
  const theatre = observedTheatre();
  assert.equal(theatre.learningReassessment?.causalSupport, false);
  assert.doesNotMatch(theatre.learningReassessment?.advisorReadable.learned ?? "", /caused a 3-point|Execution caused/i);
});

test("H: reassessment does not mutate domain state", () => {
  const theatre = observedTheatre();
  assert.equal(theatre.learningReassessment?.reassessmentState, "REASSESSMENT_AVAILABLE");
  assert.equal(theatre.writes.decisionState, false);
  assert.equal(theatre.writes.executionState, false);
  assert.equal(theatre.writes.outcome, false);
  assert.equal(theatre.learningReassessment?.derivationMetadata.mutatedGoal, false);
  assert.equal(theatre.learningReassessment?.derivationMetadata.mutatedScenario, false);
});

test("I: reassessment is not a new Decision", () => {
  const run = startDemandSurge();
  ask("Delivery improved from 91% to 94%.", run, "dth12-report-i");
  const before = run.decisionRuntime.adapter.listDecisions().map((item) => item.decisionId);
  const reconsider = ask("Let's reconsider the alternatives.", run, "dth12-reconsider-i");
  assert.deepEqual(
    run.decisionRuntime.adapter.listDecisions().map((item) => item.decisionId),
    before,
  );
  assert.equal(reconsider.decisionTheatre?.learningReassessment?.decisionJourneyReentered, false);
  assert.match(reconsider.response, /not a new Decision/i);
});

test("J: below-target Outcome does not change Goal", () => {
  const theatre = observedTheatre();
  assert.equal(theatre.learningReassessment?.targetLabel, "96%");
  const run = startDemandSurge();
  ask("Delivery improved from 91% to 94%.", run, "dth12-report-j");
  const asked = ask("Should we change the goal?", run, "dth12-goal");
  assert.match(asked.response, /96%/);
  assert.match(asked.response, /remains/);
});

test("K: below-target Outcome does not restart Execution", () => {
  const run = startDemandSurge();
  ask("Delivery improved from 91% to 94%.", run, "dth12-report-k");
  ask("What did we learn?", run, "dth12-learn-k");
  assert.equal(run.executionRuntime.listExecutions()[0]?.status, "in-progress");
  assert.equal(run.executionRuntime.listExecutions().length, 1);
});

test("L: Learning click remains inspection", () => {
  const theatre = observedTheatre(undefined, { investigationLevel: "investigate" });
  assert.equal(theatre.learningReassessment?.derivationMetadata.clickMutatedLearning, false);
  assert.equal(theatre.writes.learning, false);
  assert.equal(evaluateNexoraDecisionTheatreInvariants(theatre).ok, true);
});

test("M: Advisor learning awareness stays evidence-safe", () => {
  const run = startDemandSurge();
  ask("Delivery improved from 91% to 94%.", run, "dth12-report-m");
  const learned = ask("What did we learn?", run, "dth12-learn");
  const changed = ask("What changed?", run, "dth12-changed");
  const reconsider = ask("What should we reconsider?", run, "dth12-reconsider");
  const wrong = ask("Was our decision wrong?", run, "dth12-wrong");
  const why = ask("Why do you think that?", run, "dth12-why");
  const evidence = ask("What evidence supports that?", run, "dth12-evidence");
  assert.match(learned.response, /94%/);
  assert.match(learned.response, /96%/);
  assert.doesNotMatch(learned.response, /Decision worked/i);
  assert.match(changed.response, /weaker/i);
  assert.match(reconsider.response, /not a new Decision/i);
  assert.match(wrong.response, /does not by itself establish that the Decision was wrong/i);
  assert.match(why.response, /Decision time|what was known/i);
  assert.match(evidence.response, /observation/i);
});

test("N: hindsight safety", () => {
  const theatre = observedTheatre();
  assert.match(theatre.learningReassessment?.advisorReadable.hindsight ?? "", /Decision time/);
  assert.match(theatre.learningReassessment?.advisorReadable.decisionJudgment ?? "", /does not rewrite/);
});

test("O: contradictory Outcome stays unresolved", () => {
  const theatre = project({
    authoritativeExecutions: [startedExecution({ status: "completed" })],
    authoritativeOutcomeObservations: [
      deliveryObservation(),
      Object.freeze({
        ...deliveryObservation({
          observationId: "outcome:cost:up",
          measure: "Cost",
          observedNumeric: 12,
          observedLabel: "12",
          unit: "$",
          baselineNumeric: 10,
          baselineLabel: "10",
          targetNumeric: null,
          targetLabel: null,
        }),
      }),
    ],
  });
  assert.equal(theatre.learningReassessment?.contradictory, true);
  assert.match(theatre.learningReassessment?.advisorReadable.learned ?? "", /trade-off remains unresolved/);
  assert.doesNotMatch(theatre.learningReassessment?.advisorReadable.learned ?? "", /\bSuccess\b|\bFailure\b/);
});

test("P: insufficient Outcome evidence does not force Learning", () => {
  const pending = project({
    authoritativeExecutions: [startedExecution({ status: "completed" })],
  });
  assert.equal(pending.outcomeObservation?.state, "OUTCOME_PENDING");
  assert.equal(pending.learningReassessment?.evidenceQuality, "insufficient");
  assert.match(pending.learningReassessment?.advisorReadable.learned ?? "", /isn't enough evidence yet/);
});

test("Q: re-entry requires manager intent and does not auto-open comparison", () => {
  const before = observedTheatre();
  assert.equal(before.learningReassessment?.managerConsent, false);
  assert.equal(before.learningReassessment?.derivationMetadata.automaticComparisonReopened, false);
  const after = project({
    authoritativeExecutions: [startedExecution({ status: "completed" })],
    authoritativeOutcomeObservations: [deliveryObservation()],
    managerQuestion: "Let's reconsider the alternatives.",
  });
  assert.equal(after.learningReassessment?.managerConsent, true);
  assert.equal(after.learningReassessment?.decisionJourneyReentered, false);
  assert.equal(after.writes.decisionState, false);
});

test("R: historical integrity after Learning", () => {
  const theatre = observedTheatre();
  assert.equal(theatre.learningReassessment?.decisionTitle, "Demand Surge");
  assert.equal(theatre.outcomeObservation?.observedLabel, "94%");
  assert.equal(theatre.liveExecution?.executionId, theatre.learningReassessment?.executionId);
  assert.ok((theatre.learningReassessment?.comparisonMemberIds.length ?? 0) >= 2);
  assert.equal(theatre.sceneIntent.intentKind, "REVIEW_OUTCOME");
});

test("S: Learning collection queries remain read-only", () => {
  const run = startDemandSurge();
  ask("Delivery improved from 91% to 94%.", run, "dth12-report-s");
  const before = run.decisionRuntime.adapter.listDecisions().length;
  const shown = ask("show learnings", run, "dth12-show-learnings");
  assert.equal(run.decisionRuntime.adapter.listDecisions().length, before);
  assert.equal(shown.decisionTheatre?.writes.learning, false);
  assert.equal(run.executionRuntime.listExecutions()[0]?.status, "in-progress");
});

test("T: missing Outcome is not reconstructed as Learning", () => {
  const theatre = project({
    authoritativeExecutions: [startedExecution({ status: "completed" })],
  });
  assert.equal(theatre.learningReassessment?.durable, false);
  assert.equal(theatre.learningReassessment?.state, "LEARNING_CANDIDATE");
  const none = project({
    authoritativeDecisions: [committedDecision()],
    authoritativeExecutions: [startedExecution()],
  });
  assert.equal(none.outcomeObservation, null);
  assert.equal(none.learningReassessment, null);
});

test("diagnostics expose Learning Theatre without manager architecture terms", () => {
  const input = Object.freeze({
    stageState: selectNexoraMVPInteractionSubject(initial(), "ctx-scenario-demand", catalog),
    catalog,
    authoritativeDecisions: [committedDecision()],
    authoritativeExecutions: [startedExecution({ status: "completed" })],
    authoritativeOutcomeObservations: [deliveryObservation()],
    executionStarted: true,
    executionRuntimeAvailable: true,
  });
  const theatre = projectNexoraDecisionTheatreFoundation(input);
  const diagnostics = inspectNexoraDecisionTheatreProjection({ theatre, projectionInput: input });
  assert.equal(diagnostics.learningState, "LEARNING_SUPPORTED");
  assert.equal(diagnostics.learningDurable, false);
  assert.equal(diagnostics.reassessmentState, "REASSESSMENT_AVAILABLE");
  assert.equal(diagnostics.learningCausalSupport, false);
  assert.doesNotMatch(theatre.advisorReadable.learningReassessment?.scene ?? "", /DTH:12|CORE-OUT|APP-4/);
  assert.equal(evaluateNexoraDecisionTheatreInvariants(theatre).ok, true);
});
