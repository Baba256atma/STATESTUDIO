/**
 * NPA-T NPS:FINAL bounded real-manager /executive certification journey.
 * Observes the certified NPS:1–8 path. Does not add capabilities.
 */
import assert from "node:assert/strict";
import test from "node:test";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createEmptyNexoraExecutiveContextSnapshot } from "@/app/lib/conversational-control/executiveContextSnapshot.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import { createEmptyManagerObjectSession } from "@/app/lib/manager-object/managerObjectActive.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { resetWorkspaceRiskStoreForTests } from "@/app/lib/risk/workspaceRiskContract.ts";
import { ensureBrowserLocalStorageHarness } from "@/app/lib/test-harness/browserLocalStorageHarness.ts";
import { createWorkspace, resetWorkspaceRegistryForTests } from "@/app/lib/workspace/workspaceRegistryStore.ts";
import { resetOutcomeObservationCaptureForTests } from "@/app/lib/executive-intelligence/nexoraLiveOutcomeObservationCapture.ts";

const ARCH = /\b(?:NPS:\d|ECA:\d|CC:\d{1,2}|CORE-OUT|CORE-INT|NCA-POST|DTH:\d)\b/i;
const CAPACITY = "ctx-problem-capacity";

function setup() {
  ensureBrowserLocalStorageHarness();
  window.localStorage.clear();
  resetWorkspaceRiskStoreForTests();
  resetWorkspaceRegistryForTests();
  resetOutcomeObservationCaptureForTests();
  return createWorkspace("NPS:FINAL Runtime Proofs").workspaceId;
}

function run(
  utterance: string,
  workspaceId: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext ?? {
      currentSubjectId: null,
      previousSubjectIds: [],
      currentWorkspaceId: workspaceId,
    },
    executiveContext:
      previous?.nextExecutiveContext ??
      createEmptyNexoraExecutiveContextSnapshot({ currentWorkspaceId: workspaceId }),
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState:
      previous?.nextRuntimeState ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog: getDefaultNexoraMVPObjectInteractionCatalog(),
    previousManagerObjectSession:
      previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    messageIdSeed: `nps-final-${utterance}`,
    decisionRuntime: previous?.decisionRuntime ?? null,
    executionRuntime: previous?.executionRuntime ?? null,
  });
}

function freezeAttached(result: ReturnType<typeof executeNexoraConversationalExperience>) {
  assert.equal(result.npsPath?.identity, "NPA-T NPS:1/ProblemSolvingPathFoundation");
  assert.equal(result.npsUnderstanding?.identity, "NPA-T NPS:2/ProblemUnderstandingInvestigation");
  assert.equal(result.npsEvidenceCause?.identity, "NPA-T NPS:3/EvidenceCauseAnalysis");
  assert.equal(result.npsOptionGeneration?.identity, "NPA-T NPS:4/OptionsScenarioGeneration");
  assert.equal(result.npsComparisonRecommendation?.identity, "NPA-T NPS:5/ComparisonRecommendation");
  assert.equal(result.npsDecisionCommitment?.identity, "NPA-T NPS:6/DecisionCommitment");
  assert.equal(result.npsExecutionMonitoring?.identity, "NPA-T NPS:7/ExecutionMonitoring");
  assert.equal(result.npsOutcomeLearning?.identity, "NPA-T NPS:8/OutcomeLearningReassessment");
}

function writesZero(result: ReturnType<typeof executeNexoraConversationalExperience>) {
  assert.equal(result.npsUnderstanding?.commitsDecision, false);
  assert.equal(result.npsUnderstanding?.startsExecution, false);
  assert.equal(result.npsEvidenceCause?.writesScenario, false);
  assert.equal(result.npsOptionGeneration?.writesScenario, false);
  assert.equal(result.npsComparisonRecommendation?.commitsDecision, false);
  assert.equal(result.npsDecisionCommitment?.npsWritesDecision, false);
  assert.equal(result.npsDecisionCommitment?.startsExecution, false);
  assert.equal(result.npsExecutionMonitoring?.npsWritesExecution, false);
  assert.equal(result.npsExecutionMonitoring?.writesDecision, false);
  assert.equal(result.npsExecutionMonitoring?.writesOutcome, false);
  assert.equal(result.npsExecutionMonitoring?.writesLearning, false);
  assert.equal(result.npsOutcomeLearning?.npsWritesDecision, false);
  assert.equal(result.npsOutcomeLearning?.writesExecution, false);
  assert.equal(result.npsOutcomeLearning?.writesOutcome, false);
  assert.equal(result.npsOutcomeLearning?.writesLearning, false);
  assert.equal(result.npsOutcomeLearning?.learningDurable, false);
}

function capacity(result: ReturnType<typeof executeNexoraConversationalExperience>) {
  assert.equal(result.npsUnderstanding?.problemId, CAPACITY);
  assert.equal(result.npsEvidenceCause?.problemId, CAPACITY);
  assert.equal(result.npsOptionGeneration?.problemId, CAPACITY);
  assert.equal(result.npsComparisonRecommendation?.problemId, CAPACITY);
  assert.equal(result.npsDecisionCommitment?.problemId, CAPACITY);
  assert.equal(result.npsExecutionMonitoring?.problemId, CAPACITY);
  assert.equal(result.npsOutcomeLearning?.problemId, CAPACITY);
  assert.doesNotMatch(result.response, ARCH);
}

test("NPS:FINAL live — Capacity Gap manager journey through NPS:1–8", () => {
  const workspaceId = setup();
  const listed = run("Show me the problems.", workspaceId);
  freezeAttached(listed);
  writesZero(listed);
  assert.doesNotMatch(listed.response, ARCH);

  const work = run("Let's work on Capacity Gap.", workspaceId, listed);
  freezeAttached(work);
  writesZero(work);
  capacity(work);
  assert.ok(
    work.npsPath?.currentState === "PROBLEM_IDENTIFIED" ||
      work.npsPath?.currentState === "UNDERSTANDING" ||
      work.npsPath?.currentState === "INVESTIGATING" ||
      work.npsPath?.currentState === "OPTIONS_AVAILABLE" ||
      work.npsPath?.currentState === "COMPARING_OPTIONS" ||
      work.npsPath?.currentState === "RECOMMENDATION_READY" ||
      work.npsPath?.currentState === "AWAITING_COMMITMENT" ||
      work.npsPath?.currentState === "DECIDED" ||
      work.npsPath?.currentState === "EXECUTION_READINESS",
  );

  const know = run("What do we know about Capacity Gap?", workspaceId, work);
  capacity(know);
  writesZero(know);
  assert.ok((know.npsUnderstanding?.knownFacts.length ?? 0) + (know.npsUnderstanding?.knownSymptoms.length ?? 0) > 0);
  assert.ok((know.npsUnderstanding?.unknowns.length ?? 0) > 0);
  assert.equal(know.npsUnderstanding?.confirmedCause, null);

  const need = run("What do we still need to know?", workspaceId, know);
  capacity(need);
  writesZero(need);

  const investigate = run("Investigate it.", workspaceId, need);
  capacity(investigate);
  writesZero(investigate);
  assert.notEqual(investigate.npsUnderstanding?.problemId, "ctx-problem-margin");

  const whyNeed = run("Why do we need that?", workspaceId, investigate);
  capacity(whyNeed);

  const evidence = run("What does the evidence tell us?", workspaceId, whyNeed);
  capacity(evidence);
  writesZero(evidence);
  assert.equal(evidence.npsEvidenceCause?.confirmedCause, null);

  const causing = run("What seems to be causing Capacity Gap?", workspaceId, evidence);
  capacity(causing);
  assert.notEqual(causing.npsEvidenceCause?.causalStatus, "CONFIRMED_CAUSE");

  const definite = run("So Demand Surge is definitely the cause?", workspaceId, causing);
  capacity(definite);
  assert.equal(definite.npsEvidenceCause?.confirmedCause, null);
  assert.match(definite.response, /not a confirmed cause|not proven|does not confirm/i);

  const options = run("What options do we have?", workspaceId, definite);
  capacity(options);
  writesZero(options);
  assert.ok((options.npsOptionGeneration?.optionCandidates?.length ?? 0) >= 1);
  assert.equal(options.npsDecisionCommitment?.approvedDecisionId == null || options.npsComparisonRecommendation?.recommendationStatus != null, true);

  const compare = run("Compare the options.", workspaceId, options);
  capacity(compare);
  writesZero(compare);

  const recommend = run("Which one do you recommend?", workspaceId, compare);
  capacity(recommend);
  writesZero(recommend);
  assert.equal(recommend.npsDecisionCommitment?.approvedDecisionId, null);

  const why = run("Why that one?", workspaceId, recommend);
  capacity(why);
  writesZero(why);

  const notDecision = run("So that's our decision?", workspaceId, why);
  capacity(notDecision);
  writesZero(notDecision);
  assert.equal(notDecision.npsDecisionCommitment?.approvedDecisionId, null);
  assert.match(notDecision.response, /not an approved Decision|has not been approved as the Decision|not been approved|preference|recommend/i);

  const prefer = run("I prefer External Capacity.", workspaceId, notDecision);
  capacity(prefer);
  writesZero(prefer);
  assert.equal(prefer.npsDecisionCommitment?.commitmentStatus, "PREFERENCE_EXPRESSED");
  assert.equal(prefer.npsDecisionCommitment?.approvedDecisionId, null);
  assert.equal(prefer.npsExecutionMonitoring?.executionId, null);

  const proceed = run("Let's proceed with it.", workspaceId, prefer);
  capacity(proceed);
  writesZero(proceed);
  assert.equal(proceed.npsDecisionCommitment?.approvedDecisionId, null);

  const topic = run("Tell me about Margin Pressure.", workspaceId, proceed);
  writesZero(topic);
  const staleYes = run("Yes.", workspaceId, topic);
  writesZero(staleYes);
  assert.notEqual(staleYes.npsPath?.currentState, "EXECUTING");

  const back = run("Let's work on Capacity Gap.", workspaceId, staleYes);
  capacity(back);
  writesZero(back);

  const confirm = run("Yes.", workspaceId, back);
  capacity(confirm);
  writesZero(confirm);
  if (confirm.npsDecisionCommitment?.approvedDecisionId) {
    assert.equal(confirm.npsExecutionMonitoring?.decisionId, confirm.npsDecisionCommitment.approvedDecisionId);
    assert.ok(
      confirm.npsExecutionMonitoring?.executionId == null ||
        confirm.npsExecutionMonitoring.readinessStatus === "ALREADY_EXECUTING",
    );
  }

  const ready = run("Are we ready to execute?", workspaceId, confirm);
  capacity(ready);
  writesZero(ready);
  if (!ready.npsDecisionCommitment?.approvedDecisionId) {
    assert.equal(ready.npsExecutionMonitoring?.readinessStatus, "NOT_READY");
    assert.equal(ready.npsExecutionMonitoring?.executionHandoffStatus, "NOT_AUTHORIZED");
  }

  const start = run("Start it.", workspaceId, ready);
  capacity(start);
  writesZero(start);
  if (start.npsExecutionMonitoring?.readinessStatus === "BLOCKED") {
    assert.equal(start.npsExecutionMonitoring.executionHandoffStatus, "NOT_AUTHORIZED");
  }
  if (start.npsExecutionMonitoring?.executionHandoffStatus === "FAILED") {
    assert.notEqual(start.npsPath?.currentState, "EXECUTING");
  }

  const going = run("How is it going?", workspaceId, start);
  capacity(going);
  writesZero(going);
  if (going.npsExecutionMonitoring?.progress !== "UNKNOWN") {
    assert.equal(typeof going.npsExecutionMonitoring?.progress, "number");
  }

  const wrong = run("Is anything going wrong?", workspaceId, going);
  capacity(wrong);
  writesZero(wrong);

  const fix = run("Fix it.", workspaceId, wrong);
  capacity(fix);
  writesZero(fix);
  assert.equal(fix.npsExecutionMonitoring?.npsWritesExecution, false);

  const worked = run("Did it work?", workspaceId, fix);
  capacity(worked);
  writesZero(worked);
  assert.notEqual(worked.npsOutcomeLearning?.resolutionStatus, "RESOLVED");
  assert.match(worked.response, /not enough Outcome evidence|completed, but|does not yet tell us whether|has not been reached|improved|Execution/i);

  if (worked.npsExecutionMonitoring?.outcomeHandoff.executionId) {
    assert.equal(worked.npsOutcomeLearning?.executionId, worked.npsExecutionMonitoring.outcomeHandoff.executionId);
    assert.equal(worked.npsOutcomeLearning?.decisionId, worked.npsExecutionMonitoring.outcomeHandoff.decisionId);
  }

  const caused = run("So External Capacity caused the improvement?", workspaceId, worked);
  capacity(caused);
  writesZero(caused);
  assert.equal(caused.npsOutcomeLearning?.attribution, "NOT_ESTABLISHED");
  assert.match(caused.response, /does not establish|doesn’t establish|doesn't establish|not establish/i);

  const solved = run("Is Capacity Gap solved?", workspaceId, caused);
  capacity(solved);
  writesZero(solved);
  assert.notEqual(solved.npsOutcomeLearning?.resolutionStatus, "RESOLVED");

  const next = run("What should we do now?", workspaceId, solved);
  capacity(next);
  writesZero(next);
  assert.match(next.response, /reassess|Outcome|evidence|remaining|not enough/i);
  assert.equal(next.npsOutcomeLearning?.npsWritesDecision, false);
  assert.equal(next.npsExecutionMonitoring?.npsWritesExecution, false);
});

test("NPS:FINAL live — negative: generic Yes, start without Decision, ambiguous Investigate it", () => {
  const workspaceId = setup();
  const yes = run("Yes.", workspaceId);
  freezeAttached(yes);
  writesZero(yes);
  assert.equal(yes.npsDecisionCommitment?.approvedDecisionId, null);
  assert.notEqual(yes.npsPath?.currentState, "DECIDED");

  const start = run("Start it.", workspaceId, yes);
  writesZero(start);
  assert.equal(start.npsExecutionMonitoring?.readinessStatus, "NOT_READY");
  assert.equal(start.npsExecutionMonitoring?.executionId, null);
  assert.notEqual(start.npsPath?.currentState, "EXECUTING");

  const worked = run("Did it work?", workspaceId, start);
  writesZero(worked);
  assert.notEqual(worked.npsOutcomeLearning?.resolutionStatus, "RESOLVED");

  const ambiguous = run("Investigate it.", workspaceId);
  freezeAttached(ambiguous);
  writesZero(ambiguous);
  assert.ok(
    ambiguous.npsUnderstanding?.problemOwnership !== "DETERMINED" ||
      ambiguous.npsUnderstanding?.action === "CLARIFY_PROBLEM" ||
      Boolean(ambiguous.npsUnderstanding?.problemId),
  );
});
